import { create } from 'zustand';
import type { Product } from '@/lib/mock-data';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasLoaded: boolean;
  loadProducts: () => Promise<void>;
  setProducts: (products: Product[]) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  hasLoaded: false,
  setProducts: (products) => set({ products, hasLoaded: true, loading: false, error: null }),
  loadProducts: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch('/api/products');

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error ?? `Server responded with ${res.status}`;
        set({ loading: false, hasLoaded: true, error: String(msg) });
        return;
      }

      const payload = await res.json();

      if (!payload || payload.ok !== true || !Array.isArray(payload.data)) {
        const msg = payload?.error ?? 'Invalid response from server';
        set({ loading: false, hasLoaded: true, error: String(msg) });
        return;
      }

      set({ products: payload.data as Product[], loading: false, hasLoaded: true, error: null });
    } catch (error) {
      set({
        loading: false,
        hasLoaded: true,
        error: error instanceof Error ? error.message : 'Failed to load products',
      });
    }
  },
}));
