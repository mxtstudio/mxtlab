# SECURITY DEFINER Function Review — 2026-11-25

## Scope and method

Read-only review of live PostgreSQL function definitions, function ACLs, relevant table constraints, and the Supabase Security Advisor output for project `mqiwckclyohjdhjaoaor`. No SQL was applied and no production data was changed.

This is a targeted review of the exposed `public` SECURITY DEFINER functions. It is not a full penetration test and does not establish exploitability for every function under every account configuration.

## Finding: department assignment does not validate the target profile's school or eligibility

**Severity: High — authorization/integrity boundary**

Function: `public.assign_department_member(_profile_id uuid, _department_id uuid, _dept_role text, _subjects text[])`

Verified properties:

- The function is `SECURITY DEFINER` and has an empty search path.
- The live ACL grants `EXECUTE` to `authenticated`.
- The caller is accepted when they are either an HOD for the supplied department or an admin.
- The function validates `_dept_role` as `teacher` or `hod`.
- It then updates the supplied `_profile_id` without checking that the target belongs to the department's school, is an eligible unassigned student, or is otherwise authorized for transfer.
- For any target profile whose current role is not `admin`, the update sets `profiles.role = 'teacher'`, then inserts or updates the target's `department_roles` row.

Because this function runs with definer privileges, the target-profile update is not constrained by the caller's ordinary profile RLS policies. A caller with HOD authority for one department can therefore submit a known profile UUID outside the intended candidate set; the function itself does not enforce same-school membership or the intended candidate eligibility. This can produce cross-school department membership and promote a student account to the teacher role.

The Teacher OS UI's candidate query filters for `role = 'student'` and `department_id IS NULL`, but a browser-side filter is not a server-side authorization boundary. The RPC must enforce the same restrictions independently.

### Recommended remediation

Before changing this function, confirm the intended HOD assignment workflow. The UI candidate query suggests the normal HOD workflow is to assign only unassigned student accounts.

At minimum, the function should:

1. Resolve the target department's `school_id` from `departments` rather than trusting caller-supplied school context.
2. Resolve the target profile and reject a missing profile.
3. For HOD callers, require the target profile's `school_id` to equal the department's school and require the target to be an unassigned student (`role = 'student'` and `department_id IS NULL`), matching the visible candidate query.
4. Keep admin authority explicit and separately documented; do not silently allow HOD rules to become broader through an admin branch.
5. Validate subjects and role assignment against the department's supported configuration if such constraints exist.
6. Add SQL-level regression tests proving that an HOD cannot assign a student from another school, an already assigned account, or an arbitrary teacher/admin account, while valid same-school assignment and authorized admin workflows continue to work.

Do not simply revoke all authenticated execution: the RPC is part of the department management workflow. Do not change production until the intended admin and HOD assignment cases have been tested in an isolated database branch.

## Other functions reviewed

The following exposed SECURITY DEFINER functions were inspected at definition level:

- `approve_or_decline_teacher_request`: checks the caller is an HOD for the request's department, locks the pending request, and applies the decision to the linked user. No immediate cross-department authorization gap was identified in the reviewed body.
- `review_teacher_application`: checks `auth.uid()` and `current_role_is_admin()`, locks a pending application, promotes only an existing student profile (or accepts an already-teacher profile), and records the decision. Review the intended follow-up process for school/department assignment separately.
- `review_sap` and the primary `review_lesson_plan` overload: verify HOD membership in the record's department before changing review state.
- The legacy `review_lesson_plan(_lesson_plan_id, _decision text, _notes)` overload allows either a department HOD or an admin. Multiple overloads of the same RPC name increase API ambiguity; inventory all callers and retire obsolete overloads only after compatibility testing.
- `claim_school`: requires the caller's own profile to be a student on the platform school before changing their own school.
- `create_class_code` and `join_class_with_code`: scope class-code creation to the caller's teacher account and class joining to the caller's student account, matching school IDs.
- `generate_my_api_token`: requires an authenticated teacher/admin profile and stores only a SHA-256 token hash; returns the raw token once.
- `submit_lesson_plan`: updates only a lesson plan owned by `auth.uid()`.
- `is_my_student`, `is_teacher_in_school`, `roster_is_same_school_teacher`, and `roster_shared_with_me`: use the caller's identity in their predicates rather than trusting the caller to supply the acting user ID.
- `increment_resource_downloads`: updates only a resource in the caller's own department; an unmatched target produces no update.

## Advisor context

Supabase Security Advisor reported 25 authenticated-executable SECURITY DEFINER function signatures and leaked-password protection disabled. The 25-function warning is not proof that all 25 functions are vulnerable: several are intentional RPCs with caller/ownership checks. Continue reviewing each function's authorization predicates and grants rather than revoking EXECUTE indiscriminately.

Leaked-password protection should be enabled after reviewing its authentication impact and user communication. No Auth setting was changed as part of this audit.

## Verification status

- Live function definitions and ACLs: inspected read-only.
- Table constraints for profiles, department roles, departments, schools, teacher requests, and teacher applications: inspected read-only.
- SQL regression tests for the finding: not yet run.
- Migration or production change: not performed.
