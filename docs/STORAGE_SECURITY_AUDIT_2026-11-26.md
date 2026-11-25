# Supabase Storage Security Audit — 26 November 2026

## Scope and method

Read-only inspection of the live Supabase Storage bucket configuration, Storage table RLS state, `storage.objects` policies, relevant administrator-check function, and object counts. No SQL writes, policy changes, uploads, deletions, or migrations were performed.

## Bucket configuration

| Bucket | Public? | Maximum file size | Allowed content types |
|---|---:|---:|---|
| `curriculum-pdfs` | No | 25 MiB | PDF |
| `department-resources` | No | 10 MiB | PDF, Word, PowerPoint, Excel, JPEG, PNG |
| `teacher-applications` | No | 5 MiB | PDF, JPEG, PNG |

RLS is enabled on both `storage.objects` and `storage.buckets`. The `anon` and `authenticated` roles have table-level DML grants on these Storage tables, so RLS is the effective access boundary rather than grants alone. The buckets table has no policies, which prevents client-role access to bucket metadata through RLS-protected queries; `storage.objects` has the bucket-scoped policies described below.

At the time of this audit, `storage.objects` contained **zero objects**. This is a point-in-time observation, not a guarantee about future uploads. Because the buckets are empty, existing-object ownership and cross-user download behaviour could not be exercised against live files.

## Access policy map

### `curriculum-pdfs`

- SELECT requires a non-null `auth.uid()`, so anonymous users do not satisfy the policy.
- INSERT, UPDATE and DELETE require the caller to be an administrator or a profile with the teacher role.
- The policies currently target the PostgreSQL `public` role rather than explicitly targeting `authenticated`. Their predicates still require a signed-in identity or staff authorisation, and the inspection found no anonymous access path. Narrowing the policy role to `authenticated` would nevertheless be a useful defence-in-depth improvement.
- The UPDATE policy has no explicit `WITH CHECK` expression. PostgreSQL falls back to the USING expression when a separate check is omitted; an explicit matching check would make the intended boundary easier to review and maintain.

### `department-resources`

- SELECT is limited to teachers in the same department and administrators.
- INSERT is limited to teachers in their department's folder, with the uploader's profile ID as the next path segment. A one-folder legacy path is temporarily accepted for compatibility.
- DELETE is limited to the uploader's own department/user folder or an administrator.
- There is no UPDATE policy. Object replacement/upsert is therefore not enabled by these policies; uploads use non-upsert semantics in the current Teacher OS client.

### `teacher-applications`

- INSERT requires the first path segment to match the authenticated user's profile UUID and constrains the filename to a UUID-like basename with PDF/JPG/JPEG/PNG extension.
- SELECT and DELETE are limited to the applicant's own folder or an administrator.
- The bucket is private, and the admin review UI generates short-lived signed URLs for document access.

## Relevant privileged helper

`public.current_role_is_admin()` is SECURITY DEFINER, has a fixed `search_path`, and checks the caller's `auth.uid()` against their own `profiles.role`. The function is executable by authenticated users but not by `anon`. It returns only a boolean about the current caller; it does not accept a target user ID or disclose another profile.

## Findings and follow-up

The Supabase security advisor returned no finding specifically targeting Storage buckets or `storage.objects` policies. It did return separate database/API/auth warnings (including GraphQL object discoverability, authenticated-executable SECURITY DEFINER functions, leaked-password protection disabled, and `pg_net` in `public`); those require their own review and are not evidence of a Storage-policy bypass.


1. **No confirmed anonymous Storage access.** All three buckets are private, RLS is enabled, and the inspected policies contain identity/role predicates.
2. **Defence-in-depth opportunity:** change the `curriculum-pdfs` policies from `TO public` to `TO authenticated` and state the UPDATE `WITH CHECK` explicitly. This is a policy clarity/hardening recommendation, not evidence of a current bypass.
3. **No live objects to test.** The zero-object result means uploader-folder ownership, signed URL delivery, and cross-department denial still need test fixtures in an isolated preview/test environment before any policy changes are released.
4. **Preserve existing access model.** Do not make any bucket public, add broad read policies, or remove the legacy department-resource path until the matching client rollout and stored-object inventory are verified.

## Change record

This audit is documentation-only. It did not alter Storage policies, bucket settings, objects, database rows, accounts, or application deployments.
