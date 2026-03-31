import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut, Home, Store } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const mobileNav = [
  { to: "/", label: "Start", icon: Home },
  { to: "/produkte", label: "Shop", icon: Store },
];

export function Header() {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user, signOut } = useAuth();

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-3 md:mx-8 mb-3 md:mb-6">
        <div className="flex items-center justify-between rounded-2xl bg-primary/75 backdrop-blur-2xl backdrop-saturate-150 px-2 py-2 md:px-8 md:py-3.5 shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.4)] border border-primary/30">
          {/* Logo — desktop only */}
          <Link to="/" className="hidden md:flex items-center gap-2.5 group">
            <img
              src="/images/b-electronics-logo.webp"
              alt="B.Electronics Logo"
              className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-sm font-bold text-primary-foreground tracking-wide">
              B.Electronics
            </span>
          </Link>

          {/* Mobile: icon nav spanning full width */}
          <nav className="flex items-center justify-around w-full md:w-auto md:justify-end md:gap-1">
            {mobileNav.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex flex-col md:flex-row items-center gap-1 md:gap-1.5 px-4 py-1.5 md:py-2 md:px-5 rounded-xl transition-all duration-300 ${
                    active
                      ? "text-primary-foreground"
                      : "text-primary-foreground/60 hover:text-primary-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5 md:hidden" strokeWidth={active ? 2.5 : 1.5} />
                  <span className={`text-[10px] md:text-sm mt-0.5 md:mt-0 ${active ? "font-bold" : "font-medium"}`}>
                    {item.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary-foreground/15 rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex flex-col md:flex-row items-center gap-1 md:gap-1.5 px-4 py-1.5 md:py-2 md:px-5 text-primary-foreground/60 hover:text-primary-foreground transition-all duration-300 rounded-xl"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-[10px] md:text-sm font-medium mt-0.5 md:mt-0">Warenkorb</span>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-2 md:top-0.5 md:right-1 bg-background text-foreground text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Auth */}
            {user ? (
              <button
                onClick={() => signOut()}
                className="flex flex-col md:flex-row items-center gap-1 md:gap-1.5 px-4 py-1.5 md:py-2 md:px-4 text-primary-foreground/60 hover:text-primary-foreground transition-all duration-300 rounded-xl"
                title="Abmelden"
              >
                <LogOut className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[10px] md:text-sm font-medium mt-0.5 md:mt-0">Abmelden</span>
              </button>
            ) : (
              <Link
                to="/anmelden"
                className="flex flex-col md:flex-row items-center gap-0.5 md:gap-0 px-4 py-1.5 md:py-2 md:px-4 text-primary-foreground/60 hover:text-primary-foreground transition-all duration-300 rounded-xl"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[10px] md:text-sm font-medium mt-0.5 md:mt-0">Konto</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
