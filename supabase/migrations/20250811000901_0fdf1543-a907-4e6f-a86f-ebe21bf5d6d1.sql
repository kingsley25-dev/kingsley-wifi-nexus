-- Add useful columns for admin CRUD that match UI semantics
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS duration_hours integer,
  ADD COLUMN IF NOT EXISTS speed_mbps integer;

-- Ensure a unique admin mapping per auth user
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_user_id_unique ON public.admin_users(user_id);

-- Bootstrap policy: allow the specified email to insert their own admin row
DROP POLICY IF EXISTS admin_users_bootstrap_insert ON public.admin_users;
CREATE POLICY admin_users_bootstrap_insert
ON public.admin_users
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'kingsleycorp25@gmail.com');
