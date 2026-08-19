import { ProductType } from "@/types/productType";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProduct = createAsyncThunk<
  ProductType,
  string,
  { rejectValue: string }
>("product/fetchProduct", async (productId, { rejectWithValue }) => {
  try {
    // Correct Axios usage: response.data is already the parsed JSON object
    const response = await axios.get<ProductType>(`/api/products/${productId}`);
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || `Error ${error.response?.status}: Failed to fetch product`
      );
    }
    return rejectWithValue(
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
});