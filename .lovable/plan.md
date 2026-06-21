# Plan – Schritt für Schritt

Ich gehe die 4 offenen Punkte einzeln durch (Punkt 2 Gutscheine überspringen wir – läuft bereits). Nach jedem Schritt kannst du testen, bevor wir den nächsten anfangen.

---

## Schritt 1 – Benutzerverwaltung (`/admin/users`)

**Status heute:** Die Seite zeigt nur `display_name`, `location`, Datum und Rolle. E-Mail/Telefon fehlen, weil diese in `auth.users` liegen (nicht direkt vom Client lesbar).

**Was ich ändere:**
- Neue Edge Function `admin-list-users` (admin-geschützt via `has_role`), die per Service-Role aus `auth.users` (`email`, `phone`, `last_sign_in_at`, `created_at`) + `profiles` + `user_roles` eine gemeinsame Liste liefert.
- `AdminUsers.tsx` ruft diese Function statt direkt `profiles` ab und zeigt zusätzlich:
  - E-Mail
  - Telefon (falls vorhanden)
  - Letzter Login
  - Anzahl Bestellungen (optional, aus `orders` per `customer_email`)
- Rollen-Dropdown bleibt wie bisher (Kein / User / Moderator / Admin) – funktioniert schon.
- Suche/Filter nach Name oder E-Mail.

---

## Schritt 3 – Neue Bestellungen automatisch „Ausstehend"

**Problem:** `stripe-webhook` setzt aktuell `status: "COMPLETED"` beim Anlegen. In der DB existieren bisher nur `SHIPPED` und `ARCHIVED` als Werte, das Admin-UI kennt aber bereits `PENDING`.

**Was ich ändere:**
- Migration: Sicherstellen, dass der `order_status`-Enum den Wert `PENDING` enthält (hinzufügen falls fehlend).
- `supabase/functions/stripe-webhook/index.ts`: beim Insert `status: "PENDING"` statt `"COMPLETED"`.
- Stats im Admin-Dashboard („Umsatz", „Abgeschlossen") bleiben funktional – sie zählen weiterhin den jeweiligen Status, jetzt wandern Bestellungen erst manuell zu COMPLETED/SHIPPED.

---

## Schritt 4 – Versandbestätigung auch bei Statuswechsel „Versendet"

**Status heute:** E-Mail wird nur beim **Eintragen der Sendungsnummer** verschickt. Wenn der Admin nur den Status auf SHIPPED setzt, geht keine Mail raus.

**Was ich ändere in `AdminOrders.tsx` (`statusMutation`):**
- Wenn neuer Status = `SHIPPED`:
  - Sendungsnummer vorhanden + Kunde hat E-Mail → `admin-send-shipping-confirmation` aufrufen (Idempotency-Key `shipping-<groupKey>-<tracking>` verhindert Doppelversand, falls der Kunde sie schon beim Eintragen der Tracking-Nr. bekommen hat).
  - Sendungsnummer fehlt → Toast-Warnung „Bitte zuerst Sendungsnummer eintragen", keine Mail.
- `trackingMutation` bleibt wie bisher (sendet sofort beim Eintragen).

---

## Schritt 5 – Lagerbestand-Anzeige (Produktseite)

**Was ich ändere in `ProductDetailPage.tsx` (Zeilen ~378–387):**
Die genauen Zahlen entfernen und durch farbige Ampel ersetzen:

| Bestand | Anzeige | Farbe |
|---|---|---|
| ≥ 10 | „Genügend verfügbar" | Grün |
| 5–9 | „Begrenzter Bestand" | Orange |
| 1–4 | „Wenig verfügbar" | Rot |
| 0 | „Ausverkauft" (wie bisher) | Rot/Grau |

- Konkrete Stückzahl wird nicht mehr angezeigt.
- Die interne Cart-Logik (`remainingStock`, Toast „Nur noch X verfügbar") bleibt unverändert – nur die Public-Anzeige ändert sich.
- JSON-LD `availability` bleibt `in stock` / `out of stock`.

---

## Reihenfolge & Bestätigung

Ich starte mit **Schritt 1 (Benutzerverwaltung)**. Sag Bescheid, wenn ich gleich alle 4 Schritte nacheinander in einem Rutsch ausrollen soll, oder ob du nach jedem Schritt testen willst.
