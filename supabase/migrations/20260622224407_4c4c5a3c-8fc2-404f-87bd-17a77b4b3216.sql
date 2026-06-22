
COMMENT ON TABLE public.voucher_redemptions IS
'Redemptions are written exclusively by the service role via the SECURITY DEFINER function public.redeem_voucher (called from the stripe-webhook edge function). Never add a permissive INSERT/UPDATE/DELETE policy for anon or authenticated roles — that would allow clients to fabricate redemption history and double-spend voucher balances.';

-- Explicit restrictive policies: defense-in-depth so no future migration can
-- accidentally enable client writes via a permissive policy alone.
CREATE POLICY "Block client inserts on voucher_redemptions"
  ON public.voucher_redemptions
  AS RESTRICTIVE
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "Block client updates on voucher_redemptions"
  ON public.voucher_redemptions
  AS RESTRICTIVE
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "Block client deletes on voucher_redemptions"
  ON public.voucher_redemptions
  AS RESTRICTIVE
  FOR DELETE
  TO anon, authenticated
  USING (false);
