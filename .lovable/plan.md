# 🚀 Optimierungs-Roadmap – Barbato Electronics Shop

Ein priorisierter Plan zur Steigerung von Vertrauen, Conversion und Umsatz.

---

## 🔴 Phase 1 – Vertrauen & Conversion (Höchste Priorität)

### 1.1 Produktbewertungssystem
- Käufer können nach abgeschlossener Bestellung Sterne (1–5) und einen Kommentar abgeben
- Sterne-Durchschnitt + Anzahl auf Produktkarten (`ProductCard.tsx`)
- Eigene Reviews-Sektion auf der Produktdetailseite
- "Bewerten"-Button im Konto bei Bestellungen mit Status `COMPLETED`
- Nutzung der bestehenden `reviews`-Tabelle, RLS-Policy anpassen (nur eigene Bestellungen bewerten)

### 1.2 Trust-Elemente & Versandinfos
- Trust-Badges-Leiste auf Produktdetailseite & Checkout (Sichere Zahlung, Käuferschutz, Versand aus DE, 14 Tage Widerruf)
- Versandinfo-Box: Lieferzeit, Versandkosten, DHL als Versanddienstleister
- Lagerbestand-Anzeige: "Nur noch X verfügbar" wenn `stock < 5`

### 1.3 Tracking-Link für Kunden
- DHL-Sendungsverfolgungs-Link im Konto klickbar machen
- Format: `https://www.dhl.de/...?piececode={tracking_number}`

---

## 🟡 Phase 2 – Cross-Selling & UX

### 2.1 Verwandte Produkte
- Auf Produktdetailseite 4 weitere Produkte aus derselben Kategorie anzeigen
- Reuse von `ProductCard.tsx` in horizontalem Grid

### 2.2 Wunschliste / Favoriten
- Neue Tabelle `wishlists` (user_id, listing_id)
- Herz-Icon auf `ProductCard` und Detailseite
- Neue Sektion im Konto "Meine Wunschliste"

### 2.3 FAQ- & Kontaktseite
- `/faq` mit Accordion: Versand, Garantie, Rückgabe, Zahlung, Geräte-Fragen
- `/kontakt` mit Formular (sendet via Edge Function E-Mail an Shop-Inhaber)

---

## 🟢 Phase 3 – SEO & Sichtbarkeit

### 3.1 Strukturierte Daten (Schema.org)
- JSON-LD `Product` auf Produktdetailseite (Preis, Verfügbarkeit, Bewertungen)
- JSON-LD `Organization` auf Startseite
- → bessere Google-Rich-Snippets

### 3.2 Open-Graph-Bilder pro Produkt
- Dynamische OG-Tags in `SEOHead.tsx` mit Produktbild
- Hübsche Vorschau bei Shares auf WhatsApp / Telegram

### 3.3 Blog / Ratgeber (optional, später)
- Einfacher Blog-Bereich für SEO-Traffic ("IPTV einrichten", "Beste Streaming-Box 2025")

---

## ⚙️ Phase 4 – Admin & Backoffice

### 4.1 Bestellexport (CSV)
- Button im Admin-Bestellbereich → CSV-Download für Buchhaltung

### 4.2 Rechnungs-PDF
- Edge Function generiert PDF nach Bestellung
- Link im Konto + automatischer E-Mail-Versand (sobald neue Domain steht)

### 4.3 Mehrere Produktbilder im Admin
- Falls aktuell nur 1 Bild upload-bar → Multi-Upload mit Reihenfolge

---

## 📊 Empfohlene Reihenfolge

1. **Phase 1.1** – Bewertungen (größter Trust-Boost)
2. **Phase 1.2** – Trust-Badges & Versandinfos
3. **Phase 2.1** – Verwandte Produkte (schnelle Umsatzsteigerung)
4. **Phase 1.3** – Tracking-Link
5. **Phase 3.1** – Schema.org strukturierte Daten
6. **Phase 2.3** – FAQ & Kontakt
7. **Phase 2.2** – Wunschliste
8. **Phase 4.x** – Admin-Tools nach Bedarf

---

## ⏸️ Verschoben auf später (deine Entscheidung)
- 🔍 Produktsuche & Filter (zu wenig Produkte aktuell)
- 📧 Newsletter & E-Mail-Automation (wartet auf neue Domain)
