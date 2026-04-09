
Ziel: Das mobile Layout der Produktdarstellung aus deinem Screenshot soll luftiger wirken, und Preiszeilen dürfen nicht mehr unschön umbrechen.

Was ich gefunden habe:
- Das Problem aus dem Screenshot sitzt nicht in der normalen `ProductCard`, sondern in der Angebots-/Deal-Karte auf der Startseite in `src/pages/Index.tsx`.
- Dort stehen auf Mobile aktuell:
  - aktueller Preis
  - alter Preis
  - „Du sparst …“
  in einer einzigen horizontalen Zeile.
- In genau diesem Bereich wird das Layout zu eng, dadurch wirkt die Karte gequetscht und das `€` bzw. die Preisinfos brechen unsauber um.
- Zusätzlich formatiert `Index.tsx` Preise dort noch manuell mit `" €"` statt mit geschütztem Leerzeichen.

Umsetzungsplan:
1. Startseiten-Deal-Karte mobil neu strukturieren
- Den Preisbereich in `src/pages/Index.tsx` für kleine Screens von einer Zeile auf einen vertikalen bzw. 2-stufigen Aufbau umbauen.
- Mobile Zielstruktur:
```text
180,00 €
UVP 249,00 €
Du sparst 69,00 €
Jetzt ansehen →
```
- Ab `sm`/`md` kann das Layout wieder kompakter nebeneinander laufen, falls es optisch passt.

2. Preisformatierung vereinheitlichen
- In `src/pages/Index.tsx` eine konsistente `formatPrice()`-Logik mit `\u00A0€` verwenden.
- Damit bleiben Zahl und Eurozeichen immer zusammen.
- Das gilt für:
  - Hero-Produkt oben
  - Deal-Highlight
  - alle Savings-/UVP-Anzeigen in diesem File

3. Mobile Abstände luftiger machen
- Im betroffenen Deal-Block auf Mobile mehr vertikale Luft geben:
  - größere Abstände zwischen Titel, Beschreibung, Preisblock und CTA
  - Preisinfos nicht mehr „zusammenpressen“
- Falls nötig die Beschreibung auf Mobile etwas kontrollierter clampen bzw. mit besserer Zeilenhöhe darstellen, damit die Karte ruhiger wirkt.

4. Text- und Preisbruch absichern
- `whitespace-nowrap` für einzelne Preiswerte einsetzen.
- „Du sparst“ samt Betrag so umbauen, dass der Betrag nicht vom `€` getrennt wird.
- Alte Preise mit Strich ebenfalls gegen unschöne Umbrüche absichern.

5. Kurzer Mobile-Sweep über ähnliche Shop-Bereiche
- Nach dem Fix auch die weiteren öffentlichen Produktflächen auf dieselbe Art prüfen:
  - Startseite Hero-Produkt
  - Startseite Highlights
  - Shop-Grid
  - Produktdetailseite verwandte Produkte
- Nur dort nachziehen, wo noch manuelle `" €"`-Ausgaben oder gequetschte Preisreihen vorkommen.

Technische Details:
- Betroffene Hauptdatei: `src/pages/Index.tsx`
- Bereits teilweise korrekt: `src/components/marketplace/ProductCard.tsx` und `src/pages/ProductDetailPage.tsx` nutzen schon eine `formatPrice()`-Logik mit geschütztem Leerzeichen.
- Keine Backend-, Datenbank- oder Auth-Änderungen nötig.
- Fokus ist rein auf responsive Layout, Typografie und Preisdarstellung.

Ergebnis nach Umsetzung:
- Das `€` bricht nicht mehr ab.
- Preis, UVP und Ersparnis wirken auf Mobile geordnet statt gequetscht.
- Die Angebotskarte bekommt mehr „Luft“ und liest sich hochwertiger.
- Vergleichbare Preisstellen auf der Storefront sind visuell konsistent.
