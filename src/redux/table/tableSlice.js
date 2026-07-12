import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

// GET TABLES
export const getTables =
  createAsyncThunk(
    "tables/getAll",

    async (_, thunkAPI) => {
      try {
        const response =
          await axiosInstance.get(
            "/tables"
          );

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

// CREATE TABLE
export const createTable =
  createAsyncThunk(
    "tables/create",

    async (tableData, thunkAPI) => {
      try {
        const response =
          await axiosInstance.post(
            "/tables/create",
            tableData
          );

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

// DELETE TABLE
export const deleteTable =
  createAsyncThunk(
    "tables/delete",

    async (id, thunkAPI) => {
      try {
        await axiosInstance.delete(`/tables/${id}`);
        return id;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || "Failed to delete table."
        );
      }
    }
  );

const tableSlice = createSlice({
  name: "tables",

  initialState: {
    tables: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        getTables.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getTables.fulfilled,
        (state, action) => {
          state.loading = false;
          state.tables =
            action.payload;
        }
      )

      .addCase(
        getTables.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      .addCase(
        createTable.fulfilled,
        (state, action) => {
          state.tables.push(
            action.payload
          );
        }
      )

      .addCase(
        deleteTable.fulfilled,
        (state, action) => {
          state.tables =
            state.tables.filter(
              (table) => table._id !== action.payload
            );
        }
      );
  },
});

export default tableSlice.reducer;