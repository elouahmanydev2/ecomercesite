import { orderType } from "@/types/orderType";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 1. Fetch All Products
export const fetchOrders = createAsyncThunk<orderType[], void, { rejectValue: string }>(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
      
    } catch (err) {
      return rejectWithValue(`Something went wrong ${err}`);
    }
  }
);

// 2. Fetch New order couter
export const fetchNewOrderCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>(
  "dashboard/fetchNewOrderCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/dashboard/new-orders-count");

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.error ?? "Failed to fetch new order count");
      }

      console.log(data);

      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Unknown error"
      );
    }
  }
);