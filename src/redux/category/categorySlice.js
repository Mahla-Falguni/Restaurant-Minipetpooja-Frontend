import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

// GET ALL CATEGORIES
export const getCategories =
  createAsyncThunk(
    "categories/getAll",

    async (_, thunkAPI) => {
      try {
        const response = await axiosInstance.get("/categories");

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

// CREATE CATEGORY
export const createCategory = createAsyncThunk("categories/create", async (data, thunkAPI) => {
  try {

    const response = await axiosInstance.post("/categories/create", data);

    return response.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response.data.message
    );
  }
}
);

// DELETE CATEGORY
export const deleteCategory = createAsyncThunk("categories/delete", async (id, thunkAPI) => {
  try {
    await axiosInstance.delete(`/categories/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Failed to delete category."
    );
  }
}
);

const categorySlice = createSlice({
  name: "categories",

  initialState: {
    categories: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        getCategories.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        getCategories.fulfilled,
        (state, action) => {
          state.loading = false;
          state.categories =
            action.payload;
        }
      )

      .addCase(
        getCategories.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload;
        }
      )

      .addCase(
        createCategory.fulfilled,
        (state, action) => {
          state.categories.push(
            action.payload
          );
        }
      )

      .addCase(
        deleteCategory.fulfilled,
        (state, action) => {
          state.categories =
            state.categories.filter(
              (cat) => cat._id !== action.payload
            );
        }
      );
  },
});

export default categorySlice.reducer;