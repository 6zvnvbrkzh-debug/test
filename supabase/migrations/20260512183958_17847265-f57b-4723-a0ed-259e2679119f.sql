
-- Counter table for product views
CREATE TABLE IF NOT EXISTS public.listing_view_counts (
  listing_id uuid PRIMARY KEY REFERENCES public.listings(id) ON DELETE CASCADE,
  views bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_view_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View counts are public" ON public.listing_view_counts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage view counts" ON public.listing_view_counts
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- SECURITY DEFINER RPC to increment view count safely from anonymous clients
CREATE OR REPLACE FUNCTION public.increment_listing_view(_listing_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.listings WHERE id = _listing_id) THEN
    RETURN;
  END IF;
  INSERT INTO public.listing_view_counts (listing_id, views, updated_at)
  VALUES (_listing_id, 1, now())
  ON CONFLICT (listing_id)
  DO UPDATE SET views = listing_view_counts.views + 1, updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_listing_view(uuid) TO anon, authenticated;
