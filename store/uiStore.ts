import { create } from 'zustand';

// ============================================
// TYPES
// ============================================

// Active filters shared across product listing UI
export interface ActiveFilters {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number | null;
  inStockOnly: boolean;
}

// All modal types used across the app — add new ones here as needed
export type ModalType =
  | 'quickView' // product quick view modal
  | 'authSignIn' // sign in modal
  | 'authSignUp' // sign up modal
  | 'addressForm' // shipping address form modal
  | 'deleteConfirm' // generic delete confirmation modal
  | null;

interface UIState {
  // ── Mobile menu state ──
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  // ── Mobile filters drawer state (product listing page) ──
  isMobileFiltersOpen: boolean;
  openMobileFilters: () => void;
  closeMobileFilters: () => void;
  toggleMobileFilters: () => void;

  // ── Cart drawer state ──
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;

  // ── Filters state ──
  filters: ActiveFilters;
  setFilters: (filters: ActiveFilters) => void;
  updateFilter: <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => void;
  resetFilters: () => void;

  // ── Modal state ──
  activeModal: ModalType;
  modalData: unknown; // optional payload passed when opening a modal (e.g. product id)
  openModal: (modal: ModalType, data?: unknown) => void;
  closeModal: () => void;

  // ── Global loading indicator (optional, for page transitions etc.) ──
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
}

// ============================================
// DEFAULT FILTER VALUES
// ============================================
const defaultFilters: ActiveFilters = {
  categories: [],
  brands: [],
  priceMin: 0,
  priceMax: 500000,
  rating: null,
  inStockOnly: false,
};

// ============================================
// UI STORE
// ============================================
export const useUIStore = create<UIState>()((set) => ({
  // ── Mobile menu ──
  isMobileMenuOpen: false,
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  // ── Mobile filters drawer ──
  isMobileFiltersOpen: false,
  openMobileFilters: () => set({ isMobileFiltersOpen: true }),
  closeMobileFilters: () => set({ isMobileFiltersOpen: false }),
  toggleMobileFilters: () => set((state) => ({ isMobileFiltersOpen: !state.isMobileFiltersOpen })),

  // ── Cart drawer ──
  isCartDrawerOpen: false,
  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  // ── Filters ──
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: defaultFilters }),

  // ── Modals ──
  activeModal: null,
  modalData: null,
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // ── Page loading ──
  isPageLoading: false,
  setPageLoading: (loading) => set({ isPageLoading: loading }),
}));

// --- USAGE ---
//
// Mobile menu:
// const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
//
// Filters:
// const filters = useUIStore((state) => state.filters);
// const updateFilter = useUIStore((state) => state.updateFilter);
// updateFilter("categories", ["solar-panels"]);
//
// Modals:
// const openModal = useUIStore((state) => state.openModal);
// openModal("quickView", product.id);
//
// const activeModal = useUIStore((state) => state.activeModal);
// const modalData = useUIStore((state) => state.modalData);
// {activeModal === "quickView" && <QuickViewModal productId={modalData as string} />}
