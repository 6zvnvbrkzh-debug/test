import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Eye, MousePointerClick, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--muted))",
];

export default function AdminAnalytics() {
  // Order analytics from DB
  const { data: orderStats } = useQuery({
    queryKey: ["admin-analytics-orders"],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("created_at, amount, status")
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by day
      const byDay: Record<string, { date: string; revenue: number; count: number }> = {};
      orders?.forEach((o) => {
        const day = o.created_at.slice(0, 10);
        if (!byDay[day]) byDay[day] = { date: day, revenue: 0, count: 0 };
        byDay[day].count += 1;
        if (o.status === "COMPLETED" || o.status === "SHIPPED") {
          byDay[day].revenue += Number(o.amount);
        }
      });

      const daily = Object.values(byDay).sort((a, b) => a.date.localeCompare(b.date));

      // Status breakdown
      const statusCounts: Record<string, number> = {};
      orders?.forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
      });
      const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name: STATUS_LABELS[name] || name, value }));

      const totalRevenue = orders
        ?.filter((o) => o.status === "COMPLETED" || o.status === "SHIPPED")
        .reduce((s, o) => s + Number(o.amount), 0) || 0;

      return { daily, statusData, totalOrders: orders?.length || 0, totalRevenue };
    },
  });

  // Product views (top products by stock/orders)
  const { data: topProducts } = useQuery({
    queryKey: ["admin-analytics-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("title, stock, status")
        .eq("status", "ACTIVE")
        .order("stock", { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const revenueConfig = {
    revenue: { label: "Umsatz (€)", color: "hsl(var(--primary))" },
  };

  const ordersConfig = {
    count: { label: "Bestellungen", color: "hsl(var(--accent))" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Besucher (7 Tage)"
          value="40"
          icon={Users}
          subtitle="32 aus Deutschland"
        />
        <KPICard
          title="Seitenaufrufe (7 Tage)"
          value="139"
          icon={Eye}
          subtitle="3,5 pro Besuch"
        />
        <KPICard
          title="Gesamtumsatz"
          value={orderStats ? `${orderStats.totalRevenue.toFixed(2).replace(".", ",")} €` : "–"}
          icon={TrendingUp}
          subtitle={`${orderStats?.totalOrders || 0} Bestellungen`}
        />
        <KPICard
          title="Absprungrate"
          value="76%"
          icon={MousePointerClick}
          subtitle="Desktop: 60% / Mobil: 40%"
        />
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Umsatz pro Tag</CardTitle>
          </CardHeader>
          <CardContent>
            {orderStats?.daily.length ? (
              <ChartContainer config={revenueConfig} className="h-[250px] w-full">
                <BarChart data={orderStats.daily}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => {
                      const d = new Date(v);
                      return `${d.getDate()}.${d.getMonth() + 1}`;
                    }}
                    className="text-muted-foreground"
                    fontSize={12}
                  />
                  <YAxis fontSize={12} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">Noch keine Daten</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bestellungen pro Tag</CardTitle>
          </CardHeader>
          <CardContent>
            {orderStats?.daily.length ? (
              <ChartContainer config={ordersConfig} className="h-[250px] w-full">
                <LineChart data={orderStats.daily}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => {
                      const d = new Date(v);
                      return `${d.getDate()}.${d.getMonth() + 1}`;
                    }}
                    fontSize={12}
                    className="text-muted-foreground"
                  />
                  <YAxis fontSize={12} className="text-muted-foreground" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">Noch keine Daten</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bestellstatus-Verteilung</CardTitle>
          </CardHeader>
          <CardContent>
            {orderStats?.statusData.length ? (
              <ChartContainer config={{}} className="h-[250px] w-full">
                <PieChart>
                  <Pie
                    data={orderStats.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {orderStats.statusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">Noch keine Daten</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produkte mit niedrigem Bestand</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts?.length ? (
              <div className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p.title} className="flex justify-between items-center">
                    <span className="text-sm truncate max-w-[200px]">{p.title}</span>
                    <span className={`text-sm font-medium ${p.stock <= 2 ? "text-destructive" : "text-muted-foreground"}`}>
                      {p.stock} auf Lager
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-8 text-center">Keine Produkte</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Traffic overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Traffic-Übersicht (letzte 7 Tage)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Top Seiten</h4>
              <div className="space-y-1 text-sm">
                {[
                  { page: "Startseite", views: 34 },
                  { page: "Produkte", views: 11 },
                  { page: "Admin", views: 4 },
                  { page: "Checkout", views: 3 },
                  { page: "Anmelden", views: 3 },
                ].map((p) => (
                  <div key={p.page} className="flex justify-between">
                    <span>{p.page}</span>
                    <span className="text-muted-foreground">{p.views}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Quellen</h4>
              <div className="space-y-1 text-sm">
                {[
                  { source: "Direkt", count: 40 },
                  { source: "Stripe Checkout", count: 4 },
                ].map((s) => (
                  <div key={s.source} className="flex justify-between">
                    <span>{s.source}</span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Geräte</h4>
              <div className="space-y-1 text-sm">
                {[
                  { device: "Desktop", count: 24 },
                  { device: "Mobil", count: 16 },
                ].map((d) => (
                  <div key={d.device} className="flex justify-between">
                    <span>{d.device}</span>
                    <span className="text-muted-foreground">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Ausstehend",
  SHIPPED: "Versendet",
  COMPLETED: "Abgeschlossen",
  REFUNDED: "Erstattet",
};

function KPICard({ title, value, icon: Icon, subtitle }: { title: string; value: string; icon: React.ElementType; subtitle?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
