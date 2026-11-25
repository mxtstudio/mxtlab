# Database Access-Control Review — 26 November 2026

## Scope

Read-only review of selected public-schema grants and RLS policies, the Supabase security-advisor output, and repository references for the conversation tables. No database writes, grants, policy changes, migrations, or user-data changes were performed.

This is a focused follow-up to the broader architecture audit, not a claim that every table and SECURITY DEFINER function has been exhaustively penetration-tested.

## How to interpret the Supabase advisor warnings

The advisor reported:
- 3 public-schema objects visible to the `anon` role through GraphQL: `lessons`, `store_categories`, and `store_products`.
- 51 public-schema objects discoverable in the GraphQL schema to authenticated users.
- 25 SECURITY DEFINER functions executable by authenticated users.
- 21 tables with RLS enabled but no policies (including internal `districtos` tables and internal/public tables).
- Leaked-password protection disabled and `pg_net` installed in `public`.

These findings are not, by themselves, proof that private rows can be read or changed. GraphQL schema discoverability is different from row access: table grants expose an API surface, while RLS policies still determine which rows a caller can access. Several no-policy tables have client grants revoked, so the advisor's informational RLS finding must not be "fixed" by adding broad policies.

The three anonymous GraphQL-visible tables appear to be catalogue/content objects intended for public browsing. Their exposure should remain intentional and separately tested.

## Selected sensitive-table policy review

The following live policies were inspected:

- `profiles`: SELECT is limited to the caller's own profile, administrators, and students explicitly linked to the caller through the teacher-student relationship. UPDATE includes checks preserving the caller's role and school. The current self-insert policy still permits a user to insert their own profile with a non-student role if the insert path is reached; PR #46 proposes a reviewed migration that limits self-inserts to `student`. That migration has not been applied.
- `teacher_applications`: users can submit only their own pending application while their profile is a student; SELECT is limited to the applicant or an administrator.
- `student_progress` and `practice_attempts`: SELECT is limited to the record owner, an explicitly linked teacher, or an administrator as applicable. Progress INSERT/UPDATE/DELETE is owner-scoped.
- `quiz_attempts`: INSERT is owner-scoped; SELECT is limited to the student or a linked teacher.
- `roster_students` and `roster_shares`: ownership, school membership and explicit share relationships constrain access.
- `license_keys`: SELECT and UPDATE are scoped to the caller's own `profile_id`.
- `sessions`: SELECT/UPDATE are limited to the owner or an administrator.
- `subscriptions`: the inspected policy is administrator-only.
- `messages` and `conversations`: message SELECT requires conversation membership; message INSERT requires the sender to be the caller and the caller to be a member.

## Latent messaging policy weakness

The live policy `conversation_members_insert_self` checks only that the inserted `user_id` equals `auth.uid()`. It does not verify that the caller created the conversation, received an invitation, or has another valid join authorization.

Because `conversations_select_members` and `messages_select_members` grant access based on membership, a user who obtains a conversation UUID could potentially insert themselves as a member and then read that conversation's messages.

At the time of review:
- `conversations`: 0 rows
- `conversation_members`: 0 rows
- `messages`: 0 rows
- No application-code references to `conversation_members` were found in the repository.

This is a latent design weakness with no current message rows or observed application use. Before enabling messaging, replace the open self-join policy with an invitation/participant-authorization mechanism (for example, creator/admin-controlled member insertion or a validated invite token). Do not simply add a broad policy or enable the messaging UI before that design is in place.

## SECURITY DEFINER function review

The advisor's 25 authenticated-executable SECURITY DEFINER findings require per-function review; the presence of EXECUTE privilege is not sufficient to establish a vulnerability. The inspected `public.current_role_is_admin()` function:
- has a fixed `search_path`;
- checks the caller's own `auth.uid()` against their own profile role;
- accepts no target-user argument;
- returns only a boolean; and
- is not executable by `anon`.

Other functions must be assessed individually for caller identity checks, target-object ownership, role checks, and safe search paths before any EXECUTE grants are changed. Revoking EXECUTE indiscriminately could break RLS policies or application workflows.

## Recommended order of work

1. Review and approve PR #46's self-profile insert restriction; do not apply its migration merely to satisfy CI.
2. Design the messaging invitation/member-join authorization before the conversation feature is activated.
3. Review the 25 SECURITY DEFINER functions in groups, prioritising functions that accept arbitrary target IDs or perform privileged writes.
4. Review GraphQL discoverability separately from REST/RLS row permissions; revoke client grants only where the application does not need them.
5. Enable leaked-password protection after checking the current Auth configuration and impact on sign-in.
6. Move `pg_net` out of `public` only after checking dependent functions and extensions.

## Change record

Documentation-only. No database objects, grants, policies, users, accounts, student progress, classes, or application deployments were changed.
