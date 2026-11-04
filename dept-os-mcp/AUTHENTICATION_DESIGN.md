# Authenticated MCP implementation – Current Status

## Overview

The MCP service (`dept-os-mcp`) now enforces per‑user authentication for all public endpoints using Supabase OAuth bearer tokens. The server validates the token via Supabase Auth, ensures the corresponding `profiles.id` exists, and then runs request‑scoped logic with that identity.

## Implemented Features

- **Token verification** – `verifySupabaseAccessToken` validates the `Authorization: Bearer <token>` header against Supabase Auth.
- **Request‑scoped auth context** – AsyncLocalStorage holds the authenticated `userId` for the duration of the request, preventing cross‑request leakage.
- **Endpoint protection** – All API routes (`/api/mcp`, `/api/curriculum/subjects`, `/api/student/progress`) enforce authentication and reject unauthenticated requests with HTTP 401.
- **Explicit ownership checks** – Database queries filter by the verified `userId` (student can only read their own progress; teachers access their own dashboard entries).
- **Service‑role client** – Server‑side Supabase client uses the service‑role key (never exposed to the client) and relies on explicit RLS‑compatible predicates.

## Removed/Deprecated Items

- The `DEMO_TEACHER_ID` environment variable and the helper `getDemoTeacherId()` are no longer used and have been removed from the code base.
- Out‑of‑date design notes claiming the route was unauthenticated have been deleted.

## Acceptance Tests (run via `npm test`)

1. Missing, malformed, expired, or revoked tokens return **401 Unauthorized**.
2. Valid tokens map to exactly one teacher/student profile.
3. Authenticated teachers can save and retrieve their own dashboard entries.
4. Students can only access their own progress records.
5. No request can access another user's data, even with crafted query parameters.

## Next Steps

- Add comprehensive integration tests for role‑specific endpoints (teacher analytics, class management).
- Consider switching to user‑scoped Supabase client for finer‑grained RLS enforcement.
- Document the authentication flow for front‑end developers (client‑side `supabase.auth.getSession()` usage).
