-- Applied to live project mqiwckclyohjdhjaoaor on 2026-10-27 (migration "teacher_owned_student_roster").
-- Teacher-owned student roster with opt-in sharing between teachers at the same school.
-- Rules: only teachers can see student data; each teacher owns their own roster; an owner may
-- share (read-only) one student, or all of their students in one grade, with specific teachers
-- at the same school.

create or replace function public.roster_my_school()
returns uuid language sql stable security definer set search_path = ''
as $f$
  select p.school_id from public.profiles p
  where p.id = (select auth.uid()) and p.role = 'teacher' and p.school_id is not null
$f$;

create or replace function public.roster_is_same_school_teacher(p_user uuid)
returns boolean language sql stable security definer set search_path = ''
as $f$
  select exists (
    select 1
    from public.profiles me
    join public.profiles other on other.school_id = me.school_id
    where me.id = (select auth.uid()) and me.role = 'teacher' and me.school_id is not null
      and other.id = p_user and other.role = 'teacher'
  )
$f$;

create table public.roster_students (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  school_id uuid not null references public.schools(id),
  first_name text not null check (char_length(btrim(first_name)) between 1 and 100),
  last_name text not null check (char_length(btrim(last_name)) between 1 and 100),
  student_id_local text check (char_length(student_id_local) <= 50),
  grade_level integer check (grade_level between 9 and 12),
  created_at timestamptz not null default now()
);
create index roster_students_owner_idx on public.roster_students (owner_id);
create index roster_students_school_grade_idx on public.roster_students (school_id, grade_level);

create table public.roster_shares (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  grantee_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid references public.roster_students(id) on delete cascade,
  grade_level integer check (grade_level between 9 and 12),
  created_at timestamptz not null default now(),
  constraint roster_shares_one_target check ((student_id is null) <> (grade_level is null)),
  constraint roster_shares_not_self check (owner_id <> grantee_id)
);
create unique index roster_shares_student_uniq on public.roster_shares (owner_id, grantee_id, student_id) where student_id is not null;
create unique index roster_shares_grade_uniq on public.roster_shares (owner_id, grantee_id, grade_level) where grade_level is not null;
create index roster_shares_grantee_idx on public.roster_shares (grantee_id);
create index roster_shares_student_idx on public.roster_shares (student_id);

-- Reads roster_shares with definer rights so roster_students policies do not recurse through RLS.
create or replace function public.roster_shared_with_me(p_owner uuid, p_student uuid, p_grade integer, p_school uuid)
returns boolean language sql stable security definer set search_path = ''
as $f$
  select public.roster_my_school() = p_school
    and exists (
      select 1 from public.roster_shares s
      where s.grantee_id = (select auth.uid())
        and s.owner_id = p_owner
        and (s.student_id = p_student or (s.student_id is null and s.grade_level = p_grade))
    )
$f$;

revoke execute on function public.roster_my_school() from public, anon;
revoke execute on function public.roster_is_same_school_teacher(uuid) from public, anon;
revoke execute on function public.roster_shared_with_me(uuid, uuid, integer, uuid) from public, anon;
grant execute on function public.roster_my_school() to authenticated;
grant execute on function public.roster_is_same_school_teacher(uuid) to authenticated;
grant execute on function public.roster_shared_with_me(uuid, uuid, integer, uuid) to authenticated;

alter table public.roster_students enable row level security;
alter table public.roster_shares enable row level security;

-- New public tables get broad default grants; remove them, then grant only what RLS will gate.
revoke all on public.roster_students from public, anon;
revoke all on public.roster_shares from public, anon;
grant select, insert, update, delete on public.roster_students to authenticated;
grant select, insert, delete on public.roster_shares to authenticated;

-- Students: owner, or a same-school teacher the owner shared with (read-only).
create policy roster_students_select on public.roster_students for select to authenticated
  using (
    public.roster_my_school() is not null
    and (owner_id = (select auth.uid())
         or public.roster_shared_with_me(owner_id, id, grade_level, school_id))
  );
create policy roster_students_insert on public.roster_students for insert to authenticated
  with check (owner_id = (select auth.uid()) and school_id = public.roster_my_school());
create policy roster_students_update on public.roster_students for update to authenticated
  using (owner_id = (select auth.uid()) and public.roster_my_school() is not null)
  with check (owner_id = (select auth.uid()) and school_id = public.roster_my_school());
create policy roster_students_delete on public.roster_students for delete to authenticated
  using (owner_id = (select auth.uid()) and public.roster_my_school() is not null);

-- Shares: visible to the owner and the grantee; only the owner can create or revoke them.
create policy roster_shares_select on public.roster_shares for select to authenticated
  using (
    public.roster_my_school() is not null
    and (owner_id = (select auth.uid()) or grantee_id = (select auth.uid()))
  );
create policy roster_shares_insert on public.roster_shares for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and public.roster_is_same_school_teacher(grantee_id)
    and (student_id is null
         or exists (select 1 from public.roster_students s
                    where s.id = student_id and s.owner_id = (select auth.uid())))
  );
create policy roster_shares_delete on public.roster_shares for delete to authenticated
  using (owner_id = (select auth.uid()));
