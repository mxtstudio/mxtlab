-- MXT Lab: remove unnecessary anonymous Data API grants from private application data.
-- Keep anonymous access only for explicitly public catalogue/curriculum tables and
-- the purpose-built anonymous lesson completion endpoint.
DO $migration$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT DISTINCT table_name
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public'
      AND grantee = 'anon'
      AND table_name NOT IN (
        'anon_lesson_completions',
        'curriculum_chunks',
        'curriculum_documents',
        'lessons',
        'schools',
        'store_categories',
        'store_products'
      )
  LOOP
    EXECUTE format('REVOKE ALL PRIVILEGES ON TABLE public.%I FROM anon', item.table_name);
  END LOOP;
END
$migration$;

REVOKE ALL PRIVILEGES ON TABLE public.school_strand_progress FROM anon;

COMMENT ON VIEW public.school_strand_progress IS
  'School-level aggregate learning indicators. Not anonymously accessible; authenticated access remains subject to existing grants.';
