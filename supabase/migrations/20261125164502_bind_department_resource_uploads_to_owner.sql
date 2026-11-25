-- MXT Lab: bind department resource objects to their uploader so failed uploads can be cleaned up safely.
DROP POLICY IF EXISTS "department staff upload resources" ON storage.objects;
CREATE POLICY "department staff upload own folder"
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
          AND (storage.foldername(name))[2] = p.id::text
      )
    )
  );

CREATE POLICY "department staff delete own uploads"
  ON storage.objects FOR DELETE TO authenticated
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
          AND (storage.foldername(name))[2] = p.id::text
      )
    )
  );
