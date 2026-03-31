import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye, Package, CreditCard, User, Calendar, Hash, ExternalLink } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "Ausstehend", variant: "outline" },
  COMPLETED: { label: "Abgeschlossen", variant: "default" },
  REFUNDED: { label: "Erstattet", variant: "destructive" },
};

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
  listings: { title: string; price: number; images: string[] | null } | null;
}

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, listings(title, price, images)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as OrderDetail[];
    },
  });

  const filtered = statusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + Number(o.amount), 0);

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

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
                <TableHead>Produkt</TableHead>
                <TableHead>Käufer-ID</TableHead>
                <TableHead className="text-right">Betrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stripe Session</TableHead>
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
                    <TableCell className="font-mono-data text-xs text-muted-foreground">
                      {order.buyer_id.slice(0, 8)}…
                    </TableCell>
                    <TableCell className="text-right font-semibold font-mono-data">
                      {Number(order.amount).toFixed(2).replace(".", ",")} €
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="font-mono-data text-xs text-muted-foreground">
                      {order.stripe_session_id
                        ? `${order.stripe_session_id.slice(0, 16)}…`
                        : "–"}
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
                        onClick={() => setSelectedOrder(order)}
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
                <DetailItem icon={User} label="Käufer-ID" value={selectedOrder.buyer_id.slice(0, 12) + "…"} mono />
                <DetailItem icon={User} label="Verkäufer-ID" value={selectedOrder.seller_id.slice(0, 12) + "…"} mono />
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

              {/* IDs */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Bestell-ID:</span>{" "}
                  <span className="font-mono-data">{selectedOrder.id}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Listing-ID:</span>{" "}
                  <span className="font-mono-data">{selectedOrder.listing_id}</span>
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
