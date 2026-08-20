// src/store/cartSlice.ts

import { RootState } from "@/lib/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  variantTitle?: string;
  selectedOptions?: Record<string, string>;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
};

const initialState: CartState = {
  items: [],
  isDrawerOpen: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ── Add item (or increment if already in cart) ──────────────────────────
    addItem(state, action: PayloadAction<Omit<CartItem, "quantity">>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, existing.stock);
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      state.isDrawerOpen = true; // auto-open drawer on add
    },

    // ── Remove item entirely ────────────────────────────────────────────────
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    // ── Set exact quantity ──────────────────────────────────────────────────
    setQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) return;
      if (action.payload.quantity < 1) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        item.quantity = Math.min(action.payload.quantity, item.stock);
      }
    },

    // ── Increment / decrement ───────────────────────────────────────────────
    incrementItem(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.quantity = Math.min(item.quantity + 1, item.stock);
    },

    decrementItem(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      } else {
        item.quantity -= 1;
      }
    },

    // ── Clear entire cart ───────────────────────────────────────────────────
    clearCart(state) {
      state.items = [];
    },

    // ── Drawer controls ─────────────────────────────────────────────────────
    openDrawer(state) {
      state.isDrawerOpen = true;
    },
    closeDrawer(state) {
      state.isDrawerOpen = false;
    },
    toggleDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
  },
});

export const {
  addItem,
  removeItem,
  setQuantity,
  incrementItem,
  decrementItem,
  clearCart,
  openDrawer,
  closeDrawer,
  toggleDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;

// ── Selectors ──────────────────────────────────────────────────────────────────


export const selectCartItems      = (s: RootState) => s.cart.items;
export const selectIsDrawerOpen   = (s: RootState) => s.cart.isDrawerOpen;
export const selectCartCount      = (s: RootState) =>
  s.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal      = (s: RootState) =>
  s.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectItemById = (id: string) => (s: RootState) =>
  s.cart.items.find((i) => i.id === id);