import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboard } from "./thunks/dashboardThunks";

interface DashboardState {
  revenue: number;
  orderCount: number;
  productCount: number;
  recentOrders: any[];

  pending: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  revenue: 0,
  orderCount: 0,
  productCount: 0,
  recentOrders: [],

  pending: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchDashboard.pending, (state) => {
        state.pending = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.pending = false;

        state.revenue = action.payload.revenue;
        state.orderCount = action.payload.orderCount;
        state.productCount = action.payload.productCount;
        state.recentOrders = action.payload.recentOrders;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export default dashboardSlice.reducer;