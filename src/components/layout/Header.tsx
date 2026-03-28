import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "Start" },
  { to: "/produkte", label: "Shop" },
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
      <div className="mx-4 md:mx-8 mb-4 md:mb-6">
        <div className="flex items-center justify-between rounded-2xl bg-primary px-5 py-3 md:px-8 md:py-4 shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.5)]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="/images/b-electronics-logo.webp"
                alt="B.Electronics Logo"
                className="h-8 w-8 md:h-9 md:w-9 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105 brightness-0 invert"
              />
            </div>
            <span className="text-sm md:text-base font-bold text-primary-foreground tracking-wide hidden sm:inline">
              B.Electronics
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-4 md:px-5 py-2 text-sm md:text-base transition-all duration-300 rounded-xl ${
                    active
                      ? "text-primary-foreground font-semibold"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-primary-foreground rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative ml-2 md:ml-4 px-4 md:px-5 py-2 text-sm md:text-base text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 rounded-xl"
            >
              <span className="hidden md:inline">Warenkorb</span>
              <ShoppingCart className="h-5 w-5 md:hidden" strokeWidth={1.5} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-0.5 md:top-0 md:right-0 bg-background text-foreground text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1"
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
                className="ml-1 md:ml-2 px-3 md:px-4 py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 rounded-xl"
                title="Abmelden"
              >
                <LogOut className="h-5 w-5 md:hidden" strokeWidth={1.5} />
                <span className="hidden md:inline">Abmelden</span>
              </button>
            ) : (
              <Link
                to="/anmelden"
                className="ml-1 md:ml-2 px-3 md:px-4 py-2 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-all duration-300 rounded-xl"
              >
                <User className="h-5 w-5 md:hidden" strokeWidth={1.5} />
                <span className="hidden md:inline">Anmelden</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
