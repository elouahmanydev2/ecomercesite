import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductType } from "@/types/productType";

export const fetchProduct = createAsyncThunk<
  ProductType,
  string,
  { rejectValue: string }
>(
  "product/fetchProduct",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("ID is not valid");
      }

      const res = await fetch(`/api/products/${id}`);

      if (!res.ok) {
        return rejectWithValue("Failed to fetch product");
      }

      const product: ProductType = await res.json();

      return product;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);