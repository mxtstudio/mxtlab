-- MXT Lab: preserve existing authorization while consolidating permissive RLS policies
-- and wrapping auth.uid() so PostgreSQL evaluates it once per statement.
DROP POLICY IF EXISTS "hod department select" ON public.dashboard_entries;
DROP POLICY IF EXISTS "own entries select" ON public.dashboard_entries;
CREATE POLICY "owner or hod select entries"
  ON public.dashboard_entries FOR SELECT TO public
  USING (
    deleted_at IS NULL
    AND (
      teacher_id = (SELECT auth.uid())
      OR EXISTS (
        SELECT 1
        FROM public.department_roles dr
        JOIN public.profiles p ON p.id = dashboard_entries.teacher_id
        WHERE dr.profile_id = (SELECT auth.uid())
          AND dr.role = 'hod'
          AND dr.department_id = p.department_id
      )
    )
  );

DROP POLICY IF EXISTS "Teachers manage their own lesson notes" ON public.lesson_notes;
DROP POLICY IF EXISTS "Admins can view all lesson notes" ON public.lesson_notes;
DROP POLICY IF EXISTS "HODs can view lesson notes in their department" ON public.lesson_notes;
CREATE POLICY "owner admin or hod select lesson notes"
  ON public.lesson_notes FOR SELECT TO authenticated
  USING (
    teacher_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
    OR EXISTS (
      SELECT 1
      FROM public.lesson_plans lp
      JOIN public.department_roles dr ON dr.department_id = lp.department_id
      WHERE lp.id = lesson_notes.lesson_plan_id
        AND dr.profile_id = (SELECT auth.uid())
        AND dr.role = 'hod'
    )
  );
CREATE POLICY "teachers insert own lesson notes"
  ON public.lesson_notes FOR INSERT TO authenticated
  WITH CHECK (teacher_id = (SELECT auth.uid()));
CREATE POLICY "teachers update own lesson notes"
  ON public.lesson_notes FOR UPDATE TO authenticated
  USING (teacher_id = (SELECT auth.uid()))
  WITH CHECK (teacher_id = (SELECT auth.uid()));
CREATE POLICY "teachers delete own lesson notes"
  ON public.lesson_notes FOR DELETE TO authenticated
  USING (teacher_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Teachers manage their own SAPs" ON public.saps;
DROP POLICY IF EXISTS "Admins can view all SAPs" ON public.saps;
DROP POLICY IF EXISTS "HODs can view their department's SAPs" ON public.saps;
DROP POLICY IF EXISTS "HODs can review their department's SAPs" ON public.saps;
CREATE POLICY "owner admin or hod select saps"
  ON public.saps FOR SELECT TO authenticated
  USING (
    teacher_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM public.department_roles dr
      WHERE dr.department_id = saps.department_id
        AND dr.profile_id = (SELECT auth.uid())
        AND dr.role = 'hod'
    )
  );
CREATE POLICY "teachers insert own saps"
  ON public.saps FOR INSERT TO authenticated
  WITH CHECK (teacher_id = (SELECT auth.uid()));
CREATE POLICY "owners or hods update saps"
  ON public.saps FOR UPDATE TO authenticated
  USING (
    teacher_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.department_roles dr
      WHERE dr.department_id = saps.department_id
        AND dr.profile_id = (SELECT auth.uid())
        AND dr.role = 'hod'
    )
  )
  WITH CHECK (
    teacher_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.department_roles dr
      WHERE dr.department_id = saps.department_id
        AND dr.profile_id = (SELECT auth.uid())
        AND dr.role = 'hod'
    )
  );
CREATE POLICY "teachers delete own saps"
  ON public.saps FOR DELETE TO authenticated
  USING (teacher_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can view all sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Admins can update any session" ON public.sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON public.sessions;
CREATE POLICY "owners or admins select sessions"
  ON public.sessions FOR SELECT TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );
CREATE POLICY "owners or admins update sessions"
  ON public.sessions FOR UPDATE TO authenticated
  USING (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    user_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.subscriptions;

DROP POLICY IF EXISTS "HODs can view requests for their department" ON public.teacher_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.teacher_requests;
CREATE POLICY "owners or hods select teacher requests"
  ON public.teacher_requests FOR SELECT TO authenticated
  USING (
    requested_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.department_roles dr
      WHERE dr.department_id = teacher_requests.department_id
        AND dr.profile_id = (SELECT auth.uid())
        AND dr.role = 'hod'
    )
  );

DROP POLICY IF EXISTS "Teachers manage their own timetable" ON public.timetable_entries;
DROP POLICY IF EXISTS "Admins can view all timetables" ON public.timetable_entries;
DROP POLICY IF EXISTS "HODs can view their department's timetable" ON public.timetable_entries;
CREATE POLICY "owner admin or hod select timetable"
  ON public.timetable_entries FOR SELECT TO authenticated
  USING (
    teacher_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
    OR EXISTS (
      SELECT 1 FROM public.department_roles dr
      WHERE dr.department_id = timetable_entries.department_id
        AND dr.profile_id = (SELECT auth.uid())
        AND dr.role = 'hod'
    )
  );
CREATE POLICY "teachers insert own timetable"
  ON public.timetable_entries FOR INSERT TO authenticated
  WITH CHECK (teacher_id = (SELECT auth.uid()));
CREATE POLICY "teachers update own timetable"
  ON public.timetable_entries FOR UPDATE TO authenticated
  USING (teacher_id = (SELECT auth.uid()))
  WITH CHECK (teacher_id = (SELECT auth.uid()));
CREATE POLICY "teachers delete own timetable"
  ON public.timetable_entries FOR DELETE TO authenticated
  USING (teacher_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Admins can view all version history" ON public.version_history;
DROP POLICY IF EXISTS "HODs can view SAP version history in their department" ON public.version_history;
DROP POLICY IF EXISTS "HODs can view lesson_plan version history in their department" ON public.version_history;
DROP POLICY IF EXISTS "Users can view version history of their own edits" ON public.version_history;
CREATE POLICY "owners admins or hods select version history"
  ON public.version_history FOR SELECT TO authenticated
  USING (
    changed_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
    OR (
      document_type = 'saps'
      AND EXISTS (
        SELECT 1
        FROM public.saps s
        JOIN public.department_roles dr ON dr.department_id = s.department_id
        WHERE s.id = version_history.document_id
          AND dr.profile_id = (SELECT auth.uid())
          AND dr.role = 'hod'
      )
    )
    OR (
      document_type = 'lesson_plan'
      AND EXISTS (
        SELECT 1
        FROM public.lesson_plans lp
        JOIN public.department_roles dr ON dr.department_id = lp.department_id
        WHERE lp.id = version_history.document_id
          AND dr.profile_id = (SELECT auth.uid())
          AND dr.role = 'hod'
      )
    )
  );

DROP POLICY IF EXISTS "teachers manage own plans, hod/admin see dept" ON public.lesson_plans;
CREATE POLICY "teachers manage own plans, hod/admin see dept"
  ON public.lesson_plans FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = ANY (ARRAY['teacher'::text, 'admin'::text])
    )
    AND (
      teacher_id = (SELECT auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.department_roles dr
        WHERE dr.department_id = lesson_plans.department_id
          AND dr.profile_id = (SELECT auth.uid())
          AND dr.role = 'hod'
      )
      OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = (SELECT auth.uid())
          AND profiles.role = 'admin'
      )
    )
  )
  WITH CHECK (
    teacher_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = (SELECT auth.uid())
        AND profiles.role = ANY (ARRAY['teacher'::text, 'admin'::text])
    )
  );

CREATE INDEX IF NOT EXISTS teacher_applications_admin_id_idx
  ON public.teacher_applications (admin_id);
