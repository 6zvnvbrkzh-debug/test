
REVOKE EXECUTE ON FUNCTION public.claim_voucher(text, uuid) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.claim_voucher(text, uuid) TO service_role;
