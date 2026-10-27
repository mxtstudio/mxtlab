# MXT Lab — Technical and Security Audit Report

**Audit date:** 24 October 2026  
**Repository:** [mxtstudio/mxtlab](https://github.com/mxtstudio/mxtlab)  
**Reviewed revision:** `main` at `97dc09ba71dd0632eec6b2556e68f40278d32a8c` (after PR #11 was merged)  
**Scope:** Read-only review of repository files, recent authentication changes, previously reported Vercel check statuses, and teacher-facing code.  
**Status:** Preliminary audit. Live Supabase configuration, Vercel build logs, production HTTP headers, and end-to-end authentication tests were not available for direct verification.

---

## Executive summary

MXT Lab currently has two distinct deployment targets: the public static website and the separate Next.js MCP application under `dept-os-mcp/`. The available checks reported a successful Vercel status for `mxtlab-8e22` and a failed status for `mxtlab`. These statuses do not establish that the projects are duplicates. **Do not delete either project based on this audit.** Confirm each project's root directory, production domain, environment variables, and deployment logs first.

PR #10 introduced Supabase bearer-token verification for MCP requests and request-scoped teacher identity. PR #11 corrected a regex that previously failed to parse normal whitespace in an Authorization header. PR #11 is merged. These changes are progress, but they do not by themselves establish that the complete deployed service is secure or ready for multi-teacher production use.

**Release recommendation: Hold a public multi-teacher launch until the deployment failure is understood, authentication and tenant-isolation tests pass, and live Supabase authorization rules are reviewed.** The public learning website and the teacher/MCP features should be assessed separately.

## Findings summary

| ID | Priority | Finding | Evidence status |
|---|---|---|---|
| DEP-01 | High | Main `mxtlab` deployment check reported failure; root cause unknown | Status observed; logs not inspected |
| DEP-02 | Medium | Two Vercel projects appear to serve separate app roots; duplication is not established | Repository structure reviewed; live settings not verified |
| SEC-01 | High | MCP uses a server-side service-role key, which bypasses RLS; all privileged queries must enforce verified ownership | Code/documentation reviewed; deployed behaviour not tested |
| SEC-02 | High | Bearer-token authentication exists, but a complete teacher-friendly OAuth/sign-in and refresh flow remains outstanding | Code and design documentation reviewed |
| SEC-03 | High | Cross-teacher data isolation and concurrent request isolation are not proven by automated or live tests | Tests not run |
| SEC-04 | High | MCP browser dashboard is intentionally closed pending server-session authentication | Repository page reviewed |
| DB-01 | High | Live RLS policies, grants, and privileged RPC function definitions have not been inspected | Live database unavailable for this audit |
| WEB-01 | Medium | `_headers` is a Netlify-style configuration file; confirm actual response headers on Vercel | Configuration implication; production headers not fetched |
| SEO-01 | Low | Sitemap includes pages that declare `noindex`, including `dashboard.html` and `teacher-os.html` | Repository files reviewed |
| DOC-01 | Medium | Previous audit contained findings that no longer match the current repository and needed replacement | Prior report compared with current repository |
| CLEAN-01 | Low | Legacy demo helper and `DEMO_TEACHER_ID` reference remain in MCP library/docs | Search results reviewed |

---

## 1. Deployment architecture and status

### Observed structure

- The public website is a static multi-page site with root-level HTML pages, assets, and lesson pages.
- The MCP application is a separate Next.js app in `dept-os-mcp/`, with its own `package.json` and application route.
- A separate Vercel project can be appropriate when its Root Directory points to `dept-os-mcp`, while the main project serves the website root.

### Status captured during this review

- **`mxtlab-8e22`:** Vercel check reported success.
- **`mxtlab`:** Vercel check reported failure.

Deployment links:
- [Main website deployment](https://vercel.com/mxt-lab/mxtlab/DkLQNVsaYi6CfAfzzFCdi5ayyeTq)
- [MCP deployment](https://vercel.com/mxt-lab/mxtlab-8e22/HzqoBkLbTBbMursMFEiVgWJNvYo2)

The links above are deployment references available during the review; their present status may change. The failed build's logs were not accessible to this audit, so the cause is **unknown**, not diagnosed.

### Required checks

1. Open the failed main-site deployment and capture the first relevant build error.
2. In each Vercel project, record Root Directory, production domains, Git repository/branch, build command, output settings, and required environment-variable names.
3. Confirm that the MCP project's Root Directory is `dept-os-mcp` if that is the intended configuration.
4. Confirm the main site's production URL and the MCP endpoint URL are the intended ones.
5. Do not delete either project until the configuration and domain dependencies are documented.

---

## 2. MCP authentication and authorization

### Improvements present in the current implementation

- The MCP route expects an `Authorization: Bearer <token>` header.
- It verifies the supplied token with Supabase Auth using the configured Supabase URL and anon key.
- The route requires a matching profile and uses the verified teacher identity for data operations.
- Read operations are filtered by teacher ID.
- PR #11 corrected the Bearer-header regular expression to use `\s` for whitespace.
- The previous demo dashboard was closed rather than left accessible with a fixed demo identity.

Relevant files:
- [MCP route](https://github.com/mxtstudio/mxtlab/blob/main/dept-os-mcp/app/api/mcp/route.ts)
- [Supabase client helpers](https://github.com/mxtstudio/mxtlab/blob/main/dept-os-mcp/lib/supabase.ts)
- [Authentication design](https://github.com/mxtstudio/mxtlab/blob/main/dept-os-mcp/AUTHENTICATION_DESIGN.md)
- [MCP README](https://github.com/mxtstudio/mxtlab/blob/main/dept-os-mcp/README.md)

### Remaining risks and verification gaps

The service-role key bypasses Row Level Security. This means security depends on every privileged database operation deriving identity from a verified token and applying ownership checks correctly. The token parsing fix does not prove that the whole request lifecycle, all tools, and concurrent requests preserve the correct identity.

The current bearer-token approach is also not the final teacher experience. A durable launch needs a supported OAuth/sign-in flow, secure token handling, and a clear refresh/reconnect experience. Do not ask teachers to treat manually copied access tokens as a normal long-term login workflow.

### Required authentication test matrix

| Test | Expected outcome |
|---|---|
| No Authorization header | 401 / unauthorized |
| Malformed Bearer header | 401 / unauthorized |
| Invalid, expired, or revoked token | 401 / unauthorized |
| Valid token for a user without a required profile | Denied without exposing data |
| Valid token for teacher A | Only A's permitted records returned |
| Teacher A attempts to read/update teacher B's record | Denied or no record returned |
| Two simultaneous requests for different teachers | Each request remains bound to its own identity |
| Database or Auth service failure | Safe error; no secrets or raw sensitive details returned |

These are acceptance criteria, **not results of tests already run**. No valid or invalid live tokens were exercised as part of this audit.

---

## 3. Dashboard and Supabase database

The MCP dashboard page is intentionally disabled until server-side browser-session authentication is implemented. Keep it disabled rather than restoring a page that uses a service-role client and demo teacher ID without authenticating the browser user.

The repository contains a demo `schema.sql` and references to teacher-facing tables and RPC functions. Repository SQL is not proof of the live database state. Before enabling the dashboard or multi-teacher writes, inspect the actual Supabase project for:

- RLS enabled on every table containing teacher or school data;
- SELECT, INSERT, UPDATE, and DELETE policies scoped to the authenticated user and authorized roles;
- table grants that do not accidentally permit broader access;
- definitions and execution privileges for privileged RPC functions, including lesson-plan submission/review and school-claim operations;
- immutable or server-validated ownership fields;
- least-privilege access for service-role operations, with explicit ownership checks in each server-side path.

Do not blindly reapply the repository's demo schema to production. No production database changes were made in this audit.

---

## 4. Web hosting and response headers

The repository includes a root `_headers` file. That filename and format are commonly associated with Netlify configuration; do not assume Vercel applies its rules. Verify the actual HTTP response headers on the production domain. If headers are missing, configure them using the deployment platform's supported configuration.

Check at minimum:
- Content-Security-Policy (introduced carefully to avoid breaking required scripts);
- Strict-Transport-Security on HTTPS production domains;
- X-Content-Type-Options;
- Referrer-Policy;
- an appropriate Permissions-Policy;
- framing restrictions appropriate for the site's actual embeds.

Do not copy a strict CSP into production without testing the site's analytics, Supabase, fonts, and other required third-party scripts.

---

## 5. Sitemap and SEO

The current repository's sitemap includes `dashboard.html` and `teacher-os.html`, while those pages declare `noindex`. Pages intended to stay out of search results generally should not be advertised as indexable sitemap entries.

Recommended follow-up:
1. Remove private or `noindex` pages from the sitemap unless there is a documented reason to retain them.
2. Keep canonical public learning pages and valid public lesson URLs in the sitemap.
3. Check sitemap URLs against the deployed site, not just the repository.
4. Submit the corrected sitemap in Search Console after the change is deployed.

---

## 6. Legacy code and documentation accuracy

The current MCP library still contains a `getDemoTeacherId()` helper that reads `DEMO_TEACHER_ID`. Repository search also finds this variable in setup documentation. The current route no longer appears to rely on the old demo identity, but unused demo helpers and stale setup instructions can cause future deployment mistakes.

Recommended cleanup:
- Search the whole MCP app for all callers of `getDemoTeacherId()` and `DEMO_TEACHER_ID`.
- Remove the helper only after confirming there are no legitimate callers.
- Update the README to describe only the current authentication contract and required environment variables.
- Keep the security review and authentication design clearly labeled as documents, not proof of successful tests.

The previous July 2026 audit claimed 237 broken links to `teachers.html` and said the sitemap omitted `teacher-os.html` and `dashboard.html`. Current repository navigation/search results point to `teacher-os.html`, and the sitemap already contains both pages. The old audit's counts and recommendations should not be treated as verified current findings. This report supersedes that stale assessment; it does not claim that every production URL has been crawled.

---

## 7. Recommended action plan

### P0 — before teacher data is enabled
- [ ] Diagnose the failed main-site Vercel build.
- [ ] Verify each Vercel project's root directory, production domain, and environment-variable configuration.
- [ ] Run the authentication test matrix against a safe preview/staging environment.
- [ ] Test two-account ownership isolation, including concurrent requests.
- [ ] Review live Supabase RLS, grants, and privileged RPC definitions.
- [ ] Keep the MCP dashboard closed until server-session authentication is implemented and tested.

### P1 — before wider launch
- [ ] Implement and test a supported OAuth/sign-in and refresh/reconnect flow for the MCP client.
- [ ] Verify actual production response headers and configure them in the supported Vercel mechanism.
- [ ] Remove `noindex` pages from the sitemap and validate public URLs.
- [ ] Remove obsolete demo identity code/configuration after checking all callers.
- [ ] Add repeatable automated tests to the repository and require passing checks before merge.

### P2 — operational readiness
- [ ] Add appropriate rate limits and abuse monitoring.
- [ ] Ensure logs do not record access tokens, service-role secrets, or unnecessary personal data.
- [ ] Document incident response, backups, retention, and account recovery.
- [ ] Run a fresh build and smoke test for both apps after deployment.

---

## Audit limitations

This was a read-only repository and deployment-status review. It was not a penetration test, a complete crawl of all production URLs, or an inspection of the live Supabase database. I could not retrieve the failed Vercel build logs or run a successful local build in the available environment. The audit therefore distinguishes observed code/configuration from items that remain unverified.

**Final decision:** Keep both Vercel projects. Resolve the deployment failure and complete the security acceptance tests before treating MXT Lab's teacher workspace as ready for multiple teachers.

## Addendum — live Supabase inspection (2026-10-25)

Finding **DB-01** (live RLS policies, grants and privileged RPC definitions not inspected) is now partly closed. Live project `mqiwckclyohjdhjaoaor` was inspected and the Supabase security and performance advisors were run.

Verified:
- RLS is enabled on every sensitive `public` table checked (`api_tokens`, `license_keys`, `subscriptions`, `profiles`, `audit_logs`, `sessions`, `teacher_requests`, `dashboard_entries`); policies are keyed to `auth.uid()`, so `anon` cannot read rows.
- The web client only calls RPCs intended for signed-in users (`submit_lesson_plan`, `review_lesson_plan`, `claim_school`, `increment_resource_downloads`, `assign_department_member`, `remove_department_member`).
- `audit_logs` and `version_history` were empty, and no calls to the affected functions appeared in the 24 h of API logs available, so no abuse of the exposure was found.

Fixed (see `supabase/migrations/`):
- Four SECURITY DEFINER functions with no caller check (`log_audit_event`, `record_document_version`, `snapshot_all_department_health`, `compute_department_health`) were executable by `anon` through `/rest/v1/rpc/`. Execute is now revoked from `anon`, `PUBLIC` and `authenticated`; all other flagged functions are closed to `anon`.
- `search_path` pinned on the five `set_*_updated_at` trigger functions.
- 55 RLS policies rewritten to `(select auth.uid())`; 40 missing foreign-key indexes added.

Still open:
- Leaked-password protection is disabled in Supabase Auth (dashboard setting).
- The `districtos` schema (17 tables) has RLS enabled with no policies, so it is deny-all until policies are written.
- 14 multiple-permissive-policy warnings and the `pg_net`-in-`public` warning are unaddressed.
- SEC-01 to SEC-04 (service-role MCP, per-teacher auth flow, tenant-isolation tests, dashboard session auth) are unchanged by this work.

### Addendum — automated authentication tests (2026-10-27)

The "Required authentication test matrix" in section 2 is now implemented as automated tests in `dept-os-mcp/tests/` (`npm test`, 30 tests) and all pass against the current `route.ts`.

| Matrix row | Result |
|---|---|
| No Authorization header | 401, `WWW-Authenticate: Bearer`, `no-store`, no data |
| Malformed Bearer header | 401 for `Bearer`, blank token, `Basic`, `Token`, bare token, missing space, empty; standard Bearer variants (case, extra spaces) accepted |
| Invalid, expired or revoked token | 401, including a token revoked mid-session and injection-style strings |
| Valid token, no profile | 401 on both tools; nothing written |
| Teacher A returns only A's records | Pass, including with subject/grade/type filters |
| Teacher A vs teacher B's records | Spoofed `teacher_id`/`user_id`/`id` arguments ignored; B's rows unchanged; only `save_to_dashboard` and `get_my_dashboard` are exposed (no update, delete or by-id tools) |
| Simultaneous requests, different teachers | 50 interleaved writes and 20 reads: every row owned by the correct teacher, no cross-reads |
| Database or Auth failure | 401 or generic "Save failed"/"Retrieval failed"; no secrets, hostnames or stack details in responses; no tokens or keys in logs |

Scope and limits: the tests use an in-memory fake of Supabase, so they verify the route's own logic only. The fake's service client bypasses RLS like the real service-role key, which is why per-teacher filtering in the route matters. They do not exercise real Supabase Auth, token refresh, a deployed preview, or RLS on `dashboard_entries`; the P0 item "run the authentication test matrix against a safe preview/staging environment" therefore remains open.

New finding (low severity): after a tool-argument validation error (for example a blank `subject` or content over 50,000 characters) the MCP response stream is left open until the function's `maxDuration` (60 s) with `@modelcontextprotocol/sdk` 1.12.0 and `@vercel/mcp-adapter` 0.5. The JSON-RPC error is delivered and nothing is written, but an authenticated client could hold connections open. Consider upgrading both packages and re-running the tests; the known-issue test will start failing once it is fixed.

Not covered: SEC-02 (supported OAuth/refresh flow), rate limiting, and the dashboard session login.
