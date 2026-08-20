import { ProductType } from "@/types/productType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts } from "./thunks/productsThunk";

interface ProductsState {
  products: ProductType[];
  pending: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  pending: false,
  error: null,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<ProductType[]>) => {
          state.pending = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload || "An unexpected error occurred";
      });
  },
});

export default productsSlice.reducer;