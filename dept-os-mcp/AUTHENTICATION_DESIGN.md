# Authenticated MCP implementation plan

Status: design decision for the next implementation PR; not a claim that authentication is implemented.

## Decision

Use per-user authentication for remote MCP. Do not rely on an unauthenticated URL, a single shared bearer secret, a user ID supplied in tool arguments, or a global `DEMO_TEACHER_ID`.

The MCP access token must represent one authenticated MXT Lab user. Each tool invocation must derive the user identity from the verified token and enforce that identity in every database read/write.

## Why the current setup is not enough

- The current package pins `@vercel/mcp-adapter` at `^0.5.0`.
- The current route is unauthenticated and calls the service-role Supabase client with a single `DEMO_TEACHER_ID`.
- A service-role client bypasses RLS, so each query must explicitly enforce ownership.
- The main site's browser-side Supabase session does not automatically authenticate a separate remote MCP client.

## Required implementation shape

1. **MCP authorization:** implement a supported OAuth 2.1 authorization flow for remote MCP clients, using the current adapter's supported authentication middleware or a verified compatible upgrade.
2. **Identity bridge:** authenticate the user through MXT Lab's existing identity provider. The OAuth access token's verified subject must map unambiguously to a Supabase `auth.users.id` / `profiles.id`.
3. **Request-scoped identity:** expose the verified principal to tool handlers through request-scoped auth context. Never store a current user in module-level mutable state.
4. **Database access:** derive `teacher_id` from the verified principal. Keep the service-role key server-only and include explicit ownership predicates on every read/write. Evaluate whether a user-scoped client is preferable.
5. **Dashboard:** protect the Next.js dashboard with a server-verified session and query only the signed-in user's rows. Do not rely on client-only redirects.
6. **Public resources:** keep the static public resource pages available without login.
7. **Migration:** treat enabling authentication as a connector configuration change. Document how to reconnect the existing personal Claude connector and test a preview deployment before production.

## Acceptance tests

- Missing, malformed, expired, revoked, or wrong-audience tokens are rejected.
- The verified token subject maps to exactly one allowed teacher account.
- Two independently authenticated teachers can save and retrieve their own artifacts.
- Teacher A cannot access Teacher B's records through any argument, filter, replay, or request-order manipulation.
- The dashboard requires a verified session and shows only that user's entries.
- Public resources still work logged out.
- No database migration is run without inspection of the actual target project.
- Existing personal connector migration instructions are tested before production rollout.

## Explicit non-goals

- No shared master token for all teachers.
- No trust in an unverified `x-user-id`, query parameter, or tool argument.
- No production database changes as part of the auth code PR.
- No claim of security based solely on RLS while using the service-role key.

## Implementation caution

The existing adapter version and current MCP client capabilities must be verified before choosing the exact OAuth middleware API. Do not make the endpoint appear protected with a custom check that breaks protocol discovery, session/request handling, or fails to bind the authenticated identity to tool execution.
