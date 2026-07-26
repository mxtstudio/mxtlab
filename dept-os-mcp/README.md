# MXT Lab Department OS — Week-One MCP Demo

Two MCP tools (`save_to_dashboard`, `get_my_dashboard`), backed by a
new table in your existing Supabase project, hosted on Vercel,
connectable to Claude as a custom connector. Plus a minimal dashboard
page to point to during the demo.

Scope is deliberately narrow (see the handoff brief) — no HOD workflow,
no timetable matching, no Department Core, single test account only.
This is separate from `lesson_plans`/`resources`/`curriculum_units` —
it does not touch or depend on that schema.

## 1. Database (5 min)

1. Open your Supabase project → SQL Editor.
2. Paste and run `schema.sql`. It only adds `dashboard_entries` —
   nothing else is touched.
3. Find your demo teacher's `profiles.id`:
   ```sql
   select id, full_name from public.profiles where full_name ilike '%your name%';
   ```
   Copy that `id` — you'll need it as `DEMO_TEACHER_ID`.
4. Get your **service role** key: Project Settings → API → `service_role`
   secret (not the publishable key already in `auth.js` — this one is
   more powerful and must never reach the browser or a public repo).

## 2. Deploy to Vercel (10 min)

1. Push this folder to a new GitHub repo (or a new folder in an
   existing one — doesn't need to be the mxtlab-main repo).
2. Import it in Vercel → New Project.
3. In Vercel → Project Settings → Environment Variables, add:
   - `SUPABASE_URL` = `https://mqiwckclyohjdhjaoaor.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = (the service_role secret from step 1.4)
   - `DEMO_TEACHER_ID` = (the profiles.id from step 1.3)
4. Deploy. Your MCP endpoint will be:
   `https://<your-project>.vercel.app/api/mcp`
   Your dashboard will be:
   `https://<your-project>.vercel.app/dashboard`

## 3. Connect to Claude (2 min)

1. In Claude (claude.ai, Pro/Max): Settings → Connectors → Add
   custom connector.
2. Paste the MCP URL: `https://<your-project>.vercel.app/api/mcp`
3. No OAuth needed — this server is intentionally authless for
   reliability (see "Why no auth?" below). Just add it and enable it
   in a conversation.
4. Test: ask Claude to save something, then ask it to retrieve it.

## 4. Demo script

> "Watch — I ask Claude to draft a Grade 10 Physics lesson plan using
> our teacher guide, I approve it, and it saves straight into mxtlab.
> Then I ask Claude to pull it back up."

Concretely:
1. "Draft a Grade 10 Physics lesson plan on [topic] using our teacher
   guide." → review the output.
2. "Save that to my dashboard as a lesson plan for Grade 10 Physics."
   → Claude calls `save_to_dashboard`.
3. Open `/dashboard` in a browser tab, refresh — show it there.
4. "Pull up my saved Physics lesson plans." → Claude calls
   `get_my_dashboard`.

## 5. Hardening before the inservice (day 6)

- Dry-run the full script at least 3 times, on the actual wifi
  you'll present on, at the actual time of day.
- Vercel free tier serverless functions cold-start — the first call
  after idle time can take a couple seconds. Do one throwaway save
  right before you go on, to warm it up.
- If a save fails mid-demo, the tool returns a clear error string
  rather than throwing — Claude will just tell you what went wrong
  instead of hanging.
- Have the Supabase table open in a second tab as a fallback way to
  show saved data if the dashboard page has any issue.

## Why no auth on the MCP server?

Claude supports both authless and OAuth-based remote MCP servers.
For a single-account, one-week demo, OAuth is one more thing that can
break live and buys you nothing (only one teacher, and the URL isn't
public/shared). The service role key does the real access control —
it lives only in Vercel's server environment, never in the browser or
in Claude's requests. If you later open this to multiple real
teachers, that's when to add real auth (Claude's custom connectors
also support a bearer-token header via "request header
authentication," which is simpler than full OAuth if you just want
one more layer).

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in the three values
npm run dev                   # http://localhost:3000/dashboard
```

To test the MCP server locally before deploying, point an MCP
inspector (`npx @modelcontextprotocol/inspector`) at
`http://localhost:3000/api/mcp`.
