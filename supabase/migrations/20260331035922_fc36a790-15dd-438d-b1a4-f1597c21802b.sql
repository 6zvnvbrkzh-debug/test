
CREATE OR REPLACE FUNCTION public.decrement_stock_on_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.listings
  SET stock = GREATEST(stock - 1, 0)
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_decrement_stock_on_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.decrement_stock_on_order();
