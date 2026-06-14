import { createContext, useContext, useState, type ReactNode } from "react";
import { products, type Product } from "./mock-data";

export type CartItem = {
  product: Product;
  size: number;
  color: string;
  quantity: number;
};

type StoreCtx = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (p: Product, size?: number, color?: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  toggleWishlist: (id: string) => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const addToCart = (p: Product, size = 42, color = p.colors[0], qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.product.id === p.id && i.size === size && i.color === color);
      if (existing) {
        return c.map((i) => (i === existing ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...c, { product: p, size, color, quantity: qty }];
    });
  };

  const removeFromCart = (id: string) => setCart((c) => c.filter((i) => i.product.id !== id));
  const updateQty = (id: string, qty: number) =>
    setCart((c) => c.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const toggleWishlist = (id: string) =>
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <Ctx.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQty,
        toggleWishlist,
        cartCount,
        cartTotal,
        clearCart,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
};

export const getProductById = (id: string) => products.find((p) => p.id === id);
