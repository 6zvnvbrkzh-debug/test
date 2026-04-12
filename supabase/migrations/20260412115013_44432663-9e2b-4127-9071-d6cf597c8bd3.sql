
-- Create serial number status enum
CREATE TYPE public.serial_number_status AS ENUM ('available', 'sold');

-- Create serial_numbers table
CREATE TABLE public.serial_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL,
  status public.serial_number_status NOT NULL DEFAULT 'available',
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sold_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (listing_id, serial_number)
);

-- Enable RLS
ALTER TABLE public.serial_numbers ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage serial numbers"
ON public.serial_numbers
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Everyone can count available serials (but not see the actual numbers)
CREATE POLICY "Anyone can view serial number counts"
ON public.serial_numbers
FOR SELECT
USING (true);

-- Function to assign a serial number when an order is created
CREATE OR REPLACE FUNCTION public.assign_serial_on_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_serial_id UUID;
BEGIN
  -- Find an available serial number for this listing
  SELECT id INTO v_serial_id
  FROM public.serial_numbers
  WHERE listing_id = NEW.listing_id
    AND status = 'available'
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- If found, mark it as sold
  IF v_serial_id IS NOT NULL THEN
    UPDATE public.serial_numbers
    SET status = 'sold',
        order_id = NEW.id,
        sold_at = now()
    WHERE id = v_serial_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger to auto-assign serial number on new order
CREATE TRIGGER trg_assign_serial_on_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.assign_serial_on_order();

-- Index for fast lookups
CREATE INDEX idx_serial_numbers_listing_status ON public.serial_numbers(listing_id, status);
