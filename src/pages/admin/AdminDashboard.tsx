import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [listings, orders, profiles] = await Promise.all([
        supabase.from("listings").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, amount, status", { count: "exact" }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);

      const totalRevenue = orders.data
        ?.filter((o) => o.status === "COMPLETED")
        .reduce((sum, o) => sum + Number(o.amount), 0) || 0;

      return {
        products: listings.count || 0,
        orders: orders.count || 0,
        users: profiles.count || 0,
        revenue: totalRevenue,
      };
    },
  });

  const cards = [
    { title: "Produkte", value: stats?.products ?? "–", icon: Package, color: "text-blue-600" },
    { title: "Bestellungen", value: stats?.orders ?? "–", icon: ShoppingCart, color: "text-green-600" },
    { title: "Benutzer", value: stats?.users ?? "–", icon: Users, color: "text-purple-600" },
    {
      title: "Umsatz",
      value: stats ? `${stats.revenue.toFixed(2).replace(".", ",")} €` : "–",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
