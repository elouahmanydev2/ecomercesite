// src/lib/features/orders/ordersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
  createOrder,
  deleteOrder,
  fetchOrder,
  fetchOrders,
  updateOrder,
} from "@/lib/features/orders/thunks/ordersThunks";
import { OrderType } from "@/types/orderType";

interface OrdersState {
  orders: OrderType[];
  order: OrderType | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
};

// Helper — safely coerces any rejected payload/error to a string
function toErrorMessage(payload: unknown, fallback = "Something went wrong"): string {
  if (typeof payload === "string" && payload.length > 0) return payload;
  if (payload instanceof Error) return payload.message;
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof (payload as { message: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }
  return fallback;
}

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.order = null;
    },
    clearOrderError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ── Fetch all ────────────────────────────────────────────────────────
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = toErrorMessage(action.payload, "Failed to fetch orders");
      })

      // ── Fetch one ────────────────────────────────────────────────────────
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = toErrorMessage(action.payload, "Failed to fetch order");
      })

      // ── Create ───────────────────────────────────────────────────────────
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = toErrorMessage(action.payload, "Failed to create order");
      })

      // ── Update ───────────────────────────────────────────────────────────
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        const index = state.orders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = toErrorMessage(action.payload, "Failed to update order");
      })

      // ── Delete ───────────────────────────────────────────────────────────
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((o) => o.id !== action.payload);
        if (state.order?.id === action.payload) state.order = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = toErrorMessage(action.payload, "Failed to delete order");
      });
  },
});

export const { clearCurrentOrder, clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;