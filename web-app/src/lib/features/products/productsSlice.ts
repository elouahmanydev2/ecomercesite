import { ProductType } from "@/types/productType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts } from "./thunks/productsThunks";

interface State {
    products:ProductType[];
    pending:boolean;
    error:string | null
}

const initialState:State ={
    products: [],
    pending: false,
    error: null
}
const productsSlice =createSlice({
    name: "products",
    initialState,
    reducers:{},
    extraReducers(builder) {
        builder
        // --- Fetch Products ---
      .addCase(fetchProducts.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
        state.pending = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload || 'Failed to load products';
      })
    },
})

export default productsSlice.reducer;