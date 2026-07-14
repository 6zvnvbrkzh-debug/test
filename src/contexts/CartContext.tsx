import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import type { Listing } from "@/lib/mock-data";
import { isShopClosed, SHOP_CLOSURE } from "@/lib/shop-status";

export interface CartItem {
  listing: Listing;
  quantity: number;
}

export interface AppliedVoucher {
  code: string;
  /** Restguthaben des Gutscheins zum Zeitpunkt der Anwendung */
  balance: number;
  /** Auf diese Bestellung anwendbarer Rabattbetrag (Server-berechnet) */
  applicableAmount: number;
  /** True wenn der Gutschein an ein Konto gebunden ist ODER Restguthaben übrig bleibt */
  requiresAccount: boolean;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (listing: Listing, qty?: number) => boolean;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  getItemQuantity: (listingId: string) => number;
  voucher: AppliedVoucher | null;
  setVoucher: (v: AppliedVoucher | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "be-cart-v1";

type PersistedCart = { items: CartItem[]; voucher: AppliedVoucher | null };

function loadPersisted(): PersistedCart {
  if (typeof window === "undefined") return { items: [], voucher: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], voucher: null };
    const parsed = JSON.parse(raw) as PersistedCart;
    return {
      items: Array.isArray(parsed?.items) ? parsed.items.filter((i) => i?.listing?.id && typeof i.quantity === "number") : [],
      voucher: parsed?.voucher ?? null,
    };
  } catch {
    return { items: [], voucher: null };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial = loadPersisted();
  const [items, setItems] = useState<CartItem[]>(initial.items);
  const [isOpen, setIsOpen] = useState(false);
  const [voucher, setVoucher] = useState<AppliedVoucher | null>(initial.voucher);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, voucher }));
    } catch {
      // ignore quota / private-mode errors
    }
  }, [items, voucher]);

  const getItemQuantity = useCallback((listingId: string) => {
    return items.find((item) => item.listing.id === listingId)?.quantity ?? 0;
  }, [items]);

  const addItem = useCallback((listing: Listing, qty: number = 1): boolean => {
    if (isShopClosed()) {
      toast.error("Betriebsferien", { description: SHOP_CLOSURE.message });
      return false;
    }
    const currentQty = items.find((item) => item.listing.id === listing.id)?.quantity ?? 0;
    const newQty = Math.min(currentQty + qty, listing.stock);
    if (newQty <= currentQty) return false;

    setItems((prev) => {
      const existing = prev.find((item) => item.listing.id === listing.id);
      if (existing) {
        return prev.map((item) =>
          item.listing.id === listing.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { listing, quantity: newQty - currentQty }];
    });
    setIsOpen(true);
    return true;
  }, [items]);

  const removeItem = useCallback((listingId: string) => {
    setItems((prev) => prev.filter((item) => item.listing.id !== listingId));
  }, []);

  const updateQuantity = useCallback((listingId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.listing.id !== listingId));
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.listing.id !== listingId) return item;
        const clamped = Math.min(quantity, item.listing.stock);
        return { ...item, quantity: clamped };
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setVoucher(null);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.listing.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        getItemQuantity,
        voucher,
        setVoucher,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
