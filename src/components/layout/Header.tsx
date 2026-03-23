import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Search, ShoppingCart, Grid3X3 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "Start", icon: Home },
  { to: "/produkte", label: "Shop", icon: Grid3X3 },
  { to: "/suche", label: "Suche", icon: Search },
];

export function Header() {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Top minimal brand bar — desktop only */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/30 bg-background/40 backdrop-blur-2xl shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.15)] px-6 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/images/b-electronics-logo.webp"
                  alt="B.Electronics Logo"
                  className="h-9 w-9 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-lg ring-1 ring-primary/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-wide leading-none">
                  B.Electronics
                </span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
                  Streaming & Hardware
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative px-5 py-2.5 text-sm rounded-xl transition-all duration-300 flex items-center gap-2 ${
                      active
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" strokeWidth={1.5} />
                    {item.label}
                    {active && (
                      <motion.div
                        layoutId="desktop-nav-bg"
                        className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:bg-primary/10 border border-transparent hover:border-primary/20"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={1.5} />
              <span className="hidden lg:inline">Warenkorb</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-[0_0_12px_hsl(var(--primary)/0.4)]"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom navbar — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-3 mb-3">
          <div className="flex items-center justify-around rounded-2xl border border-border/30 bg-background/50 backdrop-blur-2xl shadow-[0_-8px_32px_-8px_hsl(var(--primary)/0.12),0_0_0_1px_hsl(var(--border)/0.1)] py-2 px-2">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-300"
                >
                  {active && (
                    <motion.div
                      layoutId="mobile-nav-bg"
                      className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <item.icon
                    className={`h-5 w-5 relative z-10 transition-colors duration-300 ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={active ? 2 : 1.5}
                  />
                  <span
                    className={`text-[10px] relative z-10 transition-colors duration-300 ${
                      active ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Cart button mobile */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex flex-col items-center gap-0.5 py-1.5 px-4 rounded-xl transition-all duration-300"
            >
              <ShoppingBag
                className="h-5 w-5 text-muted-foreground transition-colors duration-300"
                strokeWidth={1.5}
              />
              <span className="text-[10px] text-muted-foreground">Warenkorb</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-2 bg-primary text-primary-foreground text-[9px] font-bold min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
