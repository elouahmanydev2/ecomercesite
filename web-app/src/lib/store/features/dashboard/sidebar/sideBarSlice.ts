import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface State {
  newOrdersCount: number;
  pending: boolean;
  error: string | null;
}

const initialState: State = {
  newOrdersCount: 0,
  pending: false,
  error: null,
};

// ==========================================
// FETCH NEW ORDERS COUNT
// ==========================================
export const fetchNewOrderCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>(
  "sidebar/fetchNewOrderCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "/api/dashboard/new-orders-count"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch new orders count");
      }

      const data = await response.json();

      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    }
  }
);

// ==========================================
// SIDEBAR SLICE
// ==========================================
const sideBarSlice = createSlice({
  name: "sidebar",
  initialState,

  reducers: {
    resetNewOrdersCount(state) {
      state.newOrdersCount = 0;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // PENDING
      // ==========================
      .addCase(
        fetchNewOrderCount.pending,
        (state) => {
          state.pending = true;
          state.error = null;
        }
      )

      // ==========================
      // SUCCESS
      // ==========================
      .addCase(
        fetchNewOrderCount.fulfilled,
        (state, action) => {
          state.pending = false;
          state.newOrdersCount = action.payload;
          state.error = null;
        }
      )

      // ==========================
      // ERROR
      // ==========================
      .addCase(
        fetchNewOrderCount.rejected,
        (state, action) => {
          state.pending = false;
          state.error =
            action.payload ?? "Failed to fetch new orders count";
        }
      );
  },
});

export const {
  resetNewOrdersCount,
} = sideBarSlice.actions;

export default sideBarSlice.reducer;