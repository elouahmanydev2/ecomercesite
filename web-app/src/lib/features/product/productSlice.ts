import { ProductType } from "@/types/productType";
import { createSlice } from "@reduxjs/toolkit";
import {
  createProduct,
  fetchProduct,
  updateProduct,
  deleteProduct,
} from "./thunks/productThunk";

interface ProductState {
  product: ProductType | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProductState = {
  product: null,
  loading: false,
  error: null,
  success: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    clearProduct: (state) => {
      state.product = null;
    },
  },

  extraReducers: (builder) => {
    /* ==========================
       FETCH PRODUCT
    ========================== */

    builder
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })

      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch product";
      });

    /* ==========================
       CREATE PRODUCT
    ========================== */

    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.success = true;
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? "Failed to create product";
      });

    /* ==========================
       UPDATE PRODUCT
    ========================== */

    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.success = true;
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? "Failed to update product";
      });

  },
});

export const { resetProductStatus, clearProduct } = productSlice.actions;

export default productSlice.reducer;