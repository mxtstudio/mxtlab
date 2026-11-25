-- MXT Lab: remove non-HTTP table privileges and close unused/internal tables to client roles.
-- RLS does not apply to TRUNCATE; clients must never hold that privilege.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM anon, authenticated;

-- Anonymous access is read-only for the intentionally public catalogue.
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON TABLE
  public.anon_lesson_completions,
  public.curriculum_chunks,
  public.curriculum_documents,
  public.schools
FROM anon;

GRANT SELECT ON TABLE
  public.lessons,
  public.store_categories,
  public.store_products
TO anon;

-- These tables are internal or RPC-backed. Client roles must not query them directly.
REVOKE ALL PRIVILEGES ON TABLE
  public.anon_lesson_completions,
  public.curriculum_chunks,
  public.curriculum_documents,
  public.rate_limit_events,
  public.api_tokens
FROM authenticated;

DROP POLICY IF EXISTS "anon can insert completions" ON public.anon_lesson_completions;
DROP POLICY IF EXISTS "anon can read completions" ON public.anon_lesson_completions;
DROP POLICY IF EXISTS "curriculum chunks readable by anyone" ON public.curriculum_chunks;
DROP POLICY IF EXISTS "curriculum documents readable by anyone" ON public.curriculum_documents;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE TRUNCATE, REFERENCES, TRIGGER ON TABLES FROM anon, authenticated;
