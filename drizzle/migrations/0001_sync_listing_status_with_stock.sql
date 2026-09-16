CREATE OR REPLACE FUNCTION public.sync_listing_status_with_stock()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Archivierte Artikel bleiben unberührt
  IF NEW.status = 'ARCHIVED' THEN
    RETURN NEW;
  END IF;

  IF NEW.stock > 0 THEN
    NEW.status := 'ACTIVE';
  ELSE
    NEW.status := 'SOLD';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_listing_status ON public.listings;
CREATE TRIGGER trg_sync_listing_status
BEFORE INSERT OR UPDATE OF stock, status ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.sync_listing_status_with_stock();