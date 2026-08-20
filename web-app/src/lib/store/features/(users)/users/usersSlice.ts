import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { BanType, UserType } from "@/types/usersType";
import { banUser, deleteUser, fetchUsers, unbanUser, updateUserRole } from "./thunks/usersThunks";


interface UsersState {
  users: UserType[];
  OpenUserMenu:string |null ;
  banModal:BanType | null;
  total: number;
  loading: boolean;
  confirmDelete:string | null;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  OpenUserMenu: null,
  total: 0,
  loading: false,
  confirmDelete: null,
  banModal: null,
  error: null
};

// ── Slice ───────────────────────────────────────────────────────────────────

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setConfirmDelete(state, action:PayloadAction<string|null>){
      state.confirmDelete = action.payload
    },
    setBanModal(state , action:PayloadAction<BanType | null>){
      state.banModal = action.payload
    },
    setOpenUserMenu(state , action:PayloadAction<string | null>){
            state.OpenUserMenu = action.payload
     }
  },
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Unknown error";
    });

    // delete
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      state.total -= 1;
    });

    // update role
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) user.role = action.payload.role;
    });

    // ban
    builder.addCase(banUser.fulfilled, (state, action) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) user.banned = true;
    });

    // unban
    builder.addCase(unbanUser.fulfilled, (state, action) => {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) { user.banned = false; user.banReason = null; }
    });
  },
});
export const {setConfirmDelete,setBanModal,setOpenUserMenu} = usersSlice.actions;
export default usersSlice.reducer;