import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isCartOpen: boolean;
  page:number;
}

const initialState: UIState = {
  isCartOpen: false,
  page:1
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCart: state => { state.isCartOpen = true },
    closeCart: state => { state.isCartOpen = false },
     setPage(state,action:PayloadAction<number>){
            state.page = action.payload
    }
   
  },
});

export const { openCart, closeCart , setPage} = uiSlice.actions;
export default uiSlice.reducer;