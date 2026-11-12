import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartLine, Product, Size } from '../data/types';
import { getProductById } from '../data/products';

const STORAGE_KEY = 'concept.cart.v1';
const MAX_QTY = 9;

export interface ResolvedLine extends CartLine {
  product: Product;
  lineTotal: number;
}

interface CartValue {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  add: (productId: string, size: Size, quantity: number) => void;
  setQuantity: (productId: string, size: Size, quantity: number) => void;
  remove: (productId: string, size: Size) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed.filter((l) => getProductById(l.productId)) : [];
  } catch {
    return [];
  }
}

const same = (l: CartLine, id: string, size: Size) => l.productId === id && l.size === size;
const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, n));

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
    } catch {
      /* memoria locale non disponibile: il carrello resta in sessione */
    }
  }, [raw]);

  const add = useCallback((productId: string, size: Size, quantity: number) => {
    setRaw((prev) => {
      const existing = prev.find((l) => same(l, productId, size));
      if (existing) {
        return prev.map((l) => (same(l, productId, size) ? { ...l, quantity: clamp(l.quantity + quantity) } : l));
      }
      return [...prev, { productId, size, quantity: clamp(quantity) }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, size: Size, quantity: number) => {
    setRaw((prev) => prev.map((l) => (same(l, productId, size) ? { ...l, quantity: clamp(quantity) } : l)));
  }, []);

  const remove = useCallback((productId: string, size: Size) => {
    setRaw((prev) => prev.filter((l) => !same(l, productId, size)));
  }, []);

  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartValue>(() => {
    const lines = raw.flatMap((l) => {
      const product = getProductById(l.productId);
      return product ? [{ ...l, product, lineTotal: product.price * l.quantity }] : [];
    });
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [raw, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve essere usato dentro CartProvider');
  return ctx;
}

export { MAX_QTY };
