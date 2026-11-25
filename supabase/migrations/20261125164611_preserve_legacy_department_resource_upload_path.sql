-- MXT Lab: maintain compatibility with the deployed teacher portal while the uploader-folder UI rolls out.
DROP POLICY IF EXISTS "department staff upload own folder" ON storage.objects;
CREATE POLICY "department staff upload own or legacy folder"
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
          AND (
            cardinality(storage.foldername(name)) = 1
            OR (storage.foldername(name))[2] = p.id::text
          )
      )
    )
  );
