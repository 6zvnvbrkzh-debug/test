import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "holiday-notice-2026-summer-dismissed";

export function HolidayNoticeModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="holiday-notice-title"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/40 bg-card/70 backdrop-blur-2xl shadow-2xl"
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

            <button
              onClick={close}
              aria-label="Schließen"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-mono-data uppercase tracking-widest text-primary mb-4">
                <Sun className="h-3.5 w-3.5" />
                Betriebsferien
              </div>

              <h2
                id="holiday-notice-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4"
              >
                Barbato Electronics macht Urlaub ☀️🌴
              </h2>

              <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                <p>
                  Liebe Kundinnen und Kunden, wir machen Urlaub. Der Shop bleibt
                  aber <span className="text-foreground font-medium">geöffnet</span> – ihr
                  könnt weiterhin ganz normal bestellen.
                </p>

                <div className="rounded-xl border border-border/40 bg-background/40 backdrop-blur-md p-4">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm mb-2">
                    <Package className="h-4 w-4 text-primary" />
                    Wichtige Information zum Versand
                  </div>
                  <p className="text-sm">
                    Der letzte Versandtag vor unseren Betriebsferien ist der{" "}
                    <span className="text-foreground font-mono-data whitespace-nowrap">
                      22.07.2026
                    </span>
                    . Alle bis dahin versandfertigen Bestellungen werden noch verschickt.
                  </p>
                  <p className="text-sm mt-2">
                    Bestellungen vom{" "}
                    <span className="text-foreground font-mono-data whitespace-nowrap">
                      23.07.2026
                    </span>{" "}
                    bis{" "}
                    <span className="text-foreground font-mono-data whitespace-nowrap">
                      15.08.2026
                    </span>{" "}
                    werden gesammelt und ab dem{" "}
                    <span className="text-foreground font-mono-data whitespace-nowrap">
                      16.08.2026
                    </span>{" "}
                    schnellstmöglich versendet.
                  </p>
                </div>

                <p className="text-xs">
                  Vielen Dank für euer Verständnis und eure Unterstützung.
                  <br />
                  Euer <span className="text-foreground font-medium">Barbato Electronics</span> Team 🔧💙
                </p>
              </div>

              <Button onClick={close} className="w-full mt-6" size="lg">
                Verstanden
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
