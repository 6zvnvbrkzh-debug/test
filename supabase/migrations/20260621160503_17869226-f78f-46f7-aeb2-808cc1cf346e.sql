
-- Vouchers (Geschenkgutscheine, aufladbar)
CREATE TABLE public.vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  initial_amount numeric(10,2) NOT NULL CHECK (initial_amount > 0),
  balance numeric(10,2) NOT NULL CHECK (balance >= 0),
  currency text NOT NULL DEFAULT 'EUR',
  valid_from timestamptz,
  valid_until timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  note text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vouchers_code ON public.vouchers (code);
CREATE INDEX idx_vouchers_active ON public.vouchers (is_active) WHERE is_active = true;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.vouchers TO authenticated;
GRANT ALL ON public.vouchers TO service_role;

ALTER TABLE public.vouchers ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write vouchers from the client (codes are sensitive).
-- Validation/redemption for customers happens through edge functions with service role.
CREATE POLICY "Admins can view vouchers"
  ON public.vouchers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert vouchers"
  ON public.vouchers FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update vouchers"
  ON public.vouchers FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete vouchers"
  ON public.vouchers FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_vouchers_updated_at
  BEFORE UPDATE ON public.vouchers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Redemption history
CREATE TABLE public.voucher_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id uuid NOT NULL REFERENCES public.vouchers(id) ON DELETE CASCADE,
  stripe_session_id text,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  amount_used numeric(10,2) NOT NULL CHECK (amount_used > 0),
  customer_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_voucher_redemptions_voucher ON public.voucher_redemptions (voucher_id);
CREATE INDEX idx_voucher_redemptions_session ON public.voucher_redemptions (stripe_session_id);

GRANT SELECT ON public.voucher_redemptions TO authenticated;
GRANT ALL ON public.voucher_redemptions TO service_role;

ALTER TABLE public.voucher_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view redemptions"
  ON public.voucher_redemptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Atomic redeem function (called by stripe-webhook via service role).
-- Decrements balance and inserts redemption row in a single transaction.
CREATE OR REPLACE FUNCTION public.redeem_voucher(
  _voucher_id uuid,
  _amount numeric,
  _stripe_session_id text,
  _order_id uuid,
  _customer_email text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance numeric;
BEGIN
  -- Idempotency: skip if already redeemed for this session
  IF EXISTS (
    SELECT 1 FROM public.voucher_redemptions
    WHERE voucher_id = _voucher_id AND stripe_session_id = _stripe_session_id
  ) THEN
    RETURN false;
  END IF;

  SELECT balance INTO v_balance
  FROM public.vouchers
  WHERE id = _voucher_id
  FOR UPDATE;

  IF v_balance IS NULL OR v_balance < _amount THEN
    RETURN false;
  END IF;

  UPDATE public.vouchers
  SET balance = balance - _amount,
      updated_at = now()
  WHERE id = _voucher_id;

  INSERT INTO public.voucher_redemptions (
    voucher_id, stripe_session_id, order_id, amount_used, customer_email
  ) VALUES (
    _voucher_id, _stripe_session_id, _order_id, _amount, _customer_email
  );

  RETURN true;
END;
$$;
