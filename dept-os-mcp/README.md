# MXT Lab Department OS — MCP service

This application contains two MCP tools:
- `save_to_dashboard`
- `get_my_dashboard`

## Security status

The MCP endpoint now requires an individual Supabase access token in the `Authorization: Bearer` header and validates it by calling Supabase Auth. Each tool gets its teacher identity from a request-scoped context created only after token validation; tool arguments and a global demo ID are never trusted for ownership. Each database read/write retains an explicit `teacher_id` predicate where applicable.

**This is a bearer-token authentication step, not a complete OAuth sign-in flow for remote MCP clients.** A compatible client must send an individual teacher's valid Supabase access token. Tokens expire; do not paste them into shared documents, source code, or public chats. OAuth discovery/authorization-server integration and a user-friendly reconnect flow remain necessary before broad teacher rollout.

The dashboard page has been temporarily closed because the old page used a service-role key and demo identity without a verified browser session. It must not be reopened until server-side session authentication and ownership checks are in place.

A service-role key bypasses Supabase Row Level Security (RLS). Keep it server-side, and retain explicit ownership predicates in all queries.

## Required server environment variables

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` — used to ask Supabase Auth to verify bearer tokens
- `SUPABASE_SERVICE_ROLE_KEY` — server-only database operations; never expose it to browser code

Remove `DEMO_TEACHER_ID` from this application's environment once no other code requires it.

## Automated tests

```
npm ci
npm test
```

`tests/mcp-auth-isolation.test.ts` runs the real `app/api/mcp/route.ts` against an in-memory fake of Supabase (`tests/fakeSupabase.ts`) and covers the authentication matrix in `AUDIT_REPORT.md`: missing, malformed, invalid, expired and revoked tokens; users without a profile; per-teacher isolation; spoofed ownership fields; concurrent requests from two teachers; Auth and database failures (no internal details or tokens in responses or logs); and input validation.

These tests prove the route's own ownership logic. They do **not** exercise real Supabase Auth, Row Level Security, or a deployed preview, so the manual checks below are still required before enabling multi-teacher use.

Known issue: after a tool-argument validation error the MCP response stream stays open until the function's `maxDuration`. The error is delivered and nothing is written, but the connection is not released promptly. It is tracked by an `it.fails` test, which will start failing (remove `.fails`) once the SDK/adapter versions close the stream.

## Validation before deployment

1. Run `npm ci` and `npm run build` in the `dept-os-mcp` directory.
2. Verify missing, malformed, expired, and revoked tokens are rejected with HTTP 401.
3. With two test accounts, confirm each can save/read their own records and cannot read the other's records.
4. Run concurrent requests from both accounts and confirm identity never crosses between requests.
5. Confirm the dashboard remains closed until its own session-authentication flow is ready.
6. Test in a preview deployment against an isolated Supabase project, not production.
7. Confirm the exact MCP client can send a per-user bearer token. Do not describe this interim setup as OAuth.

See [AUTHENTICATION_DESIGN.md](./AUTHENTICATION_DESIGN.md) for the full target architecture and acceptance criteria.
