import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Package, Users, LayoutDashboard, ArrowLeft, ShoppingCart, FolderOpen, BarChart3, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Produkte", url: "/admin/produkte", icon: Package },
  { title: "Benutzer", url: "/admin/benutzer", icon: Users },
  { title: "Bestellungen", url: "/admin/bestellungen", icon: ShoppingCart },
  { title: "Bewertungen", url: "/admin/bewertungen", icon: Star },
  { title: "Ratgeber", url: "/admin/ratgeber", icon: BookOpen },
  { title: "Kategorien", url: "/admin/kategorien", icon: FolderOpen },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <NavLink to={item.url} end>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 border-b flex items-center px-3 sm:px-4 gap-2 sm:gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <SidebarTrigger className="shrink-0" />
            <span className="text-sm font-semibold text-muted-foreground truncate">Admin-Bereich</span>
            <div className="ml-auto">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" aria-label="Zum Shop">
                  <ArrowLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Zum Shop</span>
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-4 md:p-6 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
