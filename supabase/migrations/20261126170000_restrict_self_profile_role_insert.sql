-- Prevent self-created profile rows from assigning privileged roles.
-- The auth signup trigger creates new profiles with the column default ('student').
-- Administrators retain the ability to create/manage profiles with approved roles.
DROP POLICY IF EXISTS profiles_insert_self_or_admin ON public.profiles;

CREATE POLICY profiles_insert_self_or_admin
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.current_role_is_admin()
    OR (
      (SELECT auth.uid()) = id
      AND role = 'student'
    )
  );

COMMENT ON POLICY profiles_insert_self_or_admin ON public.profiles IS
  'Users may create only their own student profile; administrators may create profiles with authorized roles.';
