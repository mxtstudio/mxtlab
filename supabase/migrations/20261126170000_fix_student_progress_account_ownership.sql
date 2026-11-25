-- MXT Lab: make learning history account-owned and restrict roster visibility.
-- Abort rather than orphan/reassign any unexpected legacy rows.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.student_progress sp LEFT JOIN public.profiles p ON p.id = sp.student_id WHERE p.id IS NULL) THEN
    RAISE EXCEPTION 'student_progress contains IDs that are not profile IDs; reconcile before migration';
  END IF;
  IF EXISTS (SELECT 1 FROM public.quiz_attempts qa LEFT JOIN public.profiles p ON p.id = qa.student_id WHERE p.id IS NULL) THEN
    RAISE EXCEPTION 'quiz_attempts contains IDs that are not profile IDs; reconcile before migration';
  END IF;
END
$$;

ALTER TABLE public.student_progress DROP CONSTRAINT IF EXISTS student_progress_student_id_fkey;
ALTER TABLE public.student_progress ADD CONSTRAINT student_progress_student_id_fkey
  FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.quiz_attempts DROP CONSTRAINT IF EXISTS quiz_attempts_student_id_fkey;
ALTER TABLE public.quiz_attempts ADD CONSTRAINT quiz_attempts_student_id_fkey
  FOREIGN KEY (student_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS progress_select_roster ON public.student_progress;
DROP POLICY IF EXISTS progress_insert_owner ON public.student_progress;
DROP POLICY IF EXISTS progress_update_owner ON public.student_progress;
DROP POLICY IF EXISTS progress_delete_owner ON public.student_progress;

CREATE POLICY progress_select_owner ON public.student_progress
  FOR SELECT TO authenticated USING (student_id = (SELECT auth.uid()));
CREATE POLICY progress_select_linked_teacher ON public.student_progress
  FOR SELECT TO authenticated USING (public.is_my_student(student_id));
CREATE POLICY progress_insert_owner ON public.student_progress
  FOR INSERT TO authenticated WITH CHECK (student_id = (SELECT auth.uid()));
CREATE POLICY progress_update_owner ON public.student_progress
  FOR UPDATE TO authenticated
  USING (student_id = (SELECT auth.uid()))
  WITH CHECK (student_id = (SELECT auth.uid()));
CREATE POLICY progress_delete_owner ON public.student_progress
  FOR DELETE TO authenticated USING (student_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS quiz_select_roster ON public.quiz_attempts;
DROP POLICY IF EXISTS quiz_insert_owner ON public.quiz_attempts;

CREATE POLICY quiz_select_owner ON public.quiz_attempts
  FOR SELECT TO authenticated USING (student_id = (SELECT auth.uid()));
CREATE POLICY quiz_select_linked_teacher ON public.quiz_attempts
  FOR SELECT TO authenticated USING (public.is_my_student(student_id));
CREATE POLICY quiz_insert_owner ON public.quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (student_id = (SELECT auth.uid()));

REVOKE ALL ON TABLE public.student_progress FROM PUBLIC, anon;
REVOKE ALL ON TABLE public.quiz_attempts FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.student_progress TO authenticated;
GRANT SELECT, INSERT ON TABLE public.quiz_attempts TO authenticated;
GRANT ALL ON TABLE public.student_progress TO service_role;
GRANT ALL ON TABLE public.quiz_attempts TO service_role;

CREATE INDEX IF NOT EXISTS student_progress_student_topic_idx ON public.student_progress (student_id, topic_id);
CREATE INDEX IF NOT EXISTS quiz_attempts_student_topic_attempted_idx ON public.quiz_attempts (student_id, topic_id, attempted_at DESC);

REVOKE ALL ON FUNCTION public.check_rate_limit(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, integer, integer) TO authenticated;
REVOKE ALL ON FUNCTION public.review_lesson_plan(uuid, boolean, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_lesson_plan(uuid, boolean, text) TO authenticated;
REVOKE ALL ON FUNCTION public.review_sap(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_sap(uuid, boolean) TO authenticated;
REVOKE ALL ON FUNCTION public.list_my_api_keys() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_my_api_keys() TO authenticated;
REVOKE ALL ON FUNCTION public.revoke_my_api_key(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.revoke_my_api_key(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.flag_new_device_session() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_head_of_department_to_roles() FROM PUBLIC, anon, authenticated;

COMMENT ON TABLE public.student_progress IS 'Learning progress belongs to the permanent student profile; teacher reads require an active teacher_students link.';
COMMENT ON TABLE public.quiz_attempts IS 'Quiz history belongs to the permanent student profile; teacher reads require an active teacher_students link.';
