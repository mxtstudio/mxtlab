-- MXT Lab: create a complete, private teacher-application workflow.
-- Explicit grants are required for new public-schema tables on Supabase.
CREATE OR REPLACE FUNCTION public.teacher_application_documents_valid(
  p_user_id uuid,
  p_documents text[]
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $function$
  SELECT p_user_id IS NOT NULL
    AND COALESCE(cardinality(p_documents), 0) BETWEEN 1 AND 5
    AND NOT EXISTS (
      SELECT 1
      FROM unnest(COALESCE(p_documents, ARRAY[]::text[])) AS item(path)
      WHERE item.path IS NULL
         OR item.path !~* ('^' || p_user_id::text || '/[0-9a-f-]{36}[.](pdf|jpg|jpeg|png)$')
    );
$function$;

REVOKE ALL ON FUNCTION public.teacher_application_documents_valid(uuid, text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.teacher_application_documents_valid(uuid, text[]) TO authenticated, service_role;

CREATE TABLE public.teacher_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 200),
  email text NOT NULL CHECK (char_length(btrim(email)) BETWEEN 3 AND 254),
  phone text NOT NULL CHECK (char_length(btrim(phone)) BETWEEN 3 AND 40),
  school text NOT NULL CHECK (char_length(btrim(school)) BETWEEN 2 AND 200),
  province text NOT NULL CHECK (char_length(btrim(province)) BETWEEN 2 AND 100),
  district text NOT NULL CHECK (char_length(btrim(district)) BETWEEN 2 AND 100),
  position text NOT NULL CHECK (char_length(btrim(position)) BETWEEN 2 AND 120),
  subjects text NOT NULL CHECK (char_length(btrim(subjects)) BETWEEN 2 AND 500),
  years_experience integer NOT NULL CHECK (years_experience BETWEEN 0 AND 60),
  documents text[] NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note text,
  admin_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT teacher_applications_review_state_check CHECK (
    (status = 'pending' AND admin_id IS NULL AND reviewed_at IS NULL)
    OR (status IN ('approved', 'rejected') AND admin_id IS NOT NULL AND reviewed_at IS NOT NULL)
  ),
  CONSTRAINT teacher_applications_documents_check
    CHECK (public.teacher_application_documents_valid(user_id, documents))
);

CREATE UNIQUE INDEX teacher_applications_one_pending_per_user_idx ON public.teacher_applications (user_id) WHERE status = 'pending';
CREATE INDEX teacher_applications_created_at_idx ON public.teacher_applications (created_at DESC);
CREATE INDEX teacher_applications_user_id_idx ON public.teacher_applications (user_id);
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.teacher_applications FROM PUBLIC, anon;
GRANT SELECT, INSERT ON TABLE public.teacher_applications TO authenticated;
GRANT ALL ON TABLE public.teacher_applications TO service_role;

CREATE POLICY teacher_applications_select_own_or_admin ON public.teacher_applications
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()) OR public.current_role_is_admin());
CREATE POLICY teacher_applications_insert_own_pending ON public.teacher_applications
  FOR INSERT TO authenticated WITH CHECK (
    user_id = (SELECT auth.uid()) AND status = 'pending' AND admin_id IS NULL AND reviewed_at IS NULL
  );

CREATE OR REPLACE FUNCTION public.review_teacher_application(
  p_application_id uuid,
  p_approve boolean,
  p_note text DEFAULT NULL
)
RETURNS public.teacher_applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_actor uuid := auth.uid();
  v_application public.teacher_applications;
  v_updated integer;
BEGIN
  IF v_actor IS NULL OR NOT public.current_role_is_admin() THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;
  IF p_application_id IS NULL OR p_approve IS NULL THEN
    RAISE EXCEPTION 'Application ID and decision are required' USING ERRCODE = '22023';
  END IF;
  IF p_note IS NOT NULL AND char_length(p_note) > 2000 THEN
    RAISE EXCEPTION 'Review note is too long' USING ERRCODE = '22023';
  END IF;

  SELECT * INTO v_application FROM public.teacher_applications WHERE id = p_application_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Application not found' USING ERRCODE = 'P0002'; END IF;
  IF v_application.status <> 'pending' THEN
    RAISE EXCEPTION 'Application has already been reviewed' USING ERRCODE = '22023';
  END IF;

  IF p_approve THEN
    UPDATE public.profiles SET role = 'teacher'
     WHERE id = v_application.user_id AND role = 'student';
    GET DIAGNOSTICS v_updated = ROW_COUNT;
    IF v_updated = 0 AND NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE id = v_application.user_id AND role = 'teacher'
    ) THEN
      RAISE EXCEPTION 'Applicant account is not eligible for teacher promotion' USING ERRCODE = '22023';
    END IF;
  END IF;

  UPDATE public.teacher_applications
     SET status = CASE WHEN p_approve THEN 'approved' ELSE 'rejected' END,
         admin_note = NULLIF(btrim(p_note), ''),
         admin_id = v_actor,
         reviewed_at = now()
   WHERE id = p_application_id
   RETURNING * INTO v_application;

  PERFORM public.log_audit_event(
    v_actor, NULL,
    CASE WHEN p_approve THEN 'teacher_application.approved' ELSE 'teacher_application.rejected' END,
    'teacher_applications', v_application.id,
    jsonb_build_object('status', 'pending'),
    jsonb_build_object('status', v_application.status, 'user_id', v_application.user_id),
    CASE WHEN p_approve THEN 'info' ELSE 'warning' END
  );
  RETURN v_application;
END;
$function$;

REVOKE ALL ON FUNCTION public.review_teacher_application(uuid, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_teacher_application(uuid, boolean, text) TO authenticated;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('teacher-applications', 'teacher-applications', false, 5242880,
        ARRAY['application/pdf', 'image/jpeg', 'image/png']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY teacher_applications_upload_own ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'teacher-applications'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
    AND name ~* '^[0-9a-f-]{36}/[0-9a-f-]{36}[.](pdf|jpg|jpeg|png)$'
  );
CREATE POLICY teacher_applications_read_own_or_admin ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'teacher-applications'
    AND ((storage.foldername(name))[1] = (SELECT auth.uid()::text) OR public.current_role_is_admin())
  );
CREATE POLICY teacher_applications_delete_own_or_admin ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'teacher-applications'
    AND ((storage.foldername(name))[1] = (SELECT auth.uid()::text) OR public.current_role_is_admin())
  );

COMMENT ON TABLE public.teacher_applications IS
  'Private teacher-access applications. Applicants may submit and view their own records; administrators review through review_teacher_application().';
