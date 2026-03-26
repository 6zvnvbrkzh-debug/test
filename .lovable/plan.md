

## Stripe-Zahlungen mit Produkt-Datenbank einrichten

### Überblick
Die Produkte werden von Mock-Daten in die bestehende `listings`-Tabelle in der Datenbank migriert. Dann wird Stripe Checkout integriert, damit Kunden direkt aus dem Warenkorb bezahlen können.

---

### Schritt 1: Stripe Integration aktivieren
- Das Stripe-Tool aktivieren (Secrets sind bereits vorhanden: `Stripe_SK` und `webhook_stripe`)
- Dadurch werden die nötigen Edge Functions und Konfigurationen bereitgestellt

### Schritt 2: Produkte in die Datenbank einfügen
- Die 9 bestehenden Mock-Produkte in die `listings`-Tabelle einfügen (mit einem festen `seller_id` für B-Electronics)
- Felder: title, description, price, condition, category_id, images, specs, status
- Dafür muss eine Kategorie-Zuordnung erstellt werden (categories-Tabelle befüllen)
- Ein `original_price`-Feld zur `listings`-Tabelle hinzufügen (für Rabattanzeige)

### Schritt 3: Shop-Seiten auf Datenbank umstellen
- `ShopPage.tsx` und `ProductDetailPage.tsx` ändern: statt `mockListings` werden Daten per Supabase-Query geladen
- `CartContext` anpassen, damit es mit den Datenbank-Listings funktioniert
- Loading-States und Error-Handling hinzufügen

### Schritt 4: Stripe Checkout Edge Function
- Edge Function `create-checkout` erstellen, die:
  - Warenkorb-Items entgegennimmt
  - Stripe Checkout Session mit den Produkten erstellt
  - Session-URL zurückgibt
- Edge Function `stripe-webhook` für Zahlungsbestätigungen (Order-Status updaten)

### Schritt 5: Checkout-Flow im Frontend
- "Zur Kasse"-Button im CartDrawer mit Stripe Checkout verbinden
- Erfolgs- und Abbruch-Seiten erstellen (`/checkout/success`, `/checkout/cancel`)
- Order in der `orders`-Tabelle speichern

---

### Technische Details

**Datenbank-Migration:**
- `ALTER TABLE listings ADD COLUMN original_price numeric;`
- Categories + Listings per Insert-Tool befüllen

**Neue Dateien:**
- `supabase/functions/create-checkout/index.ts`
- `supabase/functions/stripe-webhook/index.ts`
- `src/pages/CheckoutSuccess.tsx`
- `src/pages/CheckoutCancel.tsx`
- `src/hooks/useListings.ts` (Supabase Query Hook)

**Geänderte Dateien:**
- `src/pages/ShopPage.tsx` — Datenbank statt Mock-Daten
- `src/pages/ProductDetailPage.tsx` — Datenbank statt Mock-Daten
- `src/contexts/CartContext.tsx` — Typ-Anpassungen
- `src/components/cart/CartDrawer.tsx` — Checkout-Button Logik
- `src/App.tsx` — Neue Routen

