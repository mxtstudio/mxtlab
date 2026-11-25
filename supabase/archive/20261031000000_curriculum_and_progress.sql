-- Migration: Curriculum hierarchy and student progress tables
-- Applied to live project mqiwckclyohjdhjaoaor
-- Timestamp: 2026-10-31 08:00:00 UTC

-- 1. Curriculum hierarchy tables
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade integer NOT NULL CHECK (grade BETWEEN 9 AND 12),
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.strands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strand_id uuid NOT NULL REFERENCES public.strands(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.content_standards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  code text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  standard_id uuid NOT NULL REFERENCES public.content_standards(id) ON DELETE CASCADE,
  code text NOT NULL,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  benchmark_id uuid NOT NULL REFERENCES public.benchmarks(id) ON DELETE CASCADE,
  title text NOT NULL,
  learning_objectives text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Student progress tables
CREATE TABLE public.student_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.roster_students(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('in_progress','completed')),
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.roster_students(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  score numeric NOT NULL,
  max_score numeric NOT NULL,
  attempted_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Enable row level security
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- 4. Policies (authenticated users can read all curriculum; students can read/write their own progress)
-- Curriculum: read‑only for any authenticated user
CREATE POLICY curriculum_read ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY curriculum_read ON public.strands FOR SELECT TO authenticated USING (true);
CREATE POLICY curriculum_read ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY curriculum_read ON public.content_standards FOR SELECT TO authenticated USING (true);
CREATE POLICY curriculum_read ON public.benchmarks FOR SELECT TO authenticated USING (true);
CREATE POLICY curriculum_read ON public.topics FOR SELECT TO authenticated USING (true);

-- Student progress: students can select/insert/update/delete their own rows; teachers can read any row (role‑based)
CREATE POLICY progress_select_student ON public.student_progress FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY progress_insert_student ON public.student_progress FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY progress_update_student ON public.student_progress FOR UPDATE TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
CREATE POLICY progress_delete_student ON public.student_progress FOR DELETE TO authenticated USING (student_id = auth.uid());

-- Teachers can read all progress (simple policy, refined later)
CREATE POLICY progress_select_teacher ON public.student_progress FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher'));

-- Quiz attempts: similar policies
CREATE POLICY quiz_select_student ON public.quiz_attempts FOR SELECT TO authenticated USING (student_id = auth.uid());
CREATE POLICY quiz_insert_student ON public.quiz_attempts FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY quiz_select_teacher ON public.quiz_attempts FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher'));

-- Revoke public grants and grant to authenticated
REVOKE ALL ON public.subjects FROM public, anon;
REVOKE ALL ON public.strands FROM public, anon;
REVOKE ALL ON public.units FROM public, anon;
REVOKE ALL ON public.content_standards FROM public, anon;
REVOKE ALL ON public.benchmarks FROM public, anon;
REVOKE ALL ON public.topics FROM public, anon;
REVOKE ALL ON public.student_progress FROM public, anon;
REVOKE ALL ON public.quiz_attempts FROM public, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.strands TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.units TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_standards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.benchmarks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.topics TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_attempts TO authenticated;

-- End migration