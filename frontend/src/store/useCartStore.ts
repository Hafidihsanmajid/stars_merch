'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/types/api';

export const FREE_SHIPPING_THRESHOLD = 300000;
export const STANDARD_SHIPPING_FEE = 20000;

interface CouponData {
  code: string;
  type: 'free_shipping' | 'percentage';
  discountValue: number; // e.g. 10 for 10%
  description: string;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  coupon: CouponData | null;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  // Coupon
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Computed helper getters
  getTotalItems: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getDiscountAmount: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      coupon: null,

      addItem: (newItem: CartItem) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variantId === newItem.variantId
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingIndex];
            const maxAllowed = newItem.maxStock ?? 999;
            const newQuantity = Math.min(existingItem.quantity + newItem.quantity, maxAllowed);

            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
            return { items: updatedItems, isDrawerOpen: true };
          }

          return {
            items: [...state.items, newItem],
            isDrawerOpen: true,
          };
        });
      },

      removeItem: (variantId: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.variantId === variantId) {
              const maxAllowed = item.maxStock ?? 999;
              return { ...item, quantity: Math.min(quantity, maxAllowed) };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [], coupon: null });
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      applyCoupon: (rawCode: string) => {
        const code = rawCode.trim().toUpperCase();
        if (code === 'STARS2026') {
          const coupon: CouponData = {
            code: 'STARS2026',
            type: 'free_shipping',
            discountValue: 0,
            description: 'Gratis Ongkos Kirim Se-Indonesia',
          };
          set({ coupon });
          return { success: true, message: 'Kupon STARS2026 aktif: Gratis Ongkir!' };
        }

        if (code === 'DROP10' || code === 'MEMBERSHIP10') {
          const coupon: CouponData = {
            code,
            type: 'percentage',
            discountValue: 10,
            description: 'Diskon 10% untuk Semua Produk',
          };
          set({ coupon });
          return { success: true, message: `Kupon ${code} aktif: Diskon 10% diterapkan!` };
        }

        return {
          success: false,
          message: 'Kode kupon tidak valid atau telah kedaluwarsa.',
        };
      },

      removeCoupon: () => {
        set({ coupon: null });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const coupon = get().coupon;
        if (coupon?.type === 'free_shipping') return 0;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
        return STANDARD_SHIPPING_FEE;
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        const coupon = get().coupon;
        if (!coupon) return 0;
        if (coupon.type === 'percentage') {
          return Math.round((subtotal * coupon.discountValue) / 100);
        }
        return 0;
      },

      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const shipping = get().getShippingFee();
        const discount = get().getDiscountAmount();
        return Math.max(0, subtotal + shipping - discount);
      },
    }),
    {
      name: 'stars-merch-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
);
