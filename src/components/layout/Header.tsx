import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Start" },
  { to: "/produkte?category=receiver", label: "Octagon" },
  { to: "/produkte?category=streaming-box", label: "Formuler" },
  { to: "/produkte", label: "Highlights" },
];

export function Header() {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname + location.search === to;
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      {/* Top bar */}
      <div className="container flex h-20 items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img 
            src="/images/b-electronics-logo.webp" 
            alt="B.Electronics Logo" 
            className="h-14 w-14 object-contain"
          />
          <span className="font-semibold text-lg hidden sm:block">B.Electronics</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className={`text-sm transition-signal relative py-1 ${
                isActive(link.to)
                  ? "text-foreground font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground relative"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 pb-4 pt-2 space-y-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.to + link.label}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-signal"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
