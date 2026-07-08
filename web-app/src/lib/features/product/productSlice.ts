import { createSlice } from "@reduxjs/toolkit";
import { fetchProduct } from "./thunks/productThunk";
import { ProductType } from "@/types/productType";

interface ProductState {
  product: ProductType | null;
  pending: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  pending: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.pending = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.pending = false;
        state.error =
          action.payload ??
          action.error.message ??
          "Failed to fetch product";
      });
  },
});

export default productSlice.reducer;