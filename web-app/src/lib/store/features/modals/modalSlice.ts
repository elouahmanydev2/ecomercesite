import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    isAddProductModalOpen:boolean;
    isEditProductModalOpen:boolean;

}
const initialState:State = {
    isAddProductModalOpen: false,
    isEditProductModalOpen: false
}
const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers:{
        setAddProductModal (state,action:PayloadAction<boolean>){
            state.isAddProductModalOpen = action.payload
        },
         setEditProductModal (state,action:PayloadAction<boolean>){
            state.isAddProductModalOpen = action.payload
        }
    }
})

export const {setAddProductModal,setEditProductModal} =modalSlice.actions
export default  modalSlice.reducer;