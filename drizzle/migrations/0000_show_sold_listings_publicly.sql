DROP POLICY IF EXISTS "Active listings are viewable by everyone" ON public.listings;

CREATE POLICY "Active and sold listings are viewable by everyone"
ON public.listings
FOR SELECT
USING (status IN ('ACTIVE','SOLD') OR auth.uid() = seller_id);

-- Bestände korrigieren: Artikel mit Lagerbestand wieder aktiv, ohne Bestand als verkauft
UPDATE public.listings SET status = 'ACTIVE' WHERE stock > 0 AND status = 'SOLD';
UPDATE public.listings SET status = 'SOLD' WHERE stock = 0 AND status = 'ACTIVE';