-- MXT Lab: consolidate progress SELECT policies and tighten role-scoped application access.
DROP POLICY IF EXISTS progress_select_owner ON public.student_progress;
DROP POLICY IF EXISTS progress_select_linked_teacher ON public.student_progress;
CREATE POLICY progress_select_owner_or_linked_teacher
  ON public.student_progress
  FOR SELECT TO authenticated
  USING (
    student_id = (SELECT auth.uid())
    OR public.is_my_student(student_id)
  );

DROP POLICY IF EXISTS quiz_select_owner ON public.quiz_attempts;
DROP POLICY IF EXISTS quiz_select_linked_teacher ON public.quiz_attempts;
CREATE POLICY quiz_select_owner_or_linked_teacher
  ON public.quiz_attempts
  FOR SELECT TO authenticated
  USING (
    student_id = (SELECT auth.uid())
    OR public.is_my_student(student_id)
  );

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

REVOKE ALL PRIVILEGES ON TABLE public.school_strand_progress FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.school_strand_progress TO service_role;

COMMENT ON VIEW public.school_strand_progress IS
  'Global school-level aggregate learning indicators; service-role only until an explicitly scoped analytics API is implemented.';
