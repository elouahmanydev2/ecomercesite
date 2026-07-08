import { ProductType } from "@/types/productType";
import { createAsyncThunk } from "@reduxjs/toolkit";

// 1. Fetch All Products
export const fetchProducts = createAsyncThunk<ProductType[], void, { rejectValue: string }>(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (err) {
      return rejectWithValue(`Something went wrong ${err}`);
    }
  }
);