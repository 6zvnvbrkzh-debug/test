import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, Package, CreditCard, User, Calendar, Hash, Truck, Save, MapPin, Mail, Download, Archive, ArchiveRestore } from "lucide-react";
import { toast } from "sonner";
import { InvoiceButton } from "@/components/InvoiceButton";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "Ausstehend", variant: "outline" },
  SHIPPED: { label: "Versendet", variant: "secondary" },
  COMPLETED: { label: "Abgeschlossen", variant: "default" },
  REFUNDED: { label: "Erstattet", variant: "destructive" },
  ARCHIVED: { label: "Archiviert", variant: "outline" },
};

interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  postal_code?: string;
  state?: string;
  country?: string;
}

interface OrderDetail {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  stripe_session_id: string | null;
  tracking_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  shipping_address: ShippingAddress | null;
  invoice_number: string | null;
  listings: { title: string; price: number; images: string[] | null } | null;
}

interface GroupedOrderItem {
  listing_id: string;
  title: string;
  price: number;
  image: string | null;
  quantity: number;
  order_ids: string[];
}

interface GroupedOrder {
  groupKey: string;
  primary: OrderDetail;
  allIds: string[];
  totalAmount: number;
  items: GroupedOrderItem[];
  itemCount: number;
}

function groupOrders(rows: OrderDetail[]): GroupedOrder[] {
  const map = new Map<string, GroupedOrder>();
  for (const o of rows) {
    const key = o.stripe_session_id || `single-${o.id}`;
    let g = map.get(key);
    if (!g) {
      g = {
        groupKey: key,
        primary: o,
        allIds: [],
        totalAmount: 0,
        items: [],
        itemCount: 0,
      };
      map.set(key, g);
    }
    // Use earliest created_at as primary
    if (new Date(o.created_at).getTime() < new Date(g.primary.created_at).getTime()) {
      g.primary = o;
    }
    g.allIds.push(o.id);
    g.totalAmount += Number(o.amount);
    g.itemCount += 1;
    const existing = g.items.find((i) => i.listing_id === o.listing_id);
    if (existing) {
      existing.quantity += 1;
      existing.order_ids.push(o.id);
    } else {
      g.items.push({
        listing_id: o.listing_id,
        title: o.listings?.title || "Gelöschtes Produkt",
        price: Number(o.listings?.price ?? o.amount),
        image: o.listings?.images?.[0] ?? null,
        quantity: 1,
        order_ids: [o.id],
      });
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.primary.created_at).getTime() - new Date(a.primary.created_at).getTime()
  );
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState<GroupedOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, listings(title, price, images)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as any[]).map((o) => ({
        ...o,
        customer_name: o.customer_name ?? null,
        customer_email: o.customer_email ?? null,
        shipping_address: o.shipping_address ?? null,
      })) as OrderDetail[];
    },
  });

  const trackingMutation = useMutation({
    mutationFn: async ({
      orderIds,
      trackingNumber,
      group,
    }: {
      orderIds: string[];
      trackingNumber: string;
      group: GroupedOrder;
    }) => {
      const trimmed = trackingNumber.trim();
      const { error } = await supabase
        .from("orders")
        .update({ tracking_number: trimmed || null } as any)
        .in("id", orderIds);
      if (error) throw error;

      // "Versandetikett erstellt"-Mail an Kunden – nur EINE pro Gruppe
      const previous = (group.primary.tracking_number || "").trim();
      const customerEmail = group.primary.customer_email;
      if (trimmed && trimmed !== previous && customerEmail) {
        try {
          const productTitle =
            group.items.length === 1
              ? group.items[0].title
              : group.items.map((i) => `${i.quantity}× ${i.title}`).join(", ");
          await supabase.functions.invoke("admin-send-shipping-confirmation", {
            body: {
              templateName: "tracking-created",
              recipientEmail: customerEmail,
              idempotencyKey: `tracking-${group.groupKey}-${trimmed}`,
              templateData: {
                customerName: group.primary.customer_name ?? "",
                orderId: group.primary.id,
                trackingNumber: trimmed,
                productTitle,
              },
            },
          });
        } catch (e) {
          console.error("Sendungsnummer-Mail konnte nicht gesendet werden", e);
        }
      }

      return { sentEmail: !!(trimmed && trimmed !== previous && customerEmail) };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success(
        result?.sentEmail
          ? "Sendungsnummer gespeichert · Kunde wurde über das erstellte Versandetikett informiert"
          : "Sendungsnummer gespeichert!"
      );
    },
    onError: (err: any) => toast.error(err.message || "Fehler beim Speichern"),
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      orderIds,
      status,
      group,
    }: {
      orderIds: string[];
      status: string;
      group?: GroupedOrder;
    }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status } as any)
        .in("id", orderIds);
      if (error) throw error;

      // Auto-Versandbestätigung beim Wechsel auf SHIPPED
      let emailResult: "sent" | "missing-tracking" | "no-email" | "skipped" = "skipped";
      if (status === "SHIPPED" && group) {
        const tracking = (group.primary.tracking_number || "").trim();
        const customerEmail = group.primary.customer_email;
        if (!tracking) {
          emailResult = "missing-tracking";
        } else if (!customerEmail) {
          emailResult = "no-email";
        } else {
          try {
            const productTitle =
              group.items.length === 1
                ? group.items[0].title
                : group.items.map((i) => `${i.quantity}× ${i.title}`).join(", ");
            await supabase.functions.invoke("admin-send-shipping-confirmation", {
              body: {
                recipientEmail: customerEmail,
                idempotencyKey: `shipping-${group.groupKey}-${tracking}`,
                templateData: {
                  customerName: group.primary.customer_name ?? "",
                  orderId: group.primary.id,
                  trackingNumber: tracking,
                  productTitle,
                  shippingAddress: group.primary.shipping_address ?? null,
                },
              },
            });
            emailResult = "sent";
          } catch (e) {
            console.error("Versandbestätigung konnte nicht gesendet werden", e);
          }
        }
      }
      return { emailResult, status };
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setSelectedGroup((prev) =>
        prev
          ? {
              ...prev,
              primary: { ...prev.primary, status: variables.status },
            }
          : null
      );
      if (result?.emailResult === "sent") {
        toast.success("Status aktualisiert · Versandbestätigung an Kunde gesendet");
      } else if (result?.emailResult === "missing-tracking") {
        toast.warning("Status auf 'Versendet' gesetzt – bitte Sendungsnummer eintragen, damit der Kunde benachrichtigt wird");
      } else if (result?.emailResult === "no-email") {
        toast.warning("Status aktualisiert – Kunde hat keine E-Mail-Adresse hinterlegt");
      } else {
        toast.success("Status aktualisiert!");
      }
    },
    onError: (err: any) => toast.error(err.message || "Fehler beim Aktualisieren"),
  });

  const handleOpenDetail = (group: GroupedOrder) => {
    setSelectedGroup(group);
    setTrackingInput(group.primary.tracking_number || "");
  };

  const groupedOrders = groupOrders(orders);

  const filtered: GroupedOrder[] =
    statusFilter === "all"
      ? groupedOrders.filter((g) => g.primary.status !== "ARCHIVED")
      : statusFilter === "ALL_INCL_ARCHIVED"
      ? groupedOrders
      : groupedOrders.filter((g) => g.primary.status === statusFilter);

  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const pendingCount = groupedOrders.filter((g) => g.primary.status === "PENDING").length;


  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error("Keine Bestellungen zum Exportieren");
      return;
    }

    // CSV-Wert escapen: Anführungszeichen verdoppeln, in Quotes einschließen
    const esc = (val: unknown): string => {
      if (val === null || val === undefined) return "";
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "Bestellnummer",
      "Datum",
      "Status",
      "Kundenname",
      "E-Mail",
      "Produkt",
      "Betrag (EUR)",
      "Sendungsnummer",
      "Adresse",
      "PLZ",
      "Stadt",
      "Land",
      "Stripe Session ID",
    ];

    const rows = filtered.map((g) => {
      const o = g.primary;
      const productSummary = g.items
        .map((i) => (i.quantity > 1 ? `${i.quantity}× ${i.title}` : i.title))
        .join(" | ");
      return [
        o.id,
        new Date(o.created_at).toLocaleString("de-DE"),
        STATUS_MAP[o.status]?.label ?? o.status,
        o.customer_name ?? "",
        o.customer_email ?? "",
        productSummary,
        g.totalAmount.toFixed(2).replace(".", ","),
        o.tracking_number ?? "",
        [o.shipping_address?.line1, o.shipping_address?.line2].filter(Boolean).join(" "),
        o.shipping_address?.postal_code ?? "",
        o.shipping_address?.city ?? "",
        o.shipping_address?.country ?? "",
        o.stripe_session_id ?? "",
      ];
    });

    // Semikolon-Trennzeichen für DE-Excel, BOM für UTF-8 Erkennung
    const csv =
      "\uFEFF" +
      [headers, ...rows].map((row) => row.map(esc).join(";")).join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    const suffix = statusFilter === "all" ? "alle" : statusFilter.toLowerCase();
    link.href = url;
    link.download = `bestellungen_${suffix}_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${filtered.length} Bestellungen exportiert`);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Bestellungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} Bestellungen insgesamt
            {pendingCount > 0 && (
              <span className="text-primary font-medium ml-1">· {pendingCount} ausstehend</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 shrink-0">
            <Download className="h-4 w-4" />
            <span className="hidden xs:inline sm:inline">CSV-Export</span>
            <span className="xs:hidden sm:hidden">CSV</span>
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="flex-1 sm:w-[180px] sm:flex-none">
              <SelectValue placeholder="Status filtern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Aktive Bestellungen</SelectItem>
              <SelectItem value="PENDING">Ausstehend</SelectItem>
              <SelectItem value="SHIPPED">Versendet</SelectItem>
              <SelectItem value="COMPLETED">Abgeschlossen</SelectItem>
              <SelectItem value="REFUNDED">Erstattet</SelectItem>
              <SelectItem value="ARCHIVED">Archiviert</SelectItem>
              <SelectItem value="ALL_INCL_ARCHIVED">Alle (inkl. Archiv)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Gesamt", value: orders.length, icon: Package },
          { label: "Ausstehend", value: pendingCount, icon: Calendar },
          { label: "Abgeschlossen", value: orders.filter((o) => o.status === "COMPLETED").length, icon: CreditCard },
          { label: "Umsatz", value: `${totalRevenue.toFixed(2).replace(".", ",")} €`, icon: CreditCard },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <stat.icon className="h-4 w-4" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="text-lg font-bold font-mono-data">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Mobile: Card list */}
          <div className="md:hidden space-y-3">
            {filtered.map((g) => {
              const order = g.primary;
              const status = STATUS_MAP[order.status] || { label: order.status, variant: "outline" as const };
              return (
                <button
                  key={g.groupKey}
                  onClick={() => handleOpenDetail(g)}
                  className="w-full text-left border rounded-lg p-3 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono-data text-xs text-muted-foreground">
                          #{order.id.slice(0, 8)}
                        </span>
                        <Badge variant={status.variant} className="text-[10px] h-4 px-1.5">
                          {status.label}
                        </Badge>
                        {g.itemCount > 1 && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1.5">
                            {g.itemCount} Artikel
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate mt-1">
                        {order.customer_name || "–"}
                      </p>
                      {order.customer_email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {order.customer_email}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold font-mono-data text-base">
                        {g.totalAmount.toFixed(2).replace(".", ",")} €
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t space-y-1.5">
                    {g.items.map((item) => (
                      <div key={item.listing_id} className="flex items-center gap-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            className="w-8 h-8 rounded object-contain bg-muted shrink-0"
                          />
                        )}
                        <span className="text-xs line-clamp-1 flex-1 min-w-0">
                          {item.quantity > 1 && (
                            <span className="font-semibold text-foreground mr-1">{item.quantity}×</span>
                          )}
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2 text-[11px] text-muted-foreground">
                    <span className="whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    {order.tracking_number ? (
                      <span className="flex items-center gap-1 text-primary font-medium truncate">
                        <Truck className="h-3 w-3 shrink-0" />
                        <span className="truncate">{order.tracking_number}</span>
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground border rounded-lg">
                Keine Bestellungen gefunden
              </div>
            )}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bestellnr.</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Produkt</TableHead>
                  <TableHead className="text-right">Betrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sendungsnr.</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((g) => {
                  const order = g.primary;
                  const status = STATUS_MAP[order.status] || { label: order.status, variant: "outline" as const };
                  return (
                    <TableRow key={g.groupKey} className="group">
                      <TableCell className="font-mono-data text-xs align-top pt-3">
                        #{order.id.slice(0, 8)}
                        {g.itemCount > 1 && (
                          <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1.5">
                            {g.itemCount}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <div className="min-w-[140px]">
                          <p className="text-sm font-medium truncate">
                            {order.customer_name || "–"}
                          </p>
                          {order.customer_email && (
                            <p className="text-xs text-muted-foreground truncate">
                              {order.customer_email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          {g.items.map((item) => (
                            <div key={item.listing_id} className="flex items-center gap-2">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-7 h-7 rounded object-contain bg-muted shrink-0"
                                />
                              )}
                              <span className="text-sm line-clamp-1 max-w-[220px]">
                                {item.quantity > 1 && (
                                  <span className="font-semibold mr-1">{item.quantity}×</span>
                                )}
                                {item.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold font-mono-data align-top pt-3">
                        {g.totalAmount.toFixed(2).replace(".", ",")} €
                      </TableCell>
                      <TableCell className="align-top pt-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground align-top pt-3">
                        {order.tracking_number ? (
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Truck className="h-3.5 w-3.5" />
                            {order.tracking_number}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">–</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap align-top pt-3">
                        {new Date(order.created_at).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="align-top pt-2">
                        <div className="flex items-center gap-1 justify-end">
                          <InvoiceButton
                            orderId={order.id}
                            invoiceNumber={order.invoice_number}
                            size="sm"
                            variant="ghost"
                            label=""
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleOpenDetail(g)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      Keine Bestellungen gefunden
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedGroup} onOpenChange={(open) => !open && setSelectedGroup(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Bestellung {selectedGroup?.primary.id.slice(0, 8)}
              {selectedGroup && selectedGroup.itemCount > 1 && (
                <Badge variant="outline" className="ml-1 text-[10px]">
                  {selectedGroup.itemCount} Artikel
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedGroup && (() => {
            const primary = selectedGroup.primary;
            return (
            <div className="space-y-5 pt-2">
              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kundendaten</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{primary.customer_name || "Nicht verfügbar"}</span>
                  </div>
                  {primary.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{primary.customer_email}</span>
                    </div>
                  )}
                  {primary.shipping_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        {primary.shipping_address.name && (
                          <p className="font-medium">{primary.shipping_address.name}</p>
                        )}
                        {primary.shipping_address.line1 && <p>{primary.shipping_address.line1}</p>}
                        {primary.shipping_address.line2 && <p>{primary.shipping_address.line2}</p>}
                        <p>
                          {primary.shipping_address.postal_code} {primary.shipping_address.city}
                        </p>
                        {primary.shipping_address.country && (
                          <p className="text-muted-foreground">{primary.shipping_address.country}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Artikel ({selectedGroup.itemCount})
                </p>
                {selectedGroup.items.map((item) => (
                  <div key={item.listing_id} className="flex items-start gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-contain bg-card shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">
                        {item.quantity > 1 && (
                          <span className="text-primary mr-1">{item.quantity}×</span>
                        )}
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Einzelpreis: {item.price.toFixed(2).replace(".", ",")} €
                        {item.quantity > 1 && (
                          <span className="ml-2">
                            · Summe: {(item.price * item.quantity).toFixed(2).replace(".", ",")} €
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  icon={CreditCard}
                  label="Gesamtbetrag"
                  value={`${selectedGroup.totalAmount.toFixed(2).replace(".", ",")} €`}
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Package className="h-3.5 w-3.5" />
                    <span className="text-xs">Status</span>
                  </div>
                  <Select
                    value={primary.status}
                    onValueChange={(val) =>
                      statusMutation.mutate({ orderIds: selectedGroup.allIds, status: val, group: selectedGroup })
                    }
                  >
                    <SelectTrigger className="h-8 text-sm w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Ausstehend</SelectItem>
                      <SelectItem value="SHIPPED">Versendet</SelectItem>
                      <SelectItem value="COMPLETED">Abgeschlossen</SelectItem>
                      <SelectItem value="REFUNDED">Erstattet</SelectItem>
                      <SelectItem value="ARCHIVED">Archiviert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DetailItem
                  icon={Calendar}
                  label="Erstellt"
                  value={new Date(primary.created_at).toLocaleString("de-DE")}
                />
                <DetailItem
                  icon={Calendar}
                  label="Aktualisiert"
                  value={new Date(primary.updated_at).toLocaleString("de-DE")}
                />
              </div>

              {/* Tracking Number Input */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  DHL Sendungsnummer
                  {selectedGroup.itemCount > 1 && (
                    <span className="text-[10px] text-muted-foreground font-normal">
                      (wird auf alle {selectedGroup.itemCount} Artikel angewendet)
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="z.B. 00340434161094042557"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    className="text-sm font-mono"
                  />
                  <Button
                    size="sm"
                    disabled={trackingMutation.isPending}
                    onClick={() =>
                      trackingMutation.mutate({
                        orderIds: selectedGroup.allIds,
                        trackingNumber: trackingInput,
                        group: selectedGroup,
                      })
                    }
                  >
                    {trackingMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Speichern
                      </>
                    )}
                  </Button>
                </div>
                {primary.tracking_number && (
                  <a
                    href={`https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${primary.tracking_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Bei DHL verfolgen →
                  </a>
                )}
              </div>

              {/* Rechnung */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium">Rechnung</p>
                    <p className="text-xs text-muted-foreground font-mono-data">
                      {primary.invoice_number || "Wird beim Öffnen erstellt"}
                    </p>
                  </div>
                  <InvoiceButton
                    orderId={primary.id}
                    invoiceNumber={primary.invoice_number}
                    label="PDF öffnen"
                    size="sm"
                    variant="outline"
                  />
                </div>
              </div>

              {/* IDs */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Bestell-ID:</span>{" "}
                  <span className="font-mono-data">{primary.id}</span>
                </p>
                {selectedGroup.allIds.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Weitere Positionen:</span>{" "}
                    <span className="font-mono-data">
                      {selectedGroup.allIds.filter((id) => id !== primary.id).map((id) => id.slice(0, 8)).join(", ")}
                    </span>
                  </p>
                )}
                {primary.stripe_session_id && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Stripe Session:</span>{" "}
                    <span className="font-mono-data">{primary.stripe_session_id}</span>
                  </p>
                )}
              </div>

              {/* Archive Action */}
              <div className="pt-2 border-t border-border/50">
                {primary.status === "ARCHIVED" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    disabled={statusMutation.isPending}
                    onClick={() =>
                      statusMutation.mutate({ orderIds: selectedGroup.allIds, status: "COMPLETED" })
                    }
                  >
                    <ArchiveRestore className="h-4 w-4" />
                    Aus Archiv wiederherstellen
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    disabled={statusMutation.isPending}
                    onClick={() =>
                      statusMutation.mutate({ orderIds: selectedGroup.allIds, status: "ARCHIVED" })
                    }
                  >
                    <Archive className="h-4 w-4" />
                    Bestellung archivieren
                  </Button>
                )}
              </div>
            </div>
            );
          })()}
        </DialogContent>
      </Dialog>

    </div>
  );
}

function DetailItem({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <p className={`text-sm font-medium ${mono ? "font-mono-data" : ""}`}>{value}</p>
    </div>
  );
}
