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

const mobileActionBase =
  "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-primary-foreground/70 transition-all duration-300 hover:text-primary-foreground";

const desktopActionBase =
  "md:flex-none md:flex-row md:gap-1.5 md:px-4 md:py-2";

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.27-.467-2.416-1.49-.893-.79-1.496-1.767-1.67-2.064-.173-.298-.018-.459.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.88.118.574-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
      <div className={`transition-all duration-500 ease-out ${scrolled ? "mx-2 md:mx-6 mt-2 md:mt-3" : "mx-2 md:mx-8 mt-3 md:mt-6"}`}>
        <div className={`rounded-2xl border border-primary/30 bg-primary/75 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out ${
          scrolled
            ? "px-2 py-1.5 md:px-6 md:py-2.5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)]"
            : "px-2 py-2 md:px-8 md:py-3.5 shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.4)]"
        }`}>
          <div className="hidden items-center justify-between md:flex">
          {/* Logo — desktop only */}
          <Link to="/" className="items-center gap-3 group hidden md:flex">
            <img
              src="/lovable-uploads/46fa0535-bf1d-4bdc-8bc6-b0b7aa36c88a.png"
              alt="Barbato Electronics Logo"
              className={`object-contain transition-all duration-500 ease-out group-hover:scale-105 rounded-lg ${scrolled ? "h-9 w-9" : "h-14 w-14"}`}
            />
            <span className={`font-bold text-primary-foreground tracking-wide transition-all duration-500 ${scrolled ? "text-base" : "text-lg"}`}>
              Barbato Electronics
            </span>
          </Link>

            {/* Desktop nav */}
            <nav className="items-center justify-end gap-1 hidden md:flex">
            {mobileNav.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-2 py-1.5 md:py-2 md:px-5 rounded-xl transition-all duration-300 ${
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

            {/* Telegram — icon only on mobile */}
            <a
              href="https://t.me/bElectronicsshop"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-2 py-1.5 md:py-2 md:px-4 text-primary-foreground/60 hover:text-primary-foreground transition-all duration-300 rounded-xl"
            >
              <TelegramIcon className="h-5 w-5" />
              <span className="hidden md:block text-sm font-medium">Telegram</span>
            </a>

            {/* WhatsApp — icon only on mobile */}
            <a
              href="https://wa.me/4917622551230"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-2 py-1.5 md:py-2 md:px-4 text-primary-foreground/60 hover:text-[#25D366] transition-all duration-300 rounded-xl"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="hidden md:block text-sm font-medium">WhatsApp</span>
              <span className="hidden md:block text-[9px] text-primary-foreground/40 absolute -bottom-1 right-1">für Großbestellungen</span>
            </a>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-primary-foreground/60 transition-all duration-300 hover:text-primary-foreground md:flex-row md:gap-1.5 md:px-5 md:py-2"
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
                className={`relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition-all duration-300 md:flex-row md:gap-1.5 md:px-4 md:py-2 ${
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
                className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-primary-foreground/60 transition-all duration-300 hover:text-primary-foreground md:flex-row md:gap-1.5 md:px-4 md:py-2"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[10px] md:text-sm font-medium mt-0.5 md:mt-0">Konto</span>
              </Link>
            )}
            </nav>
          </div>

          <div className="md:hidden">
            <div className="grid grid-cols-5 gap-1">
              {mobileNav.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative ${mobileActionBase} ${
                      active
                        ? "text-primary-foreground"
                        : "text-primary-foreground/60 hover:text-primary-foreground"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5" strokeWidth={active ? 2.5 : 1.75} />
                    <span className={`text-[10px] leading-none ${active ? "font-bold" : "font-medium"}`}>
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

              <a
                href="https://t.me/bElectronicsshop"
                target="_blank"
                rel="noopener noreferrer"
                className={mobileActionBase}
                aria-label="Telegram"
              >
                <TelegramIcon className="h-4.5 w-4.5" />
                <span className="text-[10px] leading-none font-medium">Telegram</span>
              </a>

              <a
                href="https://wa.me/4917622551230"
                target="_blank"
                rel="noopener noreferrer"
                className={mobileActionBase}
                aria-label="WhatsApp für Großbestellungen"
              >
                <WhatsAppIcon className="h-4.5 w-4.5" />
                <span className="text-[10px] leading-none font-medium">WhatsApp</span>
              </a>
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-1 border-t border-primary-foreground/10 px-1 pt-1.5">
              <span className="truncate text-[9px] font-medium uppercase tracking-[0.18em] text-primary-foreground/45">
                Für Großbestellungen direkt per WhatsApp
              </span>

              <button
                onClick={() => setIsOpen(true)}
                className="relative flex min-w-[72px] flex-none items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-primary-foreground/70 transition-all duration-300 hover:text-primary-foreground"
                aria-label="Warenkorb öffnen"
              >
                <ShoppingCart className="h-4.5 w-4.5" strokeWidth={1.75} />
                <span className="text-[10px] font-medium leading-none">Warenkorb</span>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-background px-1 text-[9px] font-bold text-foreground shadow-sm"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {user ? (
                <Link
                  to="/konto"
                  className={`relative flex min-w-[64px] flex-none flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition-all duration-300 ${
                    isActive("/konto")
                      ? "text-primary-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground"
                  }`}
                  aria-label="Konto"
                >
                  <User className="h-4.5 w-4.5" strokeWidth={isActive("/konto") ? 2.5 : 1.75} />
                  <span className={`text-[10px] leading-none ${isActive("/konto") ? "font-bold" : "font-medium"}`}>
                    Konto
                  </span>
                  {isActive("/konto") && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              ) : (
                <Link
                  to="/anmelden"
                  className="flex min-w-[64px] flex-none flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-primary-foreground/70 transition-all duration-300 hover:text-primary-foreground"
                  aria-label="Anmelden"
                >
                  <User className="h-4.5 w-4.5" strokeWidth={1.75} />
                  <span className="text-[10px] font-medium leading-none">Konto</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
