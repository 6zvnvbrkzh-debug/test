import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Home, Store } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const mobileNav = [
  { to: "/", label: "Start", icon: Home },
  { to: "/produkte", label: "Shop", icon: Store },
];

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

export function Header() {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className={`transition-all duration-500 ease-out ${scrolled ? "mx-2 md:mx-6 mt-2 md:mt-3" : "mx-3 md:mx-8 mt-3 md:mt-6"}`}>
        <div className={`flex items-center justify-between rounded-2xl bg-primary/75 backdrop-blur-2xl backdrop-saturate-150 border border-primary/30 transition-all duration-500 ease-out ${
          scrolled
            ? "px-2 py-1.5 md:px-6 md:py-2.5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)]"
            : "px-2 py-2 md:px-8 md:py-3.5 shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.4)]"
        }`}>
          {/* Logo — desktop only */}
          <Link to="/" className="hidden md:flex items-center gap-3 group">
            <img
              src="/images/b-electronics-logo.webp"
              alt="Barbato Electronics Logo"
              className={`object-contain transition-all duration-500 ease-out group-hover:scale-105 rounded-lg ${scrolled ? "h-9 w-9" : "h-14 w-14"}`}
            />
            <span className={`font-bold text-primary-foreground tracking-wide transition-all duration-500 ${scrolled ? "text-base" : "text-lg"}`}>
              Barbato Electronics
            </span>
          </Link>

          {/* Mobile: icon nav spanning full width */}
          <nav className="flex items-center justify-evenly w-full md:w-auto md:justify-end md:gap-1">
            {mobileNav.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 md:py-2 md:px-5 rounded-xl transition-all duration-300 ${
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

            {/* Telegram */}
            <a
              href="https://t.me/bElectronicsshop"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 md:py-2 md:px-4 text-primary-foreground/60 hover:text-primary-foreground transition-all duration-300 rounded-xl"
            >
              <TelegramIcon className="h-5 w-5" />
              <span className="text-[10px] md:text-sm font-medium mt-0.5 md:mt-0">Telegram</span>
            </a>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 md:py-2 md:px-5 text-primary-foreground/60 hover:text-primary-foreground transition-all duration-300 rounded-xl"
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
              <Link
                to="/konto"
                className={`relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 md:py-2 md:px-4 transition-all duration-300 rounded-xl ${
                  isActive("/konto")
                    ? "text-primary-foreground"
                    : "text-primary-foreground/60 hover:text-primary-foreground"
                }`}
              >
                <User className="h-5 w-5" strokeWidth={isActive("/konto") ? 2.5 : 1.5} />
                <span className={`text-[10px] md:text-sm mt-0.5 md:mt-0 ${isActive("/konto") ? "font-bold" : "font-medium"}`}>Konto</span>
                {isActive("/konto") && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary-foreground/15 rounded-xl -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            ) : (
              <Link
                to="/anmelden"
                className="flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 md:py-2 md:px-4 text-primary-foreground/60 hover:text-primary-foreground transition-all duration-300 rounded-xl"
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
