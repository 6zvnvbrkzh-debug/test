-- 1) Drop the over-permissive public SELECT on serial_numbers
DROP POLICY IF EXISTS "Anyone can view serial number counts" ON public.serial_numbers;

-- 2) user_roles: prevent privilege escalation
-- Revoke broad table grants so only the policies decide.
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Add a RESTRICTIVE policy that blocks any INSERT/UPDATE/DELETE from
-- non-admin client roles. Combined with the existing "Admins can manage roles"
-- permissive policy, only admins (or service_role, which bypasses RLS) can write.
DROP POLICY IF EXISTS "Only admins can modify roles" ON public.user_roles;
CREATE POLICY "Only admins can modify roles"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO authenticated, anon
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Storage: enforce per-user folder on INSERT to listing-images
DROP POLICY IF EXISTS "Authenticated users can upload listing images" ON storage.objects;
CREATE POLICY "Authenticated users can upload listing images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-images'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

-- 4) Restrict bucket listing: replace the broad SELECT with a metadata-scoped
-- policy. Public image URLs (signed render path) still work — they bypass
-- storage.objects SELECT — but anonymous LISTING of the bucket is denied.
DROP POLICY IF EXISTS "Anyone can view listing images" ON storage.objects;
CREATE POLICY "Authenticated can read listing-images metadata"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'listing-images');

-- 5) Pin search_path on remaining SECURITY DEFINER helpers
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

-- 6) Revoke EXECUTE from anon/authenticated on internal pgmq wrappers.
-- These are only meant to be called by the process-email-queue edge function
-- using the service role.
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- 7) The auth-email-hook calls enqueue_email — ensure supabase_auth_admin can too.
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO supabase_auth_admin;