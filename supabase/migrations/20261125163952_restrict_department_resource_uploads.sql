-- MXT Lab: restrict department resource uploads to staff and cap file types/sizes.
UPDATE storage.buckets
   SET public = false,
       file_size_limit = 10485760,
       allowed_mime_types = ARRAY[
         'application/pdf',
         'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/vnd.ms-powerpoint',
         'application/vnd.openxmlformats-officedocument.presentationml.presentation',
         'application/vnd.ms-excel',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
         'image/jpeg',
         'image/png'
       ]::text[]
 WHERE id = 'department-resources';

DROP POLICY IF EXISTS "dept members read resources" ON storage.objects;
DROP POLICY IF EXISTS "dept members upload resources" ON storage.objects;

CREATE POLICY "department staff read resources"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'department-resources'
    AND (
      public.current_role_is_admin()
      OR EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = (SELECT auth.uid())
          AND p.role = 'teacher'
          AND (storage.foldername(name))[1] = p.department_id::text
      )
    )
  );

CREATE POLICY "department staff upload resources"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'department-resources'
    AND (
      public.current_role_is_admin()
      OR EXISTS (
        SELECT 1
        FROM public.profiles p
        WHERE p.id = (SELECT auth.uid())
          AND p.role = 'teacher'
          AND (storage.foldername(name))[1] = p.department_id::text
      )
    )
  );
