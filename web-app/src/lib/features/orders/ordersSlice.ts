import { orderType } from "@/types/orderType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNewOrderCount, fetchOrders } from "./thunks/ordersThunks";

interface State {
  orders: orderType[];
  newOrdersCount: number;
  ordersLoading: boolean;
  countLoading: boolean;
  error: string | null;
}
const initialState: State = {
  orders: [],
  newOrdersCount: 0,
  ordersLoading: false,
  countLoading: false,
  error: null,
}
const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      // --- Fetch Products ---
      .addCase(fetchOrders.pending, (state) => {
        state.ordersLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<orderType[]>) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.error = action.payload || 'Failed to load products';
      })
      // Fetch new order count
      .addCase(fetchNewOrderCount.pending, (state) => {
        state.countLoading = true;
        state.error = null;
      })

      .addCase(fetchNewOrderCount.fulfilled, (state, action) => {
        state.countLoading = false;
        state.newOrdersCount = action.payload;
      })

      .addCase(fetchNewOrderCount.rejected, (state, action) => {
        state.countLoading = false;
        state.error = action.payload ?? "Failed to fetch count";
      })
  },
})

export default ordersSlice.reducer;