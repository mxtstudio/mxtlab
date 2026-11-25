-- Applied to live project mqiwckclyohjdhjaoaor on 2026-10-25.
-- Creates a covering index for every foreign key in public/districtos that lacked one.
do $$
declare
  r record;
  idx text;
  n int := 0;
begin
  for r in
    select c.conname, c.conrelid, n.nspname as sch, t.relname as tbl,
           (select string_agg(quote_ident(a.attname), ', ' order by k.ord)
              from unnest(c.conkey) with ordinality k(attnum, ord)
              join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k.attnum) as cols,
           c.conkey
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where c.contype = 'f'
      and n.nspname in ('public', 'districtos')
      and not exists (
        select 1 from pg_index i
        where i.indrelid = c.conrelid
          and (i.indkey::int2[])[0:array_length(c.conkey,1)-1] = c.conkey
      )
  loop
    idx := left('idx_' || r.tbl || '_' || regexp_replace(r.cols, '[^a-zA-Z0-9_]+', '_', 'g'), 63);
    execute format('create index if not exists %I on %I.%I (%s)', idx, r.sch, r.tbl, r.cols);
    n := n + 1;
  end loop;
  raise notice 'created % indexes', n;
end $$;
