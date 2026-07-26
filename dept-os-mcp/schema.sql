-- MXT Lab Department OS — Week-One MCP Demo Schema
-- Run this in the Supabase SQL editor for your EXISTING project
-- (mqiwckclyohjdhjaoaor.supabase.co). This is additive only —
-- it does not touch lesson_plans, resources, curriculum_units,
-- departments, profiles, or department_roles.

create table if not exists public.dashboard_entries (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  grade text not null,
  type text not null,           -- e.g. 'lesson_plan', 'assessment', 'resource'
  content text not null,        -- the generated content, as text/markdown
  created_at timestamptz not null default now()
);

create index if not exists dashboard_entries_teacher_idx
  on public.dashboard_entries (teacher_id, created_at desc);

alter table public.dashboard_entries enable row level security;

-- Teachers can only see and write their own rows via the browser
-- (anon/publishable key + their session). The MCP server itself
-- uses the SERVICE ROLE key server-side, which bypasses RLS
-- entirely — these policies matter for the dashboard page's
-- direct Supabase calls, not for the MCP tool calls.
create policy "own entries select"
  on public.dashboard_entries for select
  using (auth.uid() = teacher_id);

create policy "own entries insert"
  on public.dashboard_entries for insert
  with check (auth.uid() = teacher_id);
