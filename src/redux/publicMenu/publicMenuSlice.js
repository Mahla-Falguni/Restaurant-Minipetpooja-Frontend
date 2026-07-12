import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET /api/public/table/:tableCode — resolves the QR code to a table + restaurant
export const getTableInfo = createAsyncThunk(
  "publicMenu/getTableInfo",
  async (tableCode, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/public/table/${tableCode}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "This QR code isn't valid."
      );
    }
  }
);

// GET /api/public/menu/:restaurantId — categories with nested available items
export const getPublicMenu = createAsyncThunk(
  "publicMenu/getMenu",
  async (restaurantId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/public/menu/${restaurantId}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load the menu."
      );
    }
  }
);

// POST /api/public/orders — same handler as the authenticated create-order route
export const placeOrder = createAsyncThunk(
  "publicMenu/placeOrder",
  async (orderData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/public/orders", orderData);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to place order."
      );
    }
  }
);

const publicMenuSlice = createSlice({
  name: "publicMenu",

  initialState: {
    table: null,
    restaurant: null,
    menu: [],
    loading: true,
    error: null,
    placingOrder: false,
    placedOrder: null,
    orderError: null,
  },

  reducers: {
    resetPlacedOrder: (state) => {
      state.placedOrder = null;
      state.orderError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getTableInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTableInfo.fulfilled, (state, action) => {
        state.table = action.payload.table;
        state.restaurant = action.payload.restaurant;
      })
      .addCase(getTableInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPublicMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.menu = action.payload;
      })
      .addCase(getPublicMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.orderError = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.placedOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.orderError = action.payload;
      });
  },
});

export const { resetPlacedOrder } = publicMenuSlice.actions;

export default publicMenuSlice.reducer;