import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

// GET ALL ORDERS (staff view)
export const getOrders =
  createAsyncThunk(
    "orders/getAll",

    async (_, thunkAPI) => {
      try {
        const response =
          await axiosInstance.get(
            "/orders"
          );

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to fetch orders."
        );
      }
    }
  );

// GET SINGLE ORDER
export const getOrderById =
  createAsyncThunk(
    "orders/getById",

    async (orderId, thunkAPI) => {
      try {
        const response =
          await axiosInstance.get(
            `/orders/${orderId}`
          );

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to fetch order."
        );
      }
    }
  );

// CREATE ORDER (customer/QR flow)
export const createOrder =
  createAsyncThunk(
    "orders/create",

    async (orderData, thunkAPI) => {
      try {
        const response =
          await axiosInstance.post(
            "/orders/create",
            orderData
          );

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to create order."
        );
      }
    }
  );

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    activeOrder: null,
    loading: false,
    detailLoading: false,
    error: null,
  },

  reducers: {
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        getOrders.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getOrders.fulfilled,
        (state, action) => {
          state.loading = false;
          state.orders =
            action.payload;
        }
      )

      .addCase(
        getOrders.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        getOrderById.pending,
        (state) => {
          state.detailLoading = true;
          state.error = null;
        }
      )

      .addCase(
        getOrderById.fulfilled,
        (state, action) => {
          state.detailLoading = false;
          state.activeOrder = action.payload;
        }
      )

      .addCase(
        getOrderById.rejected,
        (state, action) => {
          state.detailLoading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        createOrder.fulfilled,
        (state, action) => {
          state.orders.unshift(
            action.payload
          );
        }
      );
  },
});

export const { clearActiveOrder } = orderSlice.actions;

export default orderSlice.reducer;