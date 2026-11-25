-- MXT Lab: teachers may view account-linked learning records only for students explicitly linked to them.
DROP POLICY IF EXISTS lesson_progress_select_merged ON public.lesson_progress;
CREATE POLICY lesson_progress_select_owner_or_linked_teacher
  ON public.lesson_progress FOR SELECT TO authenticated
  USING (
    public.current_role_is_admin()
    OR student_id = (SELECT auth.uid())
    OR public.is_my_student(student_id)
  );

DROP POLICY IF EXISTS practice_attempts_select_merged ON public.practice_attempts;
CREATE POLICY practice_attempts_select_owner_or_linked_teacher
  ON public.practice_attempts FOR SELECT TO authenticated
  USING (
    public.current_role_is_admin()
    OR student_id = (SELECT auth.uid())
    OR public.is_my_student(student_id)
  );
