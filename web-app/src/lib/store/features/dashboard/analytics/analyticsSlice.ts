import { AnalyticsResponse } from "@/types/analytics";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAnalyticsData } from "./thunks/analyticsThunks";

interface AnalyticsState {
  data: AnalyticsResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  status: "idle",
  error: null,
};


const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchAnalyticsData.fulfilled,
        (state, action: PayloadAction<AnalyticsResponse>) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(fetchAnalyticsData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default analyticsSlice.reducer;