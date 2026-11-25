-- MXT Lab: tighten teacher applications and protect cross-school aggregate progress.
DROP POLICY IF EXISTS teacher_applications_insert_own_pending ON public.teacher_applications;
CREATE POLICY teacher_applications_insert_own_pending
  ON public.teacher_applications
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND status = 'pending'
    AND admin_id IS NULL
    AND reviewed_at IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = (SELECT auth.uid())
        AND p.role = 'student'
    )
  );

-- No app route uses this global cross-school aggregate view. Keep it service-role only
-- until a future class/school-scoped analytics API is implemented and tested.
REVOKE ALL PRIVILEGES ON TABLE public.school_strand_progress FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.school_strand_progress TO service_role;

COMMENT ON VIEW public.school_strand_progress IS
  'Global school-level aggregate learning indicators; service-role only until an explicitly scoped analytics API is implemented.';
