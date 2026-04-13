import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, User, MapPin, FileText, Save, LogOut, Package, ShoppingBag, Truck, ExternalLink } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "In Bearbeitung", variant: "secondary" },
  SHIPPED: { label: "Versendet", variant: "outline" },
  COMPLETED: { label: "Abgeschlossen", variant: "default" },
  REFUNDED: { label: "Erstattet", variant: "destructive" },
};

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/anmelden", { replace: true });
  }, [user, authLoading, navigate]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, amount, status, created_at, listing_id, tracking_number, listings(title, images)")
        .eq("buyer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
          location: location.trim() || null,
        })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Profil erfolgreich aktualisiert!");
    },
    onError: (err: any) => toast.error(err.message || "Fehler beim Speichern."),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead title="Mein Konto" description="Verwalte dein Konto bei Barbato Electronics." noindex />
      <div className="container py-8 md:py-12 max-w-2xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Mein Konto</h1>
          <p className="text-sm text-muted-foreground">
            Bearbeite deine Profilinformationen und sieh deine Bestellungen.
          </p>
        </div>

        {/* Profile Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profil
          </h2>

          <div className="space-y-2">
            <Label>E-Mail</Label>
            <Input value={user?.email || ""} disabled className="bg-muted" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Anzeigename</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="displayName"
                  placeholder="Dein Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="pl-10"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Standort</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="z.B. Berlin, Deutschland"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                  maxLength={100}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Über mich</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="bio"
                  placeholder="Erzähl etwas über dich..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="pl-10 min-h-[100px]"
                  maxLength={500}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Änderungen speichern
                </>
              )}
            </Button>
          </form>
        </section>

        {/* Orders Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Meine Bestellungen
          </h2>

          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 rounded-xl border border-border/40 bg-card">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Noch keine Bestellungen</p>
              <Link to="/produkte" className="text-primary text-sm font-medium mt-2 inline-block hover:underline">
                Jetzt shoppen →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const listing = order.listings as any;
                const status = statusMap[order.status] || statusMap.PENDING;
                const image = listing?.images?.[0];

                return (
                  <div
                    key={order.id}
                    className="rounded-xl border border-border/40 bg-card overflow-hidden"
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Product image */}
                      <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                        {image ? (
                          <img src={image} alt={listing?.title || ""} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {listing?.title || "Produkt"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.created_at), "dd. MMM yyyy", { locale: de })}
                        </p>
                      </div>

                      {/* Price & Status */}
                      <div className="text-right shrink-0 space-y-1">
                        <p className="text-sm font-bold">{Number(order.amount).toFixed(2)} €</p>
                        <Badge variant={status.variant} className="text-[10px]">
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                    {/* Tracking */}
                    {(order as any).tracking_number && (
                      <div className="flex items-center gap-2 px-4 pb-3 border-t border-border/20 pt-2">
                        <Truck className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-muted-foreground">Sendungsverfolgung:</span>
                        <a
                          href={`https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${(order as any).tracking_number}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          {(order as any).tracking_number}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Sign out */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            signOut();
            navigate("/");
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Abmelden
        </Button>
      </div>
    </Layout>
  );
}
