
DROP POLICY IF EXISTS "Buyers can review their completed orders" ON public.reviews;

CREATE POLICY "Buyers can review their orders"
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
  )
);
