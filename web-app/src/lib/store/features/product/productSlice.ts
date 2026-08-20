import { fetchProduct } from "./thunks/productThunk";
import { ProductType } from "@/types/productType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductState {
  product: ProductType | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProduct.fulfilled,
        (state, action: PayloadAction<ProductType>) => {
          state.loading = false;
          state.product = action.payload;
        }
      )
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;