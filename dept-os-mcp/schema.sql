-- Add role column to profiles (default student)
alter table public.profiles enable row level security;

create policy "users can select own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "admin can update role"
  on public.profiles for update
  using (auth.uid() in (select id from public.profiles where role = 'admin'))
  with check (role in ('teacher','admin'));


-- Teacher applications table
create table if not exists public.teacher_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  school text,
  province text,
  district text,
  position text,
  subjects text,
  years_experience integer,
  documents jsonb,
  status text not null default 'Pending',
  admin_note text,
  admin_id uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teacher_applications_user_idx on public.teacher_applications (user_id);
create index if not exists teacher_applications_status_idx on public.teacher_applications (status);

alter table public.teacher_applications enable row level security;

-- Students can insert their own application (one active at a time enforced client‑side)
create policy "students can insert own application"
  on public.teacher_applications for insert
  with check (auth.uid() = user_id);

-- Students can select only their own applications
create policy "students can view own applications"
  on public.teacher_applications for select
  using (auth.uid() = user_id);

-- Admins (role = 'admin') can view and update any application
create policy "admin can manage applications"
  on public.teacher_applications for all
  using (auth.uid() in (select id from public.profiles where role = 'admin'));

-- Audit log table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id),
  action text not null,
  target_user_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_admin_idx on public.audit_logs (admin_id);

-- Enable RLS for audit_logs (admins only)
alter table public.audit_logs enable row level security;
create policy "admin can view audit logs" on public.audit_logs for select using (auth.uid() in (select id from public.profiles where role = 'admin'));
create policy "admin can insert audit logs" on public.audit_logs for insert with check (auth.uid() in (select id from public.profiles where role = 'admin'));
