import { Product } from '@/database/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
        if (!product) return;
        const productId = product.id || product.slug || product.sku || `p-${Date.now()}`;
        const addQty = Math.max(1, Number(quantity) || 1);

        set((state) => {
          const currentItems = Array.isArray(state.items) ? state.items : [];
          const existing = currentItems.find((item) => item.id === productId);

          if (existing) {
            return {
              items: currentItems.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity + addQty } : item
              ),
            };
          }

          // Extract primary product image
          let image = '';
          if (product.images) {
            if (Array.isArray(product.images)) {
              image = (product.images as string[])[0] || '';
            } else if (typeof product.images === 'string') {
              try {
                const parsed = JSON.parse(product.images);
                image = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : product.images;
              } catch {
                image = product.images;
              }
            }
          }

          let numericPrice = 0;
          if (typeof product.price === 'number') {
            numericPrice = isNaN(product.price) ? 0 : product.price;
          } else if (product.price) {
            const cleaned = String(product.price).replace(/[^0-9.-]+/g, '');
            const parsed = parseFloat(cleaned);
            numericPrice = isNaN(parsed) ? 0 : parsed;
          }

          const newItem: CartItem = {
            id: productId,
            slug: product.slug || product.sku || productId,
            name: product.name || 'Legrand Electrical Product',
            price: numericPrice,
            image,
            quantity: addQty,
            color,
          };

          return { items: [...currentItems, newItem] };
        });
      },

      // ── REMOVE PRODUCT ──
      removeProduct: (id) => {
        set((state) => ({
          items: (state.items || []).filter((item) => item.id !== id),
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
          items: (state.items || []).map((item) => (item.id === id ? { ...item, quantity } : item)),
        }));
      },

      // ── CLEAR CART ──
      clearCart: () => set({ items: [] }),

      // ── CALCULATE TOTALS ──
      calculateTotals: () => {
        const items = get().items || [];

        const subtotal = items.reduce((sum, item) => {
          const itemPrice = Number(item.price) || 0;
          const itemQty = Number(item.quantity) || 0;
          return sum + itemPrice * itemQty;
        }, 0);

        const discount = items.reduce((sum, item) => {
          if (item.originalPrice && item.originalPrice > item.price) {
            return sum + (item.originalPrice - item.price) * (item.quantity || 1);
          }
          return sum;
        }, 0);

        const itemCount = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

        return {
          subtotal: Math.max(0, subtotal),
          discount: Math.max(0, discount),
          itemCount: Math.max(0, itemCount),
          total: Math.max(0, subtotal),
        };
      },

      // ── HELPERS ──
      getItemCount: () => {
        return (get().items || []).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
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
