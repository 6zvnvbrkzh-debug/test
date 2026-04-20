import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp contact bubble — sticks bottom-right, visible on every page.
 * Tapping opens a WhatsApp chat with a pre-filled greeting.
 */
const WHATSAPP_NUMBER = "4917622551230"; // +49 176 22551230, international format, no spaces
const PREFILLED_MESSAGE = "Hallo Barbato Electronics, ich habe eine Frage zu Ihrem Shop.";

export function WhatsAppBubble() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Schreibe uns auf WhatsApp"
      title="Schreibe uns auf WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_-6px_rgba(37,211,102,0.55)] hover:shadow-[0_10px_40px_-8px_rgba(37,211,102,0.75)] hover:scale-[1.04] active:scale-95 transition-all duration-300 px-3.5 py-3 md:px-4"
    >
      {/* Pulsing ring (purely decorative) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping pointer-events-none"
        style={{ animationDuration: "2.4s" }}
      />
      <MessageCircle className="relative h-5 w-5 md:h-6 md:w-6 fill-white" strokeWidth={2} />
      <span className="relative hidden md:inline text-sm font-semibold tracking-wide pr-1">
        Chat
      </span>
    </a>
  );
}
