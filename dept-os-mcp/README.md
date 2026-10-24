# MXT Lab Department OS — MCP service

This application contains two MCP tools:
- `save_to_dashboard`
- `get_my_dashboard`

## Security status

The MCP endpoint requires an individual Supabase access token and validates it with Supabase Auth. Each tool derives its teacher identity from the verified token subject; no tool argument or global demo teacher ID is trusted for ownership.

**This is a bearer-token authentication slice, not yet a complete OAuth sign-in flow for remote MCP clients.** A client must be configured to send an individual teacher's valid Supabase access token. Tokens expire; do not paste tokens into shared documents, source code, or public chats. OAuth discovery/authorization-server integration and a user-friendly reconnect flow still need to be implemented and tested before a broad teacher rollout.

The dashboard page has been temporarily closed because the old page used a service-role key and demo identity without a verified browser session. It must not be reopened until server-side session authentication and ownership checks are in place.

A service-role key bypasses Supabase Row Level Security (RLS). Keep it server-side, and retain explicit ownership predicates in all queries.

## Required server environment variables

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` — used only to ask Supabase Auth to verify bearer tokens
- `SUPABASE_SERVICE_ROLE_KEY` — server-only database operations; never expose it to browser code

Remove `DEMO_TEACHER_ID` from this application's environment once no other code requires it.

## Validation before deployment

1. Run `npm ci` and `npm run build` in the `dept-os-mcp` directory.
2. Verify missing, malformed, expired, and revoked tokens are rejected.
3. With two test accounts, confirm each can save/read their own records and cannot read the other's records.
4. Confirm the dashboard remains closed until its own session-authentication flow is ready.
5. Test in a preview deployment against an isolated Supabase project, not production.
6. Confirm the exact MCP client can send a per-user bearer token. Do not describe this interim setup as OAuth.

See [AUTHENTICATION_DESIGN.md](./AUTHENTICATION_DESIGN.md) for the full target architecture and acceptance criteria.
