import { Link, useLocation } from "react-router-dom";
import { Search, Plus, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { to: "/marketplace", label: "Marketplace" },
  { to: "/marketplace?category=streaming-box", label: "Streaming Boxes" },
  { to: "/marketplace?category=receiver", label: "Receivers" },
  { to: "/marketplace?category=accessories", label: "Accessories" },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Signal</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 text-sm rounded-md transition-signal ${
                location.pathname + location.search === link.to
                  ? "text-foreground font-medium bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/marketplace">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
          <Link to="/create-listing">
            <Button size="sm" className="hidden sm:flex gap-1.5 press-scale transition-signal">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Sell
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <User className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 pb-4 pt-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/create-listing" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full mt-2 gap-1.5">
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Sell an Item
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
