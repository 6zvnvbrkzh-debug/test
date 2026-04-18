
-- Bestehende zu permissive INSERT-Policy entfernen
DROP POLICY IF EXISTS "Users can create reviews for their orders" ON public.reviews;

-- Strikte INSERT-Policy: nur eigene, abgeschlossene/versendete Bestellungen
CREATE POLICY "Buyers can review their completed orders"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = reviewer_id
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = reviews.order_id
      AND o.buyer_id = auth.uid()
      AND o.seller_id = reviews.seller_id
      AND o.status IN ('SHIPPED', 'COMPLETED')
  )
);

-- UPDATE: Nutzer dürfen ihre eigene Bewertung bearbeiten
CREATE POLICY "Users can update their own reviews"
ON public.reviews
FOR UPDATE
TO authenticated
USING (auth.uid() = reviewer_id)
WITH CHECK (auth.uid() = reviewer_id);

-- DELETE: Nutzer dürfen ihre eigene Bewertung löschen
CREATE POLICY "Users can delete their own reviews"
ON public.reviews
FOR DELETE
TO authenticated
USING (auth.uid() = reviewer_id);

-- Hilfreiche Indizes für Performance bei Aggregationen
CREATE INDEX IF NOT EXISTS idx_reviews_order_id ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS idx_reviews_seller_id ON public.reviews(seller_id);
