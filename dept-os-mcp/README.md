# MXT Lab Department OS — MCP demo

This folder contains a limited single-teacher proof of concept with two MCP tools:
- `save_to_dashboard`
- `get_my_dashboard`

## Security status — read before deploying

**This demo is not safe for a public multi-user launch. Do not connect it to real teachers' private work or treat the endpoint as production-ready.**

The current implementation has no verified per-user MCP authentication and uses `DEMO_TEACHER_ID` with the Supabase service-role key. That means all MCP calls use the configured demo identity. The dashboard page also uses that demo identity and service-role client rather than an authenticated browser session.

A service-role key bypasses Supabase Row Level Security (RLS). RLS policies alone do not protect queries made with this key. Keep the key server-side and do not expose it in client assets, logs, or chat.

See [SECURITY_REVIEW.md](./SECURITY_REVIEW.md) for the multi-user release gates and required tests.

## What has been improved on the security branch

The MCP route now bounds input lengths, caps retrieval to 20 rows, selects only required database columns, avoids returning raw database errors, and disables verbose adapter logs. These are defensive improvements only; **they do not add authentication or make this demo safe for multi-user use**.

## Demo setup (isolated test data only)

1. Use a non-production Supabase project or isolated test data.
2. Inspect the actual schema and policies before applying any SQL. Do not blindly run `schema.sql` against the production project.
3. Configure server-only environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DEMO_TEACHER_ID`
4. Never place the service-role key in browser code or commit it to the repository.
5. Test only with non-sensitive sample teaching artifacts.

The MCP endpoint for a separately deployed app will be `https://<your-project>.vercel.app/api/mcp`. Confirm the actual Vercel project and deployment URL before using it.

## Required before inviting other teachers

1. Add supported authentication to the MCP transport and verify the identity for every request.
2. Derive the teacher ID from that verified identity, never from tool input or a global demo setting.
3. Secure the dashboard with server-verified authentication and per-user ownership checks.
4. Review actual Supabase grants, RLS policies, and schema in the target project.
5. Add rate limiting, monitoring, and two-account isolation tests.
6. Deploy to a preview environment, test, and establish rollback before production.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Only use local development with isolated test credentials. Authentication work must be completed before this MCP service is offered as a shared teacher platform.
