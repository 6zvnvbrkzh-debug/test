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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Loader2, Plus, Trash2, Eye, Ticket, RefreshCw, Search, User as UserIcon,
  Pencil, Copy, CheckCircle2,
} from "lucide-react";
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
  user_id: string | null;
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

type StatusFilter = "all" | "active" | "inactive" | "empty" | "expired" | "assigned" | "unassigned";

export default function AdminVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [profileMap, setProfileMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewVoucher, setViewVoucher] = useState<Voucher | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [redLoading, setRedLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [copied, setCopied] = useState<string | null>(null);

  // create form
  const [fCode, setFCode] = useState("");
  const [fAmount, setFAmount] = useState("");
  const [fValidUntil, setFValidUntil] = useState("");
  const [fNote, setFNote] = useState("");
  const [creating, setCreating] = useState(false);

  // adjust balance form
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustVoucher, setAdjustVoucher] = useState<Voucher | null>(null);
  const [adjustBalance, setAdjustBalance] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Fehler beim Laden: " + error.message);
      setLoading(false);
      return;
    }
    const vs = (data ?? []) as Voucher[];
    setVouchers(vs);

    // Resolve profiles for bound user_ids
    const ids = Array.from(new Set(vs.map((v) => v.user_id).filter(Boolean) as string[]));
    if (ids.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", ids);
      const map: Record<string, string> = {};
      (profs ?? []).forEach((p: any) => {
        map[p.user_id] = p.display_name || p.user_id.slice(0, 8);
      });
      setProfileMap(map);
    } else {
      setProfileMap({});
    }
    setLoading(false);
  };

  useEffect(() => { void load(); }, []);

  const stats = useMemo(() => {
    const active = vouchers.filter((v) => v.is_active).length;
    const assigned = vouchers.filter((v) => v.user_id).length;
    const issued = vouchers.reduce((s, v) => s + Number(v.initial_amount), 0);
    const remaining = vouchers.reduce((s, v) => s + Number(v.balance), 0);
    return { count: vouchers.length, active, assigned, issued, remaining, used: issued - remaining };
  }, [vouchers]);

  const filteredVouchers = useMemo(() => {
    const q = search.trim().toUpperCase();
    const now = Date.now();
    return vouchers.filter((v) => {
      if (q) {
        const display = profileMap[v.user_id ?? ""] ?? "";
        const matches =
          v.code.toUpperCase().includes(q) ||
          (v.note ?? "").toUpperCase().includes(q) ||
          display.toUpperCase().includes(q);
        if (!matches) return false;
      }
      const expired = v.valid_until && new Date(v.valid_until).getTime() < now;
      switch (statusFilter) {
        case "active": return v.is_active && Number(v.balance) > 0 && !expired;
        case "inactive": return !v.is_active;
        case "empty": return Number(v.balance) === 0;
        case "expired": return Boolean(expired);
        case "assigned": return Boolean(v.user_id);
        case "unassigned": return !v.user_id;
        default: return true;
      }
    });
  }, [vouchers, search, statusFilter, profileMap]);

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

  const unbindUser = async (v: Voucher) => {
    if (!confirm(`Konto-Zuordnung für ${v.code} entfernen? Der Gutschein wird wieder frei einlösbar.`)) return;
    const { error } = await supabase.from("vouchers").update({ user_id: null }).eq("id", v.id);
    if (error) { toast.error(error.message); return; }
    toast.success("Zuordnung entfernt");
    setVouchers((prev) => prev.map((x) => x.id === v.id ? { ...x, user_id: null } : x));
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

  const openAdjust = (v: Voucher) => {
    setAdjustVoucher(v);
    setAdjustBalance(String(v.balance).replace(".", ","));
    setAdjustReason("");
    setAdjustOpen(true);
  };

  const handleAdjust = async () => {
    if (!adjustVoucher) return;
    const newBal = Number(adjustBalance.replace(",", "."));
    if (!Number.isFinite(newBal) || newBal < 0) {
      toast.error("Bitte einen gültigen Betrag eingeben.");
      return;
    }
    setAdjusting(true);
    const newNote = adjustReason.trim()
      ? `${adjustVoucher.note ? adjustVoucher.note + "\n" : ""}[${format(new Date(), "dd.MM.yyyy HH:mm", { locale: de })}] Admin-Korrektur ${fmtEUR(adjustVoucher.balance)} → ${fmtEUR(newBal)}: ${adjustReason.trim()}`
      : adjustVoucher.note;
    const { error } = await supabase
      .from("vouchers")
      .update({ balance: newBal, note: newNote })
      .eq("id", adjustVoucher.id);
    setAdjusting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Guthaben aktualisiert");
    setAdjustOpen(false);
    setVouchers((prev) =>
      prev.map((x) => x.id === adjustVoucher.id ? { ...x, balance: newBal, note: newNote ?? null } : x)
    );
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied(null), 1200);
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ticket className="h-6 w-6" /> Gutscheine
          </h1>
          <p className="text-sm text-muted-foreground">
            Geschenkgutscheine mit Restguthaben verwalten – Suche, Filter, Konto-Zuordnung und manuelle Korrekturen.
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Gutscheine" value={stats.count.toString()} />
        <StatCard label="Aktiv" value={stats.active.toString()} />
        <StatCard label="Konto-gebunden" value={stats.assigned.toString()} />
        <StatCard label="Eingelöst" value={fmtEUR(stats.used)} />
        <StatCard label="Restguthaben" value={fmtEUR(stats.remaining)} />
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suche nach Code, Notiz oder Kunde…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle ({vouchers.length})</SelectItem>
            <SelectItem value="active">Nur aktiv</SelectItem>
            <SelectItem value="inactive">Nur inaktiv</SelectItem>
            <SelectItem value="empty">Aufgebraucht</SelectItem>
            <SelectItem value="expired">Abgelaufen</SelectItem>
            <SelectItem value="assigned">Konto-gebunden</SelectItem>
            <SelectItem value="unassigned">Ohne Konto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {vouchers.length === 0
              ? "Noch keine Gutscheine. Erstelle den ersten oben rechts."
              : "Keine Treffer für diesen Filter."}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Wert</TableHead>
                <TableHead className="text-right">Eingelöst</TableHead>
                <TableHead className="text-right">Rest</TableHead>
                <TableHead>Konto</TableHead>
                <TableHead>Gültig bis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVouchers.map((v) => {
                const used = Number(v.initial_amount) - Number(v.balance);
                const expired = v.valid_until && new Date(v.valid_until).getTime() < Date.now();
                const empty = Number(v.balance) === 0;
                return (
                  <TableRow key={v.id}>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono-data font-semibold">{v.code}</span>
                        <button
                          onClick={() => copyCode(v.code)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Code kopieren"
                        >
                          {copied === v.code
                            ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      {v.note && (
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5 max-w-[240px]">
                          {v.note}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono-data whitespace-nowrap">{fmtEUR(v.initial_amount)}</TableCell>
                    <TableCell className="text-right font-mono-data whitespace-nowrap text-muted-foreground">
                      {used > 0 ? `−${fmtEUR(used)}` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono-data whitespace-nowrap">
                      <span className={empty ? "text-muted-foreground" : "font-semibold"}>
                        {fmtEUR(v.balance)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {v.user_id ? (
                        <button
                          onClick={() => unbindUser(v)}
                          className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title="Klicken um Zuordnung zu entfernen"
                        >
                          <UserIcon className="h-3 w-3" />
                          <span className="max-w-[110px] truncate">
                            {profileMap[v.user_id] || v.user_id.slice(0, 8)}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">— frei —</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {expired ? (
                        <span className="text-destructive">{fmtDate(v.valid_until)}</span>
                      ) : (
                        fmtDate(v.valid_until)
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={v.is_active} onCheckedChange={() => toggleActive(v)} />
                        {empty ? (
                          <Badge variant="secondary">Leer</Badge>
                        ) : expired ? (
                          <Badge variant="destructive">Abgelaufen</Badge>
                        ) : v.is_active ? (
                          <Badge variant="default">Aktiv</Badge>
                        ) : (
                          <Badge variant="outline">Inaktiv</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openAdjust(v)} aria-label="Guthaben anpassen" title="Guthaben anpassen">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDetails(v)} aria-label="Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(v)} aria-label="Löschen">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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
              {viewVoucher?.user_id && (
                <> · Konto: <strong>{profileMap[viewVoucher.user_id] || viewVoucher.user_id.slice(0, 8)}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          {viewVoucher?.note && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3 whitespace-pre-wrap">
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
                    <TableHead>Bestellung</TableHead>
                    <TableHead className="text-right">Betrag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {format(new Date(r.created_at), "dd.MM.yyyy HH:mm", { locale: de })}
                      </TableCell>
                      <TableCell className="text-sm">{r.customer_email || "—"}</TableCell>
                      <TableCell className="text-xs font-mono-data text-muted-foreground">
                        {r.order_id ? r.order_id.slice(0, 8) : "—"}
                      </TableCell>
                      <TableCell className="text-right font-mono-data whitespace-nowrap">
                        −{fmtEUR(r.amount_used)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guthaben anpassen</DialogTitle>
            <DialogDescription>
              <span className="font-mono-data">{adjustVoucher?.code}</span> – aktuelles Guthaben{" "}
              <strong>{adjustVoucher && fmtEUR(adjustVoucher.balance)}</strong>.
              Manuelle Korrekturen werden mit Grund in der Notiz protokolliert.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="adj-balance">Neues Guthaben (€)</Label>
              <Input
                id="adj-balance"
                inputMode="decimal"
                value={adjustBalance}
                onChange={(e) => setAdjustBalance(e.target.value)}
                className="mt-1.5 font-mono-data"
              />
            </div>
            <div>
              <Label htmlFor="adj-reason">Grund</Label>
              <Textarea
                id="adj-reason"
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                placeholder="z.B. Kulanz nach Beschwerde Ticket #1234"
                rows={2}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>Abbrechen</Button>
            <Button onClick={handleAdjust} disabled={adjusting}>
              {adjusting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Speichern
            </Button>
          </DialogFooter>
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
