ALTER TABLE public.orders ADD COLUMN customer_name text DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN customer_email text DEFAULT NULL;
ALTER TABLE public.orders ADD COLUMN shipping_address jsonb DEFAULT NULL;