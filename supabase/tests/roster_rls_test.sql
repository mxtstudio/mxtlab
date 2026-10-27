-- Row-level-security test for public.roster_students / public.roster_shares.
-- Run in the Supabase SQL editor (or any session with rights to create users and SET ROLE).
-- It builds throw-away schools, users and students, runs every check, and ALWAYS ends by raising
-- an exception, so nothing is ever saved. Expected output:  TEST_RESULT total=45 failures=[]

create temp table res(name text, actual text, expected text, ok boolean) on commit drop;

create or replace function pg_temp.login(p uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p::text, 'role', 'authenticated')::text, true);
  perform set_config('request.jwt.claim.sub', p::text, true);
  execute 'set local role authenticated';
end $$;

create or replace function pg_temp.cnt(p uuid, q text) returns text language plpgsql as $$
declare n int;
begin
  perform pg_temp.login(p);
  execute 'select count(*) from (' || q || ') x' into n;
  reset role;
  return n::text;
end $$;

create or replace function pg_temp.try(p uuid, q text) returns text language plpgsql as $$
declare c bigint;
begin
  perform pg_temp.login(p);
  begin
    execute q;
    get diagnostics c = row_count;
    reset role;
    return 'ok:' || c;
  exception
    when insufficient_privilege then reset role; return 'denied';
    when others then reset role; return 'err:' || sqlstate;
  end;
end $$;

create or replace function pg_temp.blk(r text) returns text language sql as $$
  select case when r like 'ok:%' and r <> 'ok:0' then 'ALLOWED' else 'blocked' end
$$;

create or replace function pg_temp.chk(n text, a text, e text) returns void language plpgsql as $$
begin
  insert into res values (n, a, e, a is not distinct from e);
end $$;

do $t$
declare
  s1 uuid := gen_random_uuid(); s2 uuid := gen_random_uuid();
  t1 uuid := gen_random_uuid(); t2 uuid := gen_random_uuid(); t3 uuid := gen_random_uuid();
  stu uuid := gen_random_uuid(); adm uuid := gen_random_uuid();
  a1 uuid := gen_random_uuid(); a2 uuid := gen_random_uuid();
  b1 uuid := gen_random_uuid(); c1 uuid := gen_random_uuid();
  v text; fails jsonb; total int;
begin
  insert into public.schools(id, name, slug) values (s1,'Test School 1','t-s1-'||s1), (s2,'Test School 2','t-s2-'||s2);
  insert into auth.users(id, aud, role, email)
    select u, 'authenticated', 'authenticated', u || '@test.invalid' from unnest(array[t1,t2,t3,stu,adm]) u;
  insert into public.profiles(id, role, full_name, school_id) values
    (t1,'teacher','T1',s1),(t2,'teacher','T2',s1),(t3,'teacher','T3',s2),(stu,'student','STU',s1),(adm,'admin','ADM',s1)
  on conflict (id) do update set role=excluded.role, full_name=excluded.full_name, school_id=excluded.school_id;
  insert into public.roster_students(id, owner_id, school_id, first_name, last_name, grade_level) values
    (a1,t1,s1,'A','One',9),(a2,t1,s1,'A','Two',10),(b1,t2,s1,'B','One',9),(c1,t3,s2,'C','One',9);

  -- 1. Ownership isolation and role gating
  perform pg_temp.chk('1a T1 sees only own (2)', pg_temp.cnt(t1,'select 1 from public.roster_students'), '2');
  perform pg_temp.chk('1b T2 sees only own (1)', pg_temp.cnt(t2,'select 1 from public.roster_students'), '1');
  perform pg_temp.chk('1c T3 other school sees only own (1)', pg_temp.cnt(t3,'select 1 from public.roster_students'), '1');
  perform pg_temp.chk('1d student account sees 0', pg_temp.cnt(stu,'select 1 from public.roster_students'), '0');
  perform pg_temp.chk('1e admin account sees 0', pg_temp.cnt(adm,'select 1 from public.roster_students'), '0');
  begin
    set local role anon;
    perform 1 from public.roster_students;
    raise exception 'ANON_READ_ALLOWED';
  exception when insufficient_privilege then null;
  end;
  reset role;
  perform pg_temp.chk('1f anon cannot read students', 'blocked', 'blocked');
  begin
    set local role anon;
    perform 1 from public.roster_shares;
    raise exception 'ANON_SHARES_READ_ALLOWED';
  exception when insufficient_privilege then null;
  end;
  reset role;
  perform pg_temp.chk('1g anon cannot read shares', 'blocked', 'blocked');

  -- 2. Opt-in sharing: single student, then whole grade
  perform pg_temp.chk('2a T1 shares A1 with T2', pg_temp.try(t1, format('insert into public.roster_shares(grantee_id, student_id) values (%L,%L)', t2, a1)), 'ok:1');
  perform pg_temp.chk('2b T2 now sees own + A1 (2)', pg_temp.cnt(t2,'select 1 from public.roster_students'), '2');
  perform pg_temp.chk('2c T2 still cannot see A2', pg_temp.cnt(t2, format('select 1 from public.roster_students where id=%L', a2)), '0');
  perform pg_temp.chk('2d T1 shares grade 10 with T2', pg_temp.try(t1, format('insert into public.roster_shares(grantee_id, grade_level) values (%L,10)', t2)), 'ok:1');
  perform pg_temp.chk('2e T2 now also sees A2 (3)', pg_temp.cnt(t2,'select 1 from public.roster_students'), '3');
  perform pg_temp.chk('2f T3 sees nothing of T1 (1)', pg_temp.cnt(t3,'select 1 from public.roster_students'), '1');

  -- 3. Sharing guards
  perform pg_temp.chk('3a cannot share to other-school teacher', pg_temp.blk(pg_temp.try(t1, format('insert into public.roster_shares(grantee_id, grade_level) values (%L,9)', t3))), 'blocked');
  perform pg_temp.chk('3b cannot share to student account', pg_temp.blk(pg_temp.try(t1, format('insert into public.roster_shares(grantee_id, grade_level) values (%L,9)', stu))), 'blocked');
  perform pg_temp.chk('3c cannot share to admin account', pg_temp.blk(pg_temp.try(t1, format('insert into public.roster_shares(grantee_id, grade_level) values (%L,9)', adm))), 'blocked');
  perform pg_temp.chk('3d cannot share to self', pg_temp.blk(pg_temp.try(t1, format('insert into public.roster_shares(grantee_id, grade_level) values (%L,9)', t1))), 'blocked');
  perform pg_temp.chk('3e grantee cannot re-share a student they do not own', pg_temp.blk(pg_temp.try(t2, format('insert into public.roster_shares(grantee_id, student_id) values (%L,%L)', t1, a1))), 'blocked');
  perform pg_temp.chk('3f cannot forge owner on a share', pg_temp.blk(pg_temp.try(t2, format('insert into public.roster_shares(owner_id, grantee_id, grade_level) values (%L,%L,9)', t1, t2))), 'blocked');

  -- 4. Shared access is read-only
  perform pg_temp.chk('4a grantee cannot update shared student', pg_temp.blk(pg_temp.try(t2, format('update public.roster_students set first_name=%L where id=%L', 'HACK', a1))), 'blocked');
  perform pg_temp.chk('4b grantee cannot delete shared student', pg_temp.blk(pg_temp.try(t2, format('delete from public.roster_students where id=%L', a1))), 'blocked');
  select first_name into v from public.roster_students where id = a1;
  perform pg_temp.chk('4c shared student unchanged', v, 'A');

  -- 5. Write guards
  perform pg_temp.chk('5a cannot create student owned by another teacher', pg_temp.blk(pg_temp.try(t2, format('insert into public.roster_students(owner_id, school_id, first_name, last_name, grade_level) values (%L,%L,%L,%L,9)', t1, s1, 'X', 'Y'))), 'blocked');
  perform pg_temp.chk('5b cannot create student in another school', pg_temp.blk(pg_temp.try(t2, format('insert into public.roster_students(school_id, first_name, last_name, grade_level) values (%L,%L,%L,9)', s2, 'X', 'Y'))), 'blocked');
  perform pg_temp.chk('5c student account cannot create', pg_temp.blk(pg_temp.try(stu, format('insert into public.roster_students(school_id, first_name, last_name, grade_level) values (%L,%L,%L,9)', s1, 'X', 'Y'))), 'blocked');
  perform pg_temp.chk('5d admin account cannot create', pg_temp.blk(pg_temp.try(adm, format('insert into public.roster_students(school_id, first_name, last_name, grade_level) values (%L,%L,%L,9)', s1, 'X', 'Y'))), 'blocked');
  perform pg_temp.chk('5e owner cannot hand student to another teacher', pg_temp.blk(pg_temp.try(t1, format('update public.roster_students set owner_id=%L where id=%L', t2, a2))), 'blocked');
  perform pg_temp.chk('5f owner cannot move student to another school', pg_temp.blk(pg_temp.try(t1, format('update public.roster_students set school_id=%L where id=%L', s2, a2))), 'blocked');
  perform pg_temp.chk('5g teacher can create own student', pg_temp.try(t2, format('insert into public.roster_students(school_id, first_name, last_name, grade_level) values (%L,%L,%L,9)', s1, 'New', 'Kid')), 'ok:1');
  perform pg_temp.chk('5h teacher can update own student', pg_temp.try(t2, format('update public.roster_students set first_name=%L where id=%L', 'Renamed', b1)), 'ok:1');

  -- 6. Share visibility and revocation
  perform pg_temp.chk('6a T3 sees no shares', pg_temp.cnt(t3,'select 1 from public.roster_shares'), '0');
  perform pg_temp.chk('6b student account sees no shares', pg_temp.cnt(stu,'select 1 from public.roster_shares'), '0');
  perform pg_temp.chk('6c T2 sees the 2 shares made to them', pg_temp.cnt(t2,'select 1 from public.roster_shares'), '2');
  perform pg_temp.chk('6d grantee cannot revoke', pg_temp.blk(pg_temp.try(t2,'delete from public.roster_shares')), 'blocked');
  perform pg_temp.chk('6e owner revokes both', pg_temp.try(t1,'delete from public.roster_shares'), 'ok:2');
  perform pg_temp.chk('6f T2 back to own only (2: B1 + New)', pg_temp.cnt(t2,'select 1 from public.roster_students'), '2');

  -- 7. Access follows school and role changes
  perform pg_temp.chk('7a re-share A1 to T2', pg_temp.try(t1, format('insert into public.roster_shares(grantee_id, student_id) values (%L,%L)', t2, a1)), 'ok:1');
  update public.profiles set school_id = s2 where id = t2;
  perform pg_temp.chk('7b T2 moved school: shared access gone, own rows kept (2)', pg_temp.cnt(t2,'select 1 from public.roster_students'), '2');
  update public.profiles set school_id = s1 where id = t2;
  perform pg_temp.chk('7c T2 back in school: shared access returns (3)', pg_temp.cnt(t2,'select 1 from public.roster_students'), '3');
  update public.profiles set role = 'student' where id = t1;
  perform pg_temp.chk('7d T1 demoted to student: sees 0', pg_temp.cnt(t1,'select 1 from public.roster_students'), '0');
  perform pg_temp.chk('7e owner demoted: existing shares remain until revoked (3)', pg_temp.cnt(t2,'select 1 from public.roster_students'), '3');
  update public.profiles set role = 'teacher' where id = t1;

  -- 8. Privileges
  perform pg_temp.chk('8a anon has no table grant', has_table_privilege('anon','public.roster_students','select')::text, 'false');
  perform pg_temp.chk('8b anon cannot execute helper 1', has_function_privilege('anon','public.roster_my_school()','execute')::text, 'false');
  perform pg_temp.chk('8c anon cannot execute helper 2', has_function_privilege('anon','public.roster_is_same_school_teacher(uuid)','execute')::text, 'false');
  perform pg_temp.chk('8d anon cannot execute helper 3', has_function_privilege('anon','public.roster_shared_with_me(uuid,uuid,integer,uuid)','execute')::text, 'false');

  select count(*), coalesce(jsonb_agg(jsonb_build_object('test', name, 'got', actual, 'want', expected)) filter (where not ok), '[]'::jsonb)
    into total, fails from res;
  raise exception 'TEST_RESULT total=% failures=%', total, fails;
end
$t$;
