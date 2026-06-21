import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const fmtEUR = (n: number) =>
  `${Number(n).toFixed(2).replace(".", ",")}\u00A0€`;

export function MyVouchers({ userId }: { userId: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const { data: vouchers = [], isLoading } = useQuery({
    queryKey: ["my-vouchers", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vouchers")
        .select("id, code, balance, initial_amount, is_active, valid_until, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      toast.success("Code kopiert");
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Kopieren fehlgeschlagen");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (vouchers.length === 0) {
    return (
      <div className="text-center py-10 rounded-xl border border-border/40 bg-card">
        <Ticket className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">Du hast noch keine Gutscheine</p>
        <p className="text-xs text-muted-foreground mt-1">
          Eingelöste Gutscheine mit Restguthaben erscheinen hier automatisch.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vouchers.map((v) => {
        const balance = Number(v.balance);
        const initial = Number(v.initial_amount);
        const expired = v.valid_until && new Date(v.valid_until).getTime() < Date.now();
        const usable = v.is_active && balance > 0 && !expired;
        return (
          <div
            key={v.id}
            className="rounded-xl border border-border/40 bg-card p-4 flex items-center gap-4"
          >
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${usable ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
              <Ticket className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="font-mono-data text-sm font-semibold tracking-wide truncate">
                  {v.code}
                </code>
                <button
                  onClick={() => copyCode(v.code)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Code kopieren"
                >
                  {copied === v.code ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Erstellt {format(new Date(v.created_at), "dd. MMM yyyy", { locale: de })}
                {v.valid_until && (
                  <> · Gültig bis {format(new Date(v.valid_until), "dd. MMM yyyy", { locale: de })}</>
                )}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-base font-bold whitespace-nowrap ${usable ? "" : "text-muted-foreground line-through"}`}>
                {fmtEUR(balance)}
              </p>
              {initial > balance && (
                <p className="text-[10px] text-muted-foreground whitespace-nowrap">
                  von {fmtEUR(initial)}
                </p>
              )}
              {!usable && (
                <p className="text-[10px] text-muted-foreground">
                  {expired ? "Abgelaufen" : !v.is_active ? "Inaktiv" : "Aufgebraucht"}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
