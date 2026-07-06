import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../lib/mock-data';

// ============================================
// TYPES
// ============================================
export interface CartItem {
  id: string; // product id
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  color?: string; // selected variant, optional
  maxStock?: number; // optional stock limit
}

interface CartTotals {
  subtotal: number;
  discount: number;
  itemCount: number; // total quantity across all items
  total: number;
}

interface CartState {
  items: CartItem[];

  // Actions
  addProduct: (product: Product, quantity?: number, color?: string) => void;
  removeProduct: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotals: () => CartTotals;

  // Helpers
  getItemCount: () => number;
  isInCart: (id: string) => boolean;
  getItemQuantity: (id: string) => number;
}

// ============================================
// CART STORE
// ============================================
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // ── ADD PRODUCT ──
      // If product already exists in cart, increase its quantity instead of duplicating
      addProduct: (product, quantity = 1, color) => {
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }

          const newItem: CartItem = {
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            quantity,
            color,
          };

          return { items: [...state.items, newItem] };
        });
      },

      // ── REMOVE PRODUCT ──
      removeProduct: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      // ── UPDATE QUANTITY ──
      // Quantity of 0 or less removes the item from cart
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeProduct(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },

      // ── CLEAR CART ──
      clearCart: () => set({ items: [] }),

      // ── CALCULATE TOTALS ──
      calculateTotals: () => {
        const items = get().items;

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const discount = items.reduce((sum, item) => {
          if (item.originalPrice) {
            return sum + (item.originalPrice - item.price) * item.quantity;
          }
          return sum;
        }, 0);

        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

        return {
          subtotal,
          discount,
          itemCount,
          total: subtotal, // shipping/tax added at checkout step later
        };
      },

      // ── HELPERS ──
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      isInCart: (id) => {
        return get().items.some((item) => item.id === id);
      },

      getItemQuantity: (id) => {
        const item = get().items.find((item) => item.id === id);
        return item?.quantity ?? 0;
      },
    }),
    {
      name: 'javal-cart-storage', // localStorage key
    }
  )
);

// --- USAGE ---
//
// In a component:
// const addProduct = useCartStore((state) => state.addProduct);
// const items = useCartStore((state) => state.items);
// const { subtotal, total, itemCount } = useCartStore((state) => state.calculateTotals());
//
// addProduct(product, 1, "Matte Black");
// updateQuantity(product.id, 3);
// removeProduct(product.id);
