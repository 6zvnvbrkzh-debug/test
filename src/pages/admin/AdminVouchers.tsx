import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2, Eye, Ticket, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { de } from "date-fns/locale";

interface Voucher {
  id: string;
  code: string;
  initial_amount: number;
  balance: number;
  currency: string;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
  note: string | null;
  created_at: string;
}

interface Redemption {
  id: string;
  amount_used: number;
  customer_email: string | null;
  stripe_session_id: string | null;
  order_id: string | null;
  created_at: string;
}

const fmtEUR = (n: number) => `${Number(n).toFixed(2).replace(".", ",")}\u00A0€`;
const fmtDate = (s: string | null) =>
  s ? format(new Date(s), "dd.MM.yyyy", { locale: de }) : "—";

function randomCode(len = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out.replace(/(.{4})/g, "$1-").replace(/-$/, "");
}

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewVoucher, setViewVoucher] = useState<Voucher | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [redLoading, setRedLoading] = useState(false);

  // create form
  const [fCode, setFCode] = useState("");
  const [fAmount, setFAmount] = useState("");
  const [fValidUntil, setFValidUntil] = useState("");
  const [fNote, setFNote] = useState("");
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Fehler beim Laden: " + error.message);
    } else {
      setVouchers((data ?? []) as Voucher[]);
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const stats = useMemo(() => {
    const active = vouchers.filter((v) => v.is_active).length;
    const issued = vouchers.reduce((s, v) => s + Number(v.initial_amount), 0);
    const remaining = vouchers.reduce((s, v) => s + Number(v.balance), 0);
    return { count: vouchers.length, active, issued, remaining, used: issued - remaining };
  }, [vouchers]);

  const handleCreate = async () => {
    const amount = Number(fAmount.replace(",", "."));
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Bitte einen gültigen Betrag eingeben.");
      return;
    }
    const code = (fCode.trim() || randomCode()).toUpperCase();

    setCreating(true);
    const { error } = await supabase.from("vouchers").insert({
      code,
      initial_amount: amount,
      balance: amount,
      valid_until: fValidUntil ? new Date(fValidUntil).toISOString() : null,
      note: fNote.trim() || null,
      is_active: true,
    });
    setCreating(false);

    if (error) {
      toast.error(error.message.includes("unique") ? "Code existiert bereits." : "Fehler: " + error.message);
      return;
    }
    toast.success(`Gutschein ${code} erstellt`);
    setCreateOpen(false);
    setFCode(""); setFAmount(""); setFValidUntil(""); setFNote("");
    void load();
  };

  const toggleActive = async (v: Voucher) => {
    const { error } = await supabase
      .from("vouchers")
      .update({ is_active: !v.is_active })
      .eq("id", v.id);
    if (error) { toast.error(error.message); return; }
    setVouchers((prev) => prev.map((x) => x.id === v.id ? { ...x, is_active: !v.is_active } : x));
  };

  const handleDelete = async (v: Voucher) => {
    if (!confirm(`Gutschein ${v.code} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) return;
    const { error } = await supabase.from("vouchers").delete().eq("id", v.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Gelöscht");
    setVouchers((prev) => prev.filter((x) => x.id !== v.id));
  };

  const openDetails = async (v: Voucher) => {
    setViewVoucher(v);
    setRedLoading(true);
    const { data, error } = await supabase
      .from("voucher_redemptions")
      .select("*")
      .eq("voucher_id", v.id)
      .order("created_at", { ascending: false });
    if (!error) setRedemptions((data ?? []) as Redemption[]);
    setRedLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="h-6 w-6" /> Gutscheine
          </h1>
          <p className="text-sm text-muted-foreground">
            Geschenkgutscheine mit Restguthaben verwalten.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="h-4 w-4 mr-1.5" /> Aktualisieren
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Neuer Gutschein</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Neuen Gutschein erstellen</DialogTitle>
                <DialogDescription>
                  Lass den Code leer, um automatisch einen sicheren Code zu generieren.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="v-code">Code (optional)</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="v-code"
                      value={fCode}
                      onChange={(e) => setFCode(e.target.value.toUpperCase())}
                      placeholder="z.B. WEIHNACHTEN-2026"
                      className="font-mono-data"
                      maxLength={64}
                    />
                    <Button type="button" variant="outline" onClick={() => setFCode(randomCode())}>
                      Generieren
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="v-amount">Betrag (€) *</Label>
                  <Input
                    id="v-amount"
                    type="text"
                    inputMode="decimal"
                    value={fAmount}
                    onChange={(e) => setFAmount(e.target.value)}
                    placeholder="z.B. 50,00"
                    className="mt-1.5 font-mono-data"
                  />
                </div>
                <div>
                  <Label htmlFor="v-valid">Gültig bis (optional)</Label>
                  <Input
                    id="v-valid"
                    type="date"
                    value={fValidUntil}
                    onChange={(e) => setFValidUntil(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="v-note">Interne Notiz</Label>
                  <Textarea
                    id="v-note"
                    value={fNote}
                    onChange={(e) => setFNote(e.target.value)}
                    placeholder="z.B. Geschenk für Max Mustermann"
                    rows={2}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Abbrechen</Button>
                <Button onClick={handleCreate} disabled={creating}>
                  {creating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Erstellen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Gutscheine" value={stats.count.toString()} />
        <StatCard label="Aktiv" value={stats.active.toString()} />
        <StatCard label="Ausgegeben" value={fmtEUR(stats.issued)} />
        <StatCard label="Restguthaben" value={fmtEUR(stats.remaining)} />
      </div>

      <div className="border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Noch keine Gutscheine. Erstelle den ersten oben rechts.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Wert</TableHead>
                <TableHead className="text-right">Restguthaben</TableHead>
                <TableHead>Gültig bis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-mono-data font-semibold">{v.code}</TableCell>
                  <TableCell className="text-right font-mono-data whitespace-nowrap">{fmtEUR(v.initial_amount)}</TableCell>
                  <TableCell className="text-right font-mono-data whitespace-nowrap">
                    <span className={Number(v.balance) === 0 ? "text-muted-foreground" : ""}>
                      {fmtEUR(v.balance)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{fmtDate(v.valid_until)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={v.is_active} onCheckedChange={() => toggleActive(v)} />
                      {Number(v.balance) === 0 ? (
                        <Badge variant="secondary">Leer</Badge>
                      ) : v.is_active ? (
                        <Badge variant="default">Aktiv</Badge>
                      ) : (
                        <Badge variant="outline">Inaktiv</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openDetails(v)} aria-label="Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(v)} aria-label="Löschen">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!viewVoucher} onOpenChange={(o) => !o && setViewVoucher(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono-data">{viewVoucher?.code}</DialogTitle>
            <DialogDescription>
              Wert {viewVoucher && fmtEUR(viewVoucher.initial_amount)} ·
              Restguthaben {viewVoucher && fmtEUR(viewVoucher.balance)} ·
              Erstellt {viewVoucher && fmtDate(viewVoucher.created_at)}
            </DialogDescription>
          </DialogHeader>
          {viewVoucher?.note && (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
              {viewVoucher.note}
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold mb-2">Einlösungs-Historie</h4>
            {redLoading ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : redemptions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Noch keine Einlösungen.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Datum</TableHead>
                    <TableHead>Kunde</TableHead>
                    <TableHead className="text-right">Betrag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-sm">{format(new Date(r.created_at), "dd.MM.yyyy HH:mm", { locale: de })}</TableCell>
                      <TableCell className="text-sm">{r.customer_email || "—"}</TableCell>
                      <TableCell className="text-right font-mono-data whitespace-nowrap">−{fmtEUR(r.amount_used)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-1 font-mono-data whitespace-nowrap">{value}</p>
    </div>
  );
}
