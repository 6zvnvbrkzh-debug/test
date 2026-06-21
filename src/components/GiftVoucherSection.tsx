import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AMOUNTS = [10, 25, 50, 100] as const;

const ACCENTS: Record<number, { ring: string; chip: string; glow: string }> = {
  10: {
    ring: "border-border/50 hover:border-primary/50",
    chip: "bg-primary/10 text-primary",
    glow: "from-primary/10 to-transparent",
  },
  25: {
    ring: "border-border/50 hover:border-primary/60",
    chip: "bg-primary/15 text-primary",
    glow: "from-primary/15 to-transparent",
  },
  50: {
    ring: "border-primary/40 hover:border-primary/70",
    chip: "bg-primary/20 text-primary",
    glow: "from-primary/25 to-transparent",
  },
  100: {
    ring: "border-primary/60 hover:border-primary",
    chip: "bg-primary text-primary-foreground",
    glow: "from-primary/35 to-transparent",
  },
};

export function GiftVoucherSection() {
  const [loading, setLoading] = useState<number | null>(null);

  const buy = async (amount: number) => {
    setLoading(amount);
    try {
      const { data, error } = await supabase.functions.invoke("purchase-voucher", {
        body: { amount },
      });
      if (error) throw error;
      if (!data?.url) throw new Error("Keine Checkout-URL erhalten.");
      window.location.href = data.url as string;
    } catch (e) {
      console.error(e);
      toast({
        title: "Gutschein-Kauf fehlgeschlagen",
        description: (e as Error).message || "Bitte versuche es erneut.",
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  return (
    <section className="container py-12 md:py-24">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-7 md:mb-14">
        <div>
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono-data uppercase tracking-[0.25em] text-primary/80 mb-2 md:mb-3">
            <span className="h-px w-6 md:w-8 bg-primary/60" />
            02.5 — Geschenkgutscheine
          </div>
          <h2 className="text-display text-3xl md:text-6xl tracking-tight">
            Verschenke <span className="text-stroke">Streaming-Power</span>
          </h2>
          <p className="mt-3 md:mt-5 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
            Sofort einlösbar im Shop. Aufladbar, ohne Ablaufdatum. Perfekt für Geburtstage, Weihnachten oder einfach so.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-mono-data uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Code per E-Mail · Sofort verfügbar
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {AMOUNTS.map((amount, i) => {
          const a = ACCENTS[amount];
          const isLoading = loading === amount;
          const featured = amount === 50;
          return (
            <motion.div
              key={amount}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative rounded-2xl border ${a.ring} bg-card overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.35)] flex flex-col`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${a.glow} pointer-events-none opacity-60`} />

              {featured && (
                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-semibold uppercase tracking-wider">
                  Beliebt
                </div>
              )}

              <div className="relative p-5 md:p-7 flex-1 flex flex-col">
                <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl ${a.chip} mb-5`}>
                  <Gift className="h-5 w-5" strokeWidth={2} />
                </div>

                <div className="font-mono-data text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 mb-2">
                  Geschenkgutschein
                </div>

                <div className="font-mono-data text-4xl md:text-5xl font-bold tracking-tight whitespace-nowrap mb-1">
                  {amount}
                  <span className="text-2xl md:text-3xl text-primary">{"\u00A0€"}</span>
                </div>

                <p className="text-xs text-muted-foreground mt-auto pt-5">
                  Digital · Sofort einlösbar · Übertragbar
                </p>

                <Button
                  onClick={() => buy(amount)}
                  disabled={isLoading || loading !== null}
                  size="lg"
                  variant={featured ? "default" : "outline"}
                  className="mt-5 w-full press-scale transition-signal font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Weiter zu Stripe…
                    </>
                  ) : (
                    <>Jetzt kaufen</>
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
