import { ProductType } from "@/types/productType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProducts } from "./thunks/productsThunks";
import { deleteProduct } from "../product/thunks/productThunk";

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
      //delete a Product
      .addCase(deleteProduct.pending ,(state)=>{
        state.pending =true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled,(state,action:PayloadAction<string>)=>{
        state.pending = true;
        state.products = state.products.filter(p => p.id === action.payload) 
      })
     .addCase(deleteProduct.rejected, (state, action) => {
    state.pending = false;
    state.error = action.payload as string;
  });
    },
})

export default productsSlice.reducer;