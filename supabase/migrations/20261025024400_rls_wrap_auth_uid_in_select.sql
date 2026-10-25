-- Applied to live project mqiwckclyohjdhjaoaor on 2026-10-25.
-- Rewrites public RLS policies so auth.uid() is evaluated once per query (initplan), not per row.
do $$
declare
  r record;
  q text;
  w text;
  stmt text;
  n int := 0;
  marker constant text := '@@WRAPPED_UID@@';
begin
  for r in
    select schemaname, tablename, policyname, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and (coalesce(qual,'') ~ 'auth\.uid\(\)' or coalesce(with_check,'') ~ 'auth\.uid\(\)')
  loop
    q := r.qual;
    w := r.with_check;
    if q is not null then
      q := replace(q, '( SELECT auth.uid() AS uid)', marker);
      q := replace(q, 'auth.uid()', '(select auth.uid())');
      q := replace(q, marker, '( SELECT auth.uid() AS uid)');
    end if;
    if w is not null then
      w := replace(w, '( SELECT auth.uid() AS uid)', marker);
      w := replace(w, 'auth.uid()', '(select auth.uid())');
      w := replace(w, marker, '( SELECT auth.uid() AS uid)');
    end if;
    if q is distinct from r.qual or w is distinct from r.with_check then
      stmt := format('alter policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
      if q is not null then stmt := stmt || format(' using (%s)', q); end if;
      if w is not null then stmt := stmt || format(' with check (%s)', w); end if;
      execute stmt;
      n := n + 1;
    end if;
  end loop;
  raise notice 'rewrote % policies', n;
end $$;
