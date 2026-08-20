import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { signInEmail, signOutUser, signUpEmail } from "./authThunks";
import { AuthResponseType } from "@/types/(auth)/authTypes";

interface AuthState {
  user: AuthResponseType | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    /* ---------------------------------------------------------------------- */
    /*                                 SIGN UP                                */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(signUpEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUpEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to sign up";
      });

    /* ---------------------------------------------------------------------- */
    /*                                 SIGN IN                                */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(signInEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signInEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??
          "Failed to sign in";
      });

    /* ---------------------------------------------------------------------- */
    /*                                SIGN OUT                                */
    /* ---------------------------------------------------------------------- */

    builder
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ??
          action.error.message ??           
          "Failed to sign out";
      });
  },
});


export default authSlice.reducer;