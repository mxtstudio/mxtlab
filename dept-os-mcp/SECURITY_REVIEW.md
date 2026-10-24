# MCP Security Review — Multi-user release gate

Last reviewed: 2026-10-24

## Current status

**Not ready for multi-user or public production use.** This review describes repository code, not the live Vercel configuration or the current Supabase database state.

The MCP route on `main` accepts requests without application-level user authentication, uses a Supabase service-role client that bypasses Row Level Security (RLS), and assigns every save and retrieval to `DEMO_TEACHER_ID`. The dashboard page also uses the service-role key and the same demo ID. It is therefore a single-account demonstration, not a secure teacher dashboard.

This branch adds bounded input validation, generic database error messages, narrower database selects, and disables verbose adapter logs. These are defensive improvements only. They do not fix the lack of verified per-user authentication or the hardcoded demo identity.

## Required before inviting teachers

1. **Authenticate every MCP request.** Use a supported, verified identity flow. Do not trust a teacher ID supplied in tool arguments or unverified headers.
2. **Bind identity to each request/session.** Every save and read must derive the teacher ID from the verified identity for that request. Do not use a global mutable variable or a shared demo ID.
3. **Keep authorization server-side.** Verify ownership on every read/write. If the service-role client remains in use, enforce the verified teacher ID in every query and test it; preferably use a narrowly scoped server-side design.
4. **Secure the web dashboard.** Require a valid signed-in session on the server and derive the teacher ID from that session. Do not use a demo ID to select user data.
5. **Review Supabase RLS.** Verify table grants and policies in the actual project. Policies for browser calls do not protect service-role calls. Confirm that users cannot alter ownership or access other users' rows.
6. **Protect secrets.** Keep `SUPABASE_SERVICE_ROLE_KEY` only in the server environment. Never put it in static assets, client bundles, logs, or public issue reports.
7. **Validate and bound inputs.** Restrict field lengths and accepted artifact types; cap retrieval limits and output sizes.
8. **Use safe errors and operational controls.** Do not return raw database errors to callers. Add rate limiting, abuse monitoring, and redacted logs.
9. **Test isolation with two accounts.** Account A must not read, overwrite, or infer Account B's records, even when requests are manipulated.
10. **Deploy safely.** Test on a preview deployment and non-production database first; confirm rollback before production rollout.

## Minimum acceptance tests

- Unauthenticated MCP calls are rejected.
- Invalid, expired, or revoked credentials are rejected.
- A valid teacher can save and retrieve their own entries.
- Teacher A cannot read Teacher B's records by changing IDs, filters, session IDs, or request order.
- Tool inputs that exceed documented limits are rejected.
- Raw database errors and secret values are not returned to clients.
- The dashboard requires authentication and shows only the signed-in teacher's entries.
- Public learning resources remain accessible when logged out.
- No production schema is changed by this code-only review.

## Deployment note

Do not run `dept-os-mcp/schema.sql` against the production Supabase project without first inspecting the actual table, grants, policies, and migration history. This document is not a database migration and does not claim the live service has been secured.
