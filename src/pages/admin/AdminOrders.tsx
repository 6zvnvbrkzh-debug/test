import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, Package, CreditCard, User, Calendar, Hash, Truck, Save, MapPin, Mail } from "lucide-react";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "Ausstehend", variant: "outline" },
  SHIPPED: { label: "Versendet", variant: "secondary" },
  COMPLETED: { label: "Abgeschlossen", variant: "default" },
  REFUNDED: { label: "Erstattet", variant: "destructive" },
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
  listings: { title: string; price: number; images: string[] | null } | null;
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
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
    mutationFn: async ({ orderId, trackingNumber }: { orderId: string; trackingNumber: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ tracking_number: trackingNumber.trim() || null } as any)
        .eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Sendungsnummer gespeichert!");
    },
    onError: (err: any) => toast.error(err.message || "Fehler beim Speichern"),
  });

  const handleOpenDetail = (order: OrderDetail) => {
    setSelectedOrder(order);
    setTrackingInput(order.tracking_number || "");
  };

  const filtered = statusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  const formatAddress = (addr: ShippingAddress | null) => {
    if (!addr) return null;
    const parts = [addr.line1, addr.line2, `${addr.postal_code || ""} ${addr.city || ""}`.trim(), addr.country].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bestellungen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {orders.length} Bestellungen insgesamt
            {pendingCount > 0 && (
              <span className="text-primary font-medium ml-1">· {pendingCount} ausstehend</span>
            )}
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status filtern" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="PENDING">Ausstehend</SelectItem>
            <SelectItem value="SHIPPED">Versendet</SelectItem>
            <SelectItem value="COMPLETED">Abgeschlossen</SelectItem>
            <SelectItem value="REFUNDED">Erstattet</SelectItem>
          </SelectContent>
        </Select>
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
        <div className="border rounded-lg overflow-x-auto">
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
              {filtered.map((order) => {
                const status = STATUS_MAP[order.status] || { label: order.status, variant: "outline" as const };
                return (
                  <TableRow key={order.id} className="group">
                    <TableCell className="font-mono-data text-xs">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
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
                      <div className="flex items-center gap-2">
                        {order.listings?.images?.[0] && (
                          <img
                            src={order.listings.images[0]}
                            alt=""
                            className="w-8 h-8 rounded object-contain bg-muted"
                          />
                        )}
                        <span className="text-sm line-clamp-1 max-w-[200px]">
                          {order.listings?.title || "Gelöschtes Produkt"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold font-mono-data">
                      {Number(order.amount).toFixed(2).replace(".", ",")} €
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {order.tracking_number ? (
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <Truck className="h-3.5 w-3.5" />
                          {order.tracking_number}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleOpenDetail(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
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
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Bestellung {selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-5 pt-2">
              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kundendaten</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{selectedOrder.customer_name || "Nicht verfügbar"}</span>
                  </div>
                  {selectedOrder.customer_email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{selectedOrder.customer_email}</span>
                    </div>
                  )}
                  {selectedOrder.shipping_address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        {selectedOrder.shipping_address.name && (
                          <p className="font-medium">{selectedOrder.shipping_address.name}</p>
                        )}
                        {selectedOrder.shipping_address.line1 && <p>{selectedOrder.shipping_address.line1}</p>}
                        {selectedOrder.shipping_address.line2 && <p>{selectedOrder.shipping_address.line2}</p>}
                        <p>
                          {selectedOrder.shipping_address.postal_code} {selectedOrder.shipping_address.city}
                        </p>
                        {selectedOrder.shipping_address.country && (
                          <p className="text-muted-foreground">{selectedOrder.shipping_address.country}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                {selectedOrder.listings?.images?.[0] && (
                  <img
                    src={selectedOrder.listings.images[0]}
                    alt=""
                    className="w-16 h-16 rounded-lg object-contain bg-card"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{selectedOrder.listings?.title || "Gelöschtes Produkt"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Produktpreis: {selectedOrder.listings?.price
                      ? `${Number(selectedOrder.listings.price).toFixed(2).replace(".", ",")} €`
                      : "–"}
                  </p>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailItem icon={CreditCard} label="Betrag" value={`${Number(selectedOrder.amount).toFixed(2).replace(".", ",")} €`} />
                <DetailItem
                  icon={Package}
                  label="Status"
                  value={STATUS_MAP[selectedOrder.status]?.label || selectedOrder.status}
                />
                <DetailItem
                  icon={Calendar}
                  label="Erstellt"
                  value={new Date(selectedOrder.created_at).toLocaleString("de-DE")}
                />
                <DetailItem
                  icon={Calendar}
                  label="Aktualisiert"
                  value={new Date(selectedOrder.updated_at).toLocaleString("de-DE")}
                />
              </div>

              {/* Tracking Number Input */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <label className="text-xs font-medium flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-primary" />
                  DHL Sendungsnummer
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
                        orderId: selectedOrder.id,
                        trackingNumber: trackingInput,
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
                {selectedOrder.tracking_number && (
                  <a
                    href={`https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${selectedOrder.tracking_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Bei DHL verfolgen →
                  </a>
                )}
              </div>

              {/* IDs */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Bestell-ID:</span>{" "}
                  <span className="font-mono-data">{selectedOrder.id}</span>
                </p>
                {selectedOrder.stripe_session_id && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Stripe Session:</span>{" "}
                    <span className="font-mono-data">{selectedOrder.stripe_session_id}</span>
                  </p>
                )}
              </div>
            </div>
          )}
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
