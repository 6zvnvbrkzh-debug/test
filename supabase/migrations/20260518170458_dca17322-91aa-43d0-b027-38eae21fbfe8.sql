-- Remove unique constraint so multi-quantity / multi-item orders can store multiple rows per Stripe session
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_stripe_session_id_key;

-- Helpful non-unique index for grouping/lookup performance
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);

-- Backfill: insert missing 2nd order row for Vito Pipitone
INSERT INTO public.orders (buyer_id, seller_id, listing_id, amount, status, stripe_session_id, customer_name, customer_email, shipping_address, tracking_number)
SELECT buyer_id, seller_id, listing_id, amount, status, stripe_session_id, customer_name, customer_email, shipping_address, tracking_number
FROM public.orders
WHERE id = 'e5c3cb05-f379-4b67-b3ce-7dddcb55f24e';

-- Decrement stock by 1 for the missed unit
UPDATE public.listings SET stock = GREATEST(stock - 1, 0)
WHERE id = '7aad0d3c-5815-4cd1-83ef-a3732ed3778e';