import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "admin-email-alert-threshold-minutes";
const DEFAULT_THRESHOLD = 60;

function formatRelative(date: Date | null): string {
  if (!date) return "noch nie";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "gerade eben";
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std. ${mins % 60} Min.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag${days === 1 ? "" : "en"}`;
}

export function EmailQueueAlert() {
  const [threshold, setThreshold] = useState<number>(() => {
    if (typeof window === "undefined") return DEFAULT_THRESHOLD;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const n = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_THRESHOLD;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(threshold));
  }, [threshold]);

  const { data, isLoading } = useQuery({
    queryKey: ["email-queue-alert"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("email_send_log")
        .select("created_at, status")
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      const latest = data?.[0]?.created_at ? new Date(data[0].created_at) : null;
      return { latest };
    },
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  const latest = data?.latest ?? null;
  const diffMinutes = latest ? Math.floor((Date.now() - latest.getTime()) / 60000) : Infinity;
  const isStale = diffMinutes >= threshold;

  return (
    <Card
      className={cn(
        "border-l-4 transition-colors",
        isLoading
          ? "border-l-muted-foreground/30"
          : isStale
            ? "border-l-destructive bg-destructive/5"
            : "border-l-green-600 bg-green-50/40 dark:bg-green-950/20",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 gap-4">
        <div className="flex items-center gap-2">
          {isStale ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          )}
          <CardTitle className="text-sm font-medium">E-Mail-Versand</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="email-alert-threshold" className="text-xs text-muted-foreground whitespace-nowrap">
            Alarm nach
          </Label>
          <Input
            id="email-alert-threshold"
            type="number"
            min={1}
            max={10080}
            value={threshold}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (Number.isFinite(n) && n > 0) setThreshold(n);
            }}
            className="h-8 w-20"
          />
          <span className="text-xs text-muted-foreground">Min.</span>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Lade Status…</p>
        ) : isStale ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-destructive">
              ⚠️ Seit {diffMinutes === Infinity ? "unbekannt langer Zeit" : `${diffMinutes} Min.`} keine E-Mail verschickt
            </p>
            <p className="text-xs text-muted-foreground">
              Schwelle: {threshold} Min. · Letzte Mail: {formatRelative(latest)}
            </p>
            <p className="text-xs text-muted-foreground">
              Prüfe die Edge Functions und die Mail-Queue – möglicherweise werden Bestell- oder Versandbestätigungen nicht ausgelöst.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>
              Letzte E-Mail {formatRelative(latest)}
              <span className="text-muted-foreground"> · Schwelle {threshold} Min.</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
