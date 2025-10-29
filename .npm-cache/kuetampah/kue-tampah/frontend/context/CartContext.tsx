'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { getProductById, Product } from '@/lib/products';
import {
  cancelAbandonedCartReminder,
  requestNotificationPermission,
  scheduleAbandonedCartReminder,
  storeReminderSent,
} from '@/utils/notify';

type CartItem = {
  id: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  lastUpdated: number | null;
  reminderSent: boolean;
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  markReminderSent: () => void;
};

const clampQuantity = (value: number) => Math.max(1, Math.min(99, value));

const noopStorage: Storage = {
  length: 0,
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      lastUpdated: null,
      reminderSent: false,
      addItem: (id) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === id);
          const items = existing
            ? state.items.map((item) => (item.id === id ? { ...item, quantity: clampQuantity(item.quantity + 1) } : item))
            : [...state.items, { id, quantity: 1 }];
          return {
            items,
            lastUpdated: Date.now(),
            reminderSent: false,
          };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          lastUpdated: Date.now(),
          reminderSent: false,
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity: clampQuantity(quantity) } : item)),
          lastUpdated: Date.now(),
          reminderSent: false,
        })),
      clearCart: () => ({
        items: [],
        lastUpdated: null,
        reminderSent: false,
      }),
      markReminderSent: () => ({ reminderSent: true }),
    }),
    {
      name: 'kue-tampah-cart',
      storage: createJSONStorage<CartStore>(() => (typeof window !== 'undefined' ? localStorage : noopStorage)),
    },
  ),
);

export const getCartProducts = (items: CartItem[]) =>
  items
    .map((item) => {
      const product = getProductById(item.id);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean) as Array<CartItem & { product: Product }>;

export const useCart = () => {
  const { items, lastUpdated, reminderSent, addItem, removeItem, updateQuantity, clearCart, markReminderSent } =
    useCartStore();

  const detailedItems = getCartProducts(items);
  const subtotal = detailedItems.reduce((total, entry) => total + entry.quantity * entry.product.price, 0);
  const itemCount = detailedItems.reduce((total, entry) => total + entry.quantity, 0);

  return {
    items: detailedItems,
    subtotal,
    itemCount,
    lastUpdated,
    reminderSent,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    markReminderSent,
    completeCheckout: () => {
      clearCart();
      storeReminderSent(false);
    },
  };
};

export const initializeReminderWatcher = () => {
  if (typeof window === 'undefined') return;

  const { items, lastUpdated, reminderSent } = useCartStore.getState();

  if (items.length === 0) {
    cancelAbandonedCartReminder();
    storeReminderSent(false);
    return;
  }

  requestNotificationPermission();

  void scheduleAbandonedCartReminder({
    lastUpdated: lastUpdated ?? Date.now(),
    reminderAlreadySent: reminderSent,
    onTrigger: () => {
      useCartStore.getState().markReminderSent();
      storeReminderSent(true);
    },
  });
};

if (typeof window !== 'undefined') {
  useCartStore.subscribe((state, prev) => {
    if (
      state.items !== prev.items ||
      state.lastUpdated !== prev.lastUpdated ||
      state.reminderSent !== prev.reminderSent
    ) {
      initializeReminderWatcher();
    }
  });
}
