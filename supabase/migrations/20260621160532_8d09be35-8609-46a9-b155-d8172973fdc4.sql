
REVOKE EXECUTE ON FUNCTION public.redeem_voucher(uuid, numeric, text, uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_voucher(uuid, numeric, text, uuid, text) TO service_role;
