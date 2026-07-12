import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import superAdminAxiosInstance from "../../api/superAdminAxiosInstance";

// LIST RESTAURANTS (search + status filter + pagination)
export const getAllRestaurants = createAsyncThunk(
  "superAdminRestaurants/getAll",
  async (params = {}, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get("/restaurants", {
        params,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch restaurants."
      );
    }
  }
);

// SINGLE RESTAURANT DETAIL
export const getRestaurantDetail = createAsyncThunk(
  "superAdminRestaurants/getOne",
  async (id, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get(`/restaurants/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch restaurant."
      );
    }
  }
);

// RESTAURANT REPORT SUMMARY (read-only sales snapshot)
export const getRestaurantReport = createAsyncThunk(
  "superAdminRestaurants/getReport",
  async ({ id, params = {} }, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get(
        `/restaurants/${id}/report`,
        { params }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch report."
      );
    }
  }
);

// PLATFORM ACTIVITY LOG
export const getActivityLog = createAsyncThunk(
  "superAdminRestaurants/getActivityLog",
  async (params = {}, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get("/activity-log", {
        params,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity log."
      );
    }
  }
);

const superAdminRestaurantSlice = createSlice({
  name: "superAdminRestaurants",

  initialState: {
    restaurants: [],
    pagination: null,
    selectedRestaurant: null,
    report: null,
    activityLogs: [],
    activityPagination: null,
    loading: false,
    reportLoading: false,
    error: null,
  },

  reducers: {
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
      state.report = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.restaurants;
        state.pagination = action.payload.pagination;
      })
      .addCase(getAllRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRestaurantDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRestaurantDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRestaurant = action.payload;
      })
      .addCase(getRestaurantDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRestaurantReport.pending, (state) => {
        state.reportLoading = true;
      })
      .addCase(getRestaurantReport.fulfilled, (state, action) => {
        state.reportLoading = false;
        state.report = action.payload;
      })
      .addCase(getRestaurantReport.rejected, (state) => {
        state.reportLoading = false;
      })

      .addCase(getActivityLog.fulfilled, (state, action) => {
        state.activityLogs = action.payload.logs;
        state.activityPagination = action.payload.pagination;
      });
  },
});

export const { clearSelectedRestaurant } = superAdminRestaurantSlice.actions;

export default superAdminRestaurantSlice.reducer;