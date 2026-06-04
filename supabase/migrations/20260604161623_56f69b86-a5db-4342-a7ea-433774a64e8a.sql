-- Remove direct EXECUTE on internal/definer functions from API roles.
-- These are used by RLS policies, triggers, or trusted edge functions only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role, supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.get_or_create_invoice_number(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_or_create_invoice_number(uuid) TO service_role;

REVOKE EXECUTE ON FUNCTION public.decrement_stock_on_order() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_serial_on_order() FROM PUBLIC, anon, authenticated;

-- increment_listing_view is called from the client (anon + authenticated) — keep it.

-- Drop the storage SELECT policy entirely; the listing-images bucket is public,
-- so direct object URLs continue to work (they bypass storage.objects RLS),
-- but anonymous LISTING/scanning of the bucket is no longer possible.
DROP POLICY IF EXISTS "Authenticated can read listing-images metadata" ON storage.objects;