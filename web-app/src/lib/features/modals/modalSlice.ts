import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    isProductModalOpen:boolean;

}
const initialState:State = {
    isProductModalOpen: false
}
const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers:{
        setProductModal (state,action:PayloadAction<boolean>){
            state.isProductModalOpen = action.payload
        }
    }
})

export const {setProductModal} =modalSlice.actions
export default  modalSlice.reducer;