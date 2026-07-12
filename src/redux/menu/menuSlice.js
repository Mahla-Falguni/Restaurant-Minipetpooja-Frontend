import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

// GET MENU ITEMS
export const getMenuItems =
  createAsyncThunk(
    "menu/getAll",

    async (_, thunkAPI) => {
      try {
        const response =
          await axiosInstance.get(
            "/menu"
          );

        return response.data.data.menuItems;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

// CREATE MENU ITEM
export const createMenuItem =
  createAsyncThunk(
    "menu/create",

    async (formData, thunkAPI) => {
      try {
        const response =
          await axiosInstance.post(
            "/menu/create",
            formData
          );

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

// DELETE MENU ITEM
export const deleteMenuItem =
  createAsyncThunk(
    "menu/delete",

    async (id, thunkAPI) => {
      try {
        await axiosInstance.delete(`/menu/${id}`);
        return id;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to delete item."
        );
      }
    }
  );

// TOGGLE AVAILABILITY
export const toggleMenuAvailability =
  createAsyncThunk(
    "menu/toggleAvailability",

    async (id, thunkAPI) => {
      try {
        const response =
          await axiosInstance.patch(`/menu/availability/${id}`);

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to update item."
        );
      }
    }
  );

const menuSlice = createSlice({
  name: "menu",

  initialState: {
    menuItems: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        getMenuItems.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getMenuItems.fulfilled,
        (state, action) => {
          state.loading = false;
          state.menuItems =
            action.payload;
        }
      )

      .addCase(
        getMenuItems.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        createMenuItem.fulfilled,
        (state, action) => {
          state.menuItems.push(
            action.payload
          );
        }
      )

      .addCase(
        deleteMenuItem.fulfilled,
        (state, action) => {
          state.menuItems =
            state.menuItems.filter(
              (item) => item._id !== action.payload
            );
        }
      )

      .addCase(
        toggleMenuAvailability.fulfilled,
        (state, action) => {
          state.menuItems =
            state.menuItems.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
        }
      );
  },
});

export default menuSlice.reducer;