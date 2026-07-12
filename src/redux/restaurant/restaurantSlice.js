import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";


// ---- PROFILE ----

export const getRestaurantProfile = createAsyncThunk(
  "restaurant/getProfile",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/restaurants/profile");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch restaurant."
      );
    }
  }
);

export const createRestaurant = createAsyncThunk(
  "restaurant/create",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/restaurants/create", data);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create restaurant."
      );
    }
  }
);

export const updateRestaurant = createAsyncThunk(
  "restaurant/update",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/restaurants/update", data);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update restaurant."
      );
    }
  }
);

export const uploadRestaurantLogo = createAsyncThunk(
  "restaurant/uploadLogo",
  async (file, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("logo", file);

      const res = await axiosInstance.post("/restaurants/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to upload logo."
      );
    }
  }
);

// ---- OPERATIONS SETTINGS ----

export const getRestaurantSettings = createAsyncThunk(
  "restaurant/getSettings",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/restaurants/settings");
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings."
      );
    }
  }
);

export const updateRestaurantSettings = createAsyncThunk(
  "restaurant/updateSettings",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/restaurants/settings", data);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update settings."
      );
    }
  }
);

const restaurantSlice = createSlice({
  name: "restaurant",

  initialState: {
    profile: null,
    settings: null,
    loading: false,
    settingsLoading: false,
    actionLoading: false,
    checked: false,
    error: null,
  },

  reducers: {
    clearRestaurantError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // profile
      .addCase(getRestaurantProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRestaurantProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.profile = action.payload;
      })
      .addCase(getRestaurantProfile.rejected, (state, action) => {
        state.loading = false;
        state.checked = true;
        state.profile = null;
        state.error = action.payload;
      })

      .addCase(createRestaurant.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createRestaurant.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = action.payload;
      })
      .addCase(createRestaurant.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateRestaurant.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateRestaurant.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateRestaurant.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(uploadRestaurantLogo.fulfilled, (state, action) => {
        state.profile = action.payload;
      })

      // settings
      .addCase(getRestaurantSettings.pending, (state) => {
        state.settingsLoading = true;
      })
      .addCase(getRestaurantSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload;
      })
      .addCase(getRestaurantSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.error = action.payload;
      })

      .addCase(updateRestaurantSettings.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateRestaurantSettings.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.settings = action.payload;
      })
      .addCase(updateRestaurantSettings.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRestaurantError } = restaurantSlice.actions;

export default restaurantSlice.reducer;