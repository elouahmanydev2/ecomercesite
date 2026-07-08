import { createAsyncThunk } from "@reduxjs/toolkit";

export interface DashboardResponse {
  revenue: number;
  orderCount: number;
  productCount: number;
  recentOrders: any[]; // we'll replace "any" with your orderType later
}

export const fetchDashboard = createAsyncThunk<
  DashboardResponse,
  void,
  { rejectValue: string }
>(
  "dashboard/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/dashboard");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue(`Something went wrong ${err}`);
    }
  }
);