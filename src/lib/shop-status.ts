/**
 * Betriebsferien / Shop-Schließung
 *
 * Zeitraum inkl. Start- und Endtag. Alle Käufe/Warenkorb-Aktionen sind in
 * diesem Zeitraum deaktiviert. Nach `end` (23:59:59) wird der Shop automatisch
 * wieder geöffnet.
 */
export const SHOP_CLOSURE = {
  active: true,
  // Lokale Zeit (Europe/Berlin) – ISO ohne Zeitzone reicht, wir vergleichen mit Date.now()
  start: new Date("2026-07-23T00:00:00").getTime(),
  end: new Date("2026-08-15T23:59:59").getTime(),
  reopenLabel: "16.08.2026",
  message:
    "Wir befinden uns aktuell in den Betriebsferien. Bestellungen sind vom 23.07. bis einschließlich 15.08.2026 nicht möglich. Ab dem 16.08.2026 sind wir wieder für dich da.",
};

export function isShopClosed(now: number = Date.now()): boolean {
  if (!SHOP_CLOSURE.active) return false;
  return now >= SHOP_CLOSURE.start && now <= SHOP_CLOSURE.end;
}
