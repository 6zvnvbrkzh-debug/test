import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Home, Store, Heart, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";


export function Header() {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const cellBase =
    "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-primary-foreground/60 transition-colors duration-200 hover:text-primary-foreground";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-[env(safe-area-inset-top)]">
      {/* ─── MOBILE TOP BAR (logo + cart) ─── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-primary/75 backdrop-blur-2xl backdrop-saturate-150 border-b border-primary/20">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lovable-uploads/barbato-logo.webp"
            alt="Barbato Electronics"
            width={32}
            height={32}
            fetchPriority="high"
            decoding="async"
            className="h-8 w-8 rounded-md object-contain"
          />
          <span className="text-sm font-bold tracking-wide text-primary-foreground">
            Barbato Electronics
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center h-8 w-8 rounded-lg text-primary-foreground/80 hover:text-primary-foreground transition-colors"
          aria-label="Warenkorb"
        >
          <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-background px-0.5 text-[9px] font-bold text-foreground shadow-sm"
              >
                {totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div
        className={`transition-all duration-500 ease-out ${
          scrolled ? "mx-2 mt-1 lg:mx-6 lg:mt-3" : "mx-2 mt-1 lg:mx-8 lg:mt-6"
        }`}
      >
        {/* ─── MOBILE BOTTOM NAV ─── */}
        <nav
          className={`flex items-stretch rounded-2xl border border-primary/30 bg-primary/75 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out lg:hidden ${
            scrolled
              ? "shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)]"
              : "shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.4)]"
          }`}
        >
          {/* Start */}
          <Link to="/" className={`${cellBase} ${isActive("/") ? "text-primary-foreground" : ""}`} aria-label="Start">
            <Home className="h-5 w-5" strokeWidth={isActive("/") ? 2.5 : 1.75} />
            <span className={`text-[9px] leading-none ${isActive("/") ? "font-bold" : "font-medium"}`}>Start</span>
            {isActive("/") && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
            )}
          </Link>

          {/* Shop */}
          <Link to="/produkte" className={`${cellBase} ${isActive("/produkte") ? "text-primary-foreground" : ""}`} aria-label="Shop">
            <Store className="h-5 w-5" strokeWidth={isActive("/produkte") ? 2.5 : 1.75} />
            <span className={`text-[9px] leading-none ${isActive("/produkte") ? "font-bold" : "font-medium"}`}>Shop</span>
            {isActive("/produkte") && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
            )}
          </Link>

          {/* Wunschliste */}
          <Link
            to={user ? "/wunschliste" : "/anmelden"}
            className={`${cellBase} ${isActive("/wunschliste") ? "text-primary-foreground" : ""}`}
            aria-label="Wunschliste"
          >
            <Heart className="h-5 w-5" strokeWidth={isActive("/wunschliste") ? 2.5 : 1.75} />
            <span className={`text-[9px] leading-none ${isActive("/wunschliste") ? "font-bold" : "font-medium"}`}>Merkliste</span>
            {isActive("/wunschliste") && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
            )}
          </Link>

          {/* Chat (Telegram + WhatsApp) */}
          <button onClick={() => setChatOpen(true)} className={cellBase} aria-label="Chat">
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
            <span className="text-[9px] font-medium leading-none">Chat</span>
          </button>

          {/* Konto */}
          <Link
            to={user ? "/konto" : "/anmelden"}
            className={`${cellBase} ${isActive("/konto") ? "text-primary-foreground" : ""}`}
            aria-label="Konto"
          >
            <User className="h-5 w-5" strokeWidth={isActive("/konto") ? 2.5 : 1.75} />
            <span className={`text-[9px] leading-none ${isActive("/konto") ? "font-bold" : "font-medium"}`}>Konto</span>
            {isActive("/konto") && (
              <motion.div layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-xl bg-primary-foreground/15" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
            )}
          </Link>
        </nav>

        {/* Chat Sheet */}
        <Sheet open={chatOpen} onOpenChange={setChatOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl border-border/40 pb-[env(safe-area-inset-bottom)]">
            <SheetHeader className="text-left">
              <SheetTitle>Direktkontakt</SheetTitle>
              <p className="text-sm text-muted-foreground">Wähle deinen bevorzugten Kanal — wir antworten meist innerhalb weniger Minuten.</p>
            </SheetHeader>
            <div className="mt-6 grid gap-3">
              <a
                href="https://wa.me/4917622551230"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setChatOpen(false)}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">WhatsApp</div>
                  <div className="text-xs text-muted-foreground">Ideal für Großbestellungen & schnelle Fragen</div>
                </div>
              </a>
              <a
                href="https://t.me/bElectronicsshop"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setChatOpen(false)}
                className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <TelegramIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">Telegram</div>
                  <div className="text-xs text-muted-foreground">News, Angebote & Support-Channel</div>
                </div>
              </a>
            </div>
          </SheetContent>
        </Sheet>

        {/* ─── DESKTOP ─── */}
        <div
          className={`hidden items-center justify-between rounded-2xl border border-primary/30 bg-primary/75 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out lg:flex ${
            scrolled
              ? "px-6 py-2.5 shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.3)]"
              : "px-8 py-3.5 shadow-[0_8px_40px_-8px_hsl(var(--primary)/0.4)]"
          }`}
        >
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/lovable-uploads/barbato-logo.webp"
              alt="Barbato Electronics Logo"
              width={56}
              height={56}
              fetchPriority="high"
              decoding="async"
              className={`rounded-lg object-contain transition-all duration-500 ease-out group-hover:scale-105 ${scrolled ? "h-9 w-9" : "h-14 w-14"}`}
            />
            <span className={`font-bold tracking-wide text-primary-foreground transition-all duration-500 ${scrolled ? "text-base" : "text-lg"}`}>
              Barbato Electronics
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {[
              { to: "/", label: "Start" },
              { to: "/produkte", label: "Shop" },
              { to: "/faq", label: "FAQ" },
            ].map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative rounded-xl px-5 py-2 text-sm transition-all duration-300 ${
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
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-primary-foreground/60 transition-all duration-300 hover:text-primary-foreground"
              title="WhatsApp – Ideal für Großbestellungen & schnelle Fragen"
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
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

            {user && (
              <Link
                to="/wunschliste"
                className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm transition-all duration-300 ${
                  isActive("/wunschliste")
                    ? "font-bold text-primary-foreground"
                    : "font-medium text-primary-foreground/60 hover:text-primary-foreground"
                }`}
                aria-label="Wunschliste"
              >
                <Heart className="h-5 w-5" strokeWidth={isActive("/wunschliste") ? 2.5 : 1.5} />
              </Link>
            )}

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
