"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/lib/data";
import { setCookie, getCookie } from "@/lib/cookies";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  sold_by?: string;
  selectedVariant?: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity?: number; selectedVariant?: string } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; selectedVariant?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number; selectedVariant?: string } }
  | { type: "CLEAR_CART" };

const STORAGE_KEY = "cart";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity = 1, selectedVariant } = action.payload;
      const existingIndex = state.items.findIndex(
        (i) => i.productId === product.id && i.selectedVariant === selectedVariant
      );
      if (existingIndex >= 0) {
        const items = state.items.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item,
        );
        return { items };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            sold_by: product.sold_by,
            selectedVariant,
          },
        ],
      };
    }
    case "REMOVE_ITEM": {
      const { productId, selectedVariant } = action.payload;
      return {
        items: state.items.filter(
          (i) => !(i.productId === productId && i.selectedVariant === selectedVariant)
        ),
      };
    }
    case "UPDATE_QUANTITY": {
      const { productId, quantity, selectedVariant } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter(
            (i) => !(i.productId === productId && i.selectedVariant === selectedVariant)
          ),
        };
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId && i.selectedVariant === selectedVariant
            ? { ...i, quantity }
            : i
        ),
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
  addItem: (product: Product, quantity?: number, selectedVariant?: string) => void;
  removeItem: (productId: string, selectedVariant?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariant?: string) => void;
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
    if (getCookie("consent") === "accepted") {
      setCookie("cart", JSON.stringify(state), 7);
    }
  }, [state]);

  const addItem = useCallback(
    (product: Product, quantity?: number, selectedVariant?: string) =>
      dispatch({ type: "ADD_ITEM", payload: { product, quantity, selectedVariant } }),
    [],
  );
  const removeItem = useCallback(
    (productId: string, selectedVariant?: string) =>
      dispatch({ type: "REMOVE_ITEM", payload: { productId, selectedVariant } }),
    [],
  );
  const updateQuantity = useCallback(
    (productId: string, quantity: number, selectedVariant?: string) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity, selectedVariant } }),
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
