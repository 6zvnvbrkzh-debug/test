
-- Add user_id to vouchers (account binding)
ALTER TABLE public.vouchers
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vouchers_user_id ON public.vouchers(user_id);

-- Grant authenticated SELECT so users can list their own vouchers
GRANT SELECT ON public.vouchers TO authenticated;
GRANT SELECT ON public.voucher_redemptions TO authenticated;

-- RLS: users can view their own vouchers
DROP POLICY IF EXISTS "Users can view own vouchers" ON public.vouchers;
CREATE POLICY "Users can view own vouchers"
ON public.vouchers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- RLS: users can view redemptions of their own vouchers
DROP POLICY IF EXISTS "Users can view own voucher redemptions" ON public.voucher_redemptions;
CREATE POLICY "Users can view own voucher redemptions"
ON public.voucher_redemptions
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.vouchers v
  WHERE v.id = voucher_redemptions.voucher_id
    AND v.user_id = auth.uid()
));

-- Claim a voucher to a user. Returns the voucher row data needed by the client.
-- If voucher.user_id IS NULL: bind to _user_id.
-- If voucher.user_id = _user_id: ok.
-- Else: raises 'voucher_owned_by_other'.
CREATE OR REPLACE FUNCTION public.claim_voucher(_code text, _user_id uuid)
RETURNS TABLE (
  id uuid,
  code text,
  balance numeric,
  user_id uuid,
  is_active boolean,
  valid_from timestamptz,
  valid_until timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v public.vouchers%ROWTYPE;
BEGIN
  SELECT * INTO v FROM public.vouchers WHERE upper(code) = upper(_code) FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'voucher_not_found';
  END IF;

  IF _user_id IS NOT NULL THEN
    IF v.user_id IS NULL THEN
      UPDATE public.vouchers SET user_id = _user_id, updated_at = now()
      WHERE id = v.id
      RETURNING * INTO v;
    ELSIF v.user_id <> _user_id THEN
      RAISE EXCEPTION 'voucher_owned_by_other';
    END IF;
  END IF;

  RETURN QUERY SELECT v.id, v.code, v.balance, v.user_id, v.is_active, v.valid_from, v.valid_until;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_voucher(text, uuid) TO authenticated, anon, service_role;
