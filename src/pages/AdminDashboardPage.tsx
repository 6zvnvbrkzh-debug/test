import { Link } from "react-router-dom";
import { Trash2, Ban, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { ConditionBadge } from "@/components/marketplace/ConditionBadge";
import { mockListings } from "@/lib/mock-data";

const AdminDashboardPage = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-8">Manage listings and users</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Listings", value: "8" },
            { label: "Total Users", value: "4" },
            { label: "Orders Today", value: "0" },
            { label: "Revenue", value: "$0" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-mono font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Listings table */}
        <h2 className="font-semibold mb-4">All Listings</h2>
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Seller</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Condition</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockListings.map((l) => (
                  <tr key={l.id} className="border-b last:border-0 hover:bg-muted/30 transition-signal">
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate">{l.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.sellerName}</td>
                    <td className="px-4 py-3 font-mono">${l.price.toFixed(2)}</td>
                    <td className="px-4 py-3"><ConditionBadge condition={l.condition} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/product/${l.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Eye className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
