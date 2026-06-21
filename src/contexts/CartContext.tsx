import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Listing } from "@/lib/mock-data";

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [voucher, setVoucher] = useState<AppliedVoucher | null>(null);

  const getItemQuantity = useCallback((listingId: string) => {
    return items.find((item) => item.listing.id === listingId)?.quantity ?? 0;
  }, [items]);

  const addItem = useCallback((listing: Listing, qty: number = 1): boolean => {
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
