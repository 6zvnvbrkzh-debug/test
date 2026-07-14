/**
 * Betriebsferien / Versand-Pause
 *
 * Shop bleibt geöffnet – Bestellungen sind möglich. Innerhalb des Zeitraums
 * werden Kund:innen aber deutlich darauf hingewiesen, dass der Versand erst
 * ab dem 16.08.2026 wieder erfolgt.
 *
 * Feste Berlin-Zeit (CEST, UTC+2), unabhängig von der Zeitzone des Besuchers.
 */
export const SHIPPING_PAUSE = {
  active: true,
  start: new Date("2026-07-23T00:00:00+02:00").getTime(),
  end: new Date("2026-08-15T23:59:59+02:00").getTime(),
  reopenLabel: "16.08.2026",
  message:
    "Wir befinden uns aktuell in den Betriebsferien. Bestellungen sind weiterhin möglich – der Versand erfolgt jedoch erst ab dem 16.08.2026.",
};

export function isShippingDelayed(now: number = Date.now()): boolean {
  if (!SHIPPING_PAUSE.active) return false;
  return now >= SHIPPING_PAUSE.start && now <= SHIPPING_PAUSE.end;
}

/**
 * Legacy-Kompatibilität: Shop ist NICHT mehr geschlossen. Alte Aufrufer
 * erhalten immer `false`, sodass Käufe uneingeschränkt möglich bleiben.
 */
export const SHOP_CLOSURE = {
  active: false,
  start: SHIPPING_PAUSE.start,
  end: SHIPPING_PAUSE.end,
  reopenLabel: SHIPPING_PAUSE.reopenLabel,
  message: SHIPPING_PAUSE.message,
};

export function isShopClosed(_now: number = Date.now()): boolean {
  return false;
}
