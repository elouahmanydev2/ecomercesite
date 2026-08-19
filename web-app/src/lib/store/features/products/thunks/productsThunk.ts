import { ProductType } from "@/types/productType";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk<
  ProductType[],
  void,
  { rejectValue: string }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/products", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return rejectWithValue(
        errorData.error || `Error ${response.status}: Failed to fetch products`
      );
    }

    const data: ProductType[] = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
});