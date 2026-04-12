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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.27-.467-2.416-1.49-.893-.79-1.496-1.767-1.67-2.064-.173-.298-.018-.459.13-.608.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.365.195 1.88.118.574-.091 1.758-.716 2.006-1.409.248-.692.248-1.285.173-1.414-.074-.128-.272-.198-.57-.347m-5.421 5.834h-.004c-1.023-.025-2.05-.295-3.022-.84-.987-.553-1.87-1.288-2.52-2.162l-.036-.05c-.39-.55-.754-1.168-1.077-1.834-.3-.62-.549-1.273-.735-1.938a11.59 11.59 0 0 1-.267-1.57c-.067-.7-.08-1.4-.04-2.092.08-1.376.382-2.71.884-3.92.492-1.185 1.156-2.2 1.963-3.017l.033-.033a1.11 1.11 0 0 1 .785-.324c.46-.02.91.152 1.238.472.34.332.526.787.517 1.258a41.6 41.6 0 0 0-.045 2.22c.03.653.173 1.292.422 1.896.12.275.284.528.485.749.21.23.459.424.733.574.29.157.61.263.942.313.337.05.68.042 1.015-.025a2.63 2.63 0 0 0 1.72-1.12c.162-.255.273-.534.33-.824.074-.363.08-.736.018-1.1a2.18 2.18 0 0 0-.583-1.13 1.81 1.81 0 0 0-1.137-.553 2.29 2.29 0 0 0-.4.01c-.357.035-.696.166-.975.377-.238.179-.427.414-.55.685-.113.25-.157.523-.129.792.032.294.157.573.357.798.17.19.39.333.637.416a.62.62 0 0 1-.255 1.21 2.2 2.2 0 0 1-1.019-.27 2.48 2.48 0 0 1-.933-.873 2.67 2.67 0 0 1-.417-1.23 2.9 2.9 0 0 1 .14-1.35c.214-.55.56-1.03 1.004-1.395.53-.433 1.17-.707 1.85-.788a3.57 3.57 0 0 1 .623-.025c.654.006 1.29.197 1.833.55.556.362 1.004.88 1.292 1.498.298.639.432 1.334.39 2.03a3.62 3.62 0 0 1-.39 1.43 3.51 3.51 0 0 1-.978 1.26c-.456.374-.987.64-1.56.78a4.2 4.2 0 0 1-1.213.12 4.12 4.12 0 0 1-.907-.132 4.6 4.6 0 0 1-1.02-.41 4.35 4.35 0 0 1-.878-.66 4.05 4.05 0 0 1-.68-.85 3.84 3.84 0 0 1-.426-1.004 11.1 11.1 0 0 1-.257-1.114c-.064-.388-.1-.78-.107-1.173-.005-.32.01-.64.046-.958.036-.319.092-.635.167-.946a6.77 6.77 0 0 1 .456-1.38c.22-.458.495-.89.819-1.285.34-.414.732-.78 1.165-1.09.453-.326.952-.583 1.476-.764.538-.187 1.1-.293 1.667-.315a6.4 6.4 0 0 1 1.76.115c.573.1 1.125.287 1.636.554.525.273.997.62 1.398 1.03.416.423.754.92 1 1.47.256.566.416 1.175.473 1.798.058.635.012 1.275-.136 1.894a6.07 6.07 0 0 1-.65 1.8 6.28 6.28 0 0 1-1.138 1.52 6.52 6.52 0 0 1-1.55 1.145 6.66 6.66 0 0 1-1.87.617c-.317.048-.638.07-.958.066z"/>
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
              src="/lovable-uploads/46fa0535-bf1d-4bdc-8bc6-b0b7aa36c88a.png"
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

            {/* WhatsApp for bulk orders */}
            <a
              href="https://wa.me/4917622551230"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 md:py-2 md:px-4 text-primary-foreground/60 hover:text-[#25D366] transition-all duration-300 rounded-xl"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span className="text-[10px] md:text-sm font-medium mt-0.5 md:mt-0">WhatsApp</span>
              <span className="hidden md:block text-[9px] text-primary-foreground/40 absolute -bottom-1 right-1">für Großbestellungen</span>
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
