import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Weight } from "@/data/products";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  weight: Weight;
  qty: number;
  unitPrice: number;
};

type State = {
  items: CartItem[];
  isOpen: boolean;
  wishlist: string[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  toggleWishlist: (productId: string) => void;
};

export const DELIVERY_CHARGES = 500;

export const useCart = create<State>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      wishlist: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === item.productId && i.weight === item.weight,
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === existing.id ? { ...i, qty: i.qty + item.qty } : i,
              ),
              isOpen: true,
            };
          }
          const id = `${item.productId}-${item.weight}-${Date.now()}`;
          return { items: [...s.items, { ...item, id }], isOpen: true };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)),
        })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
      toggleWishlist: (productId) =>
        set((s) => ({
          wishlist: s.wishlist.includes(productId)
            ? s.wishlist.filter((p) => p !== productId)
            : [...s.wishlist, productId],
        })),
    }),
    { name: "mango-cart" },
  ),
);

export const subtotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);
