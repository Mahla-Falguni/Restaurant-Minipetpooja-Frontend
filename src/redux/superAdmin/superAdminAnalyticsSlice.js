import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import superAdminAxiosInstance from "../../api/superAdminAxiosInstance";

// PLATFORM-WIDE OVERVIEW
export const getPlatformOverview = createAsyncThunk(
  "superAdminAnalytics/getOverview",
  async (_, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get("/analytics/overview");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch platform overview."
      );
    }
  }
);

// SUBSCRIPTIONS EXPIRING SOON
export const getExpiringSubscriptions = createAsyncThunk(
  "superAdminAnalytics/getExpiring",
  async (days = 7, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get(
        "/subscriptions/expiring",
        { params: { days } }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch expiring subscriptions."
      );
    }
  }
);

const superAdminAnalyticsSlice = createSlice({
  name: "superAdminAnalytics",

  initialState: {
    overview: null,
    expiring: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getPlatformOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlatformOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(getPlatformOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getExpiringSubscriptions.fulfilled, (state, action) => {
        state.expiring = action.payload;
      });
  },
});

export default superAdminAnalyticsSlice.reducer;