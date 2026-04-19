-- Sequential invoice numbers per order
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1000;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS invoice_number TEXT;

-- Function: assigns invoice number on first request (idempotent)
CREATE OR REPLACE FUNCTION public.get_or_create_invoice_number(_order_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing TEXT;
  v_new TEXT;
  v_year TEXT;
BEGIN
  SELECT invoice_number INTO v_existing FROM public.orders WHERE id = _order_id;
  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;
  v_year := to_char(now(), 'YYYY');
  v_new := 'BE-' || v_year || '-' || lpad(nextval('public.invoice_number_seq')::text, 5, '0');
  UPDATE public.orders SET invoice_number = v_new WHERE id = _order_id AND invoice_number IS NULL;
  SELECT invoice_number INTO v_existing FROM public.orders WHERE id = _order_id;
  RETURN v_existing;
END;
$$;