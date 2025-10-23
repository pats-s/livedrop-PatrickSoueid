import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from './api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
  
  // Customer
  customer: any | null;
  setCustomer: (customer: any) => void;
  logout: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: [],
      customer: null,

      // Cart methods
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product._id === product._id
          );

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return {
              cart: [...state.cart, { product, quantity }],
            };
          }
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product._id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          cart: state.cart.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ cart: [] });
      },

      getItemCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      // Customer methods
      setCustomer: (customer) => {
        set({ customer });
      },

      logout: () => {
        set({ customer: null, cart: [] });
      },
    }),
    {
      name: 'shoplite-store',
      version: 1,
    }
  )
);