import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type Overlay = 'cart' | 'search' | 'account' | 'menu' | null;

interface MockUser {
  email: string;
}

interface UIValue {
  overlay: Overlay;
  open: (overlay: Exclude<Overlay, null>) => void;
  close: () => void;
  toast: string | null;
  notify: (message: string) => void;
  user: MockUser | null;
  signIn: (email: string) => void;
  signOut: () => void;
  wishlist: string[];
  toggleWish: (productId: string) => boolean;
}

const UIContext = createContext<UIValue | null>(null);
const WISH_KEY = 'concept.wishlist.v1';

function loadWishlist(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(WISH_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [user, setUser] = useState<MockUser | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(loadWishlist);
  const wishRef = useRef(wishlist);
  wishRef.current = wishlist;
  const timer = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {
      /* preferiti solo in sessione */
    }
  }, [wishlist]);

  const open = useCallback((next: Exclude<Overlay, null>) => setOverlay(next), []);
  const close = useCallback(() => setOverlay(null), []);

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast(message);
    timer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const toggleWish = useCallback((productId: string) => {
    const has = wishRef.current.includes(productId);
    setWishlist((prev) => (has ? prev.filter((id) => id !== productId) : [...prev, productId]));
    return !has;
  }, []);

  const signIn = useCallback((email: string) => setUser({ email }), []);
  const signOut = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ overlay, open, close, toast, notify, user, signIn, signOut, wishlist, toggleWish }),
    [overlay, open, close, toast, notify, user, signIn, signOut, wishlist, toggleWish],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI deve essere usato dentro UIProvider');
  return ctx;
}
