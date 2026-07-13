"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/lib/data";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" };

const STORAGE_KEY = "cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const product = action.payload;
      const existingIndex = state.items.findIndex((i) => i.productId === product.id);
      if (existingIndex >= 0) {
        const items = state.items.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + 1 } : item,
        );
        return { items };
      }
      return {
        items: [
          ...state.items,
          { productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 },
        ],
      };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.productId !== action.payload) };
    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) return { items: state.items.filter((i) => i.productId !== productId) };
      return {
        items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

function loadCart(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.items)) return parsed;
    }
  } catch {
    // ignore
  }
  return { items: [] };
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addItem = useCallback((product: Product) => dispatch({ type: "ADD_ITEM", payload: product }), []);
  const removeItem = useCallback((productId: string) => dispatch({ type: "REMOVE_ITEM", payload: productId }), []);
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } }),
    [],
  );
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
