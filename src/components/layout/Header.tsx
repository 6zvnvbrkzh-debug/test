import { Link, useLocation } from "react-router-dom";
import { Search, Plus, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navLinks = [
  { to: "/marketplace", label: "Marktplatz" },
  { to: "/marketplace?category=streaming-box", label: "Streaming Boxen" },
  { to: "/marketplace?category=receiver", label: "Receiver" },
  { to: "/marketplace?category=accessories", label: "Zubehör" },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl backdrop-saturate-150">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-signal">
            <span className="text-primary-foreground font-bold text-sm tracking-tighter">SG</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Signal</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 text-[13px] rounded-md transition-signal ${
                location.pathname + location.search === link.to
                  ? "text-foreground font-medium bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <Link to="/marketplace">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
          <Link to="/create-listing">
            <Button size="sm" className="hidden sm:flex gap-1.5 press-scale transition-signal text-[13px] h-8 rounded-md font-semibold">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Verkaufen
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <User className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 pb-4 pt-2 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-signal"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/create-listing" onClick={() => setMobileOpen(false)}>
            <Button size="sm" className="w-full mt-2 gap-1.5 font-semibold">
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
              Artikel verkaufen
            </Button>
          </Link>
        </nav>
      )}
    </header>
  );
}
