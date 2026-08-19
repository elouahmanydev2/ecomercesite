import { AnalyticsResponse } from "@/types/analytics";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAnalyticsData = createAsyncThunk<
  AnalyticsResponse,
  string,
  { rejectValue: string }
>("analytics/fetchData", async (range, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/dashboard/analytics?range=${range}`);
    if (!response.ok) {
      const err = await response.json();
      return rejectWithValue(err.error || "Failed to fetch analytics");
    }
    return (await response.json()) as AnalyticsResponse;
  } catch (error: any) {
    return rejectWithValue(error.message || "Network error");
  }
});