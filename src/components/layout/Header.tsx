import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Home, Store } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "Start", icon: Home },
  { to: "/produkte", label: "Shop", icon: Store },
];

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.27-.467-2.416-1.49-.893-.79-1.496-1.767-1.67-2.064-.173-.298-.018-.459.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.88.118.574-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function Header() {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user } = useAuth();
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

  const mobileIcon =
    "relative flex flex-col items-center justify-center rounded-xl p-2 text-primary-foreground/65 transition-colors duration-200 active:scale-95";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)]">
      <div
        className={`transition-all duration-500 ease-out ${
          scrolled
            ? "mx-2 mt-2 md:mx-6 md:mt-3"
            : "mx-2 mt-2 md:mx-8 md:mt-6"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/75 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out ${
            scrolled
              ? "px-1 py-1 md:px-6 md:py-2.5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)]"
              : "px-1.5 py-1.5 md:px-8 md:py-3.5 shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.4)]"
          }`}
        >
          {/* ─── MOBILE ─── */}
          <nav className="flex w-full items-center justify-between md:hidden">
            {/* Left group: Start, Shop */}
            <div className="flex items-center">
              {navItems.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`${mobileIcon} ${active ? "text-primary-foreground" : ""}`}
                  >
                    <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.75} />
                    <span className={`text-[9px] leading-tight ${active ? "font-bold" : "font-medium"}`}>
                      {item.label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Center: Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/lovable-uploads/46fa0535-bf1d-4bdc-8bc6-b0b7aa36c88a.png"
                alt="Barbato Electronics Logo"
                className="h-8 w-8 rounded-lg object-contain"
              />
            </Link>

            {/* Right group: Telegram, WhatsApp, Cart, Account */}
            <div className="flex items-center">
              <a
                href="https://t.me/bElectronicsshop"
                target="_blank"
                rel="noopener noreferrer"
                className={mobileIcon}
                aria-label="Telegram"
              >
                <TelegramIcon className="h-[18px] w-[18px]" />
              </a>

              <a
                href="https://wa.me/4917622551230"
                target="_blank"
                rel="noopener noreferrer"
                className={mobileIcon}
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </a>

              <button
                onClick={() => setIsOpen(true)}
                className={`${mobileIcon}`}
                aria-label="Warenkorb"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-background px-0.5 text-[9px] font-bold text-foreground shadow-sm"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <Link
                to={user ? "/konto" : "/anmelden"}
                className={`${mobileIcon} ${isActive("/konto") ? "text-primary-foreground" : ""}`}
                aria-label="Konto"
              >
                <User className="h-5 w-5" strokeWidth={isActive("/konto") ? 2.5 : 1.75} />
              </Link>
            </div>
          </nav>

          {/* ─── DESKTOP ─── */}
          <Link to="/" className="hidden items-center gap-3 group md:flex">
            <img
              src="/lovable-uploads/46fa0535-bf1d-4bdc-8bc6-b0b7aa36c88a.png"
              alt="Barbato Electronics Logo"
              className={`rounded-lg object-contain transition-all duration-500 ease-out group-hover:scale-105 ${scrolled ? "h-9 w-9" : "h-14 w-14"}`}
            />
            <span className={`font-bold tracking-wide text-primary-foreground transition-all duration-500 ${scrolled ? "text-base" : "text-lg"}`}>
              Barbato Electronics
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm transition-all duration-300 ${
                    active
                      ? "font-bold text-primary-foreground"
                      : "font-medium text-primary-foreground/60 hover:text-primary-foreground"
                  }`}
                >
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="desktop-nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}

            <a
              href="https://t.me/bElectronicsshop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground/60 transition-all duration-300 hover:text-primary-foreground"
            >
              <TelegramIcon className="h-5 w-5" />
              Telegram
            </a>

            <a
              href="https://wa.me/4917622551230"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground/60 transition-all duration-300 hover:text-primary-foreground"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
              <span className="absolute -bottom-1 right-1 text-[9px] text-primary-foreground/40">
                für Großbestellungen
              </span>
            </a>

            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-medium text-primary-foreground/60 transition-all duration-300 hover:text-primary-foreground"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
              Warenkorb
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0.5 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-background px-1 text-[10px] font-bold text-foreground shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {user ? (
              <Link
                to="/konto"
                className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm transition-all duration-300 ${
                  isActive("/konto")
                    ? "font-bold text-primary-foreground"
                    : "font-medium text-primary-foreground/60 hover:text-primary-foreground"
                }`}
              >
                <User className="h-5 w-5" strokeWidth={isActive("/konto") ? 2.5 : 1.5} />
                Konto
                {isActive("/konto") && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </Link>
            ) : (
              <Link
                to="/anmelden"
                className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground/60 transition-all duration-300 hover:text-primary-foreground"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
                Konto
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
