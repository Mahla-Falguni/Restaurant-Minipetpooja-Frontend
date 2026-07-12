import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET CUSTOMERS (search + pagination)
export const getCustomers = createAsyncThunk(
  "customers/getAll",
  async (params = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/customer/list", { params });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers."
      );
    }
  }
);

// CREATE CUSTOMER
export const createCustomer = createAsyncThunk(
  "customers/create",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/customer/create", data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create customer."
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customers",

  initialState: {
    customers: [],
    pagination: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = action.payload.pagination;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      });
  },
});

export default customerSlice.reducer;