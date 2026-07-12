import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

// GET FEEDBACKS
export const getFeedbacks =
  createAsyncThunk("feedback/getAll",

    async (_, thunkAPI) => {
      try {
        const response = await axiosInstance.get("/feedback");

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

// CREATE FEEDBACK
export const createFeedback =
  createAsyncThunk("feedback/create",

    async (data, thunkAPI) => {
      try {
        const response =
          await axiosInstance.post("/feedback/create", data);

        return response.data.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

const feedbackSlice = createSlice({
  name: "feedback",

  initialState: {
    feedbacks: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(
        getFeedbacks.fulfilled,
        (state, action) => {
          state.feedbacks =
            action.payload;
        }
      )

      .addCase(
        createFeedback.fulfilled,
        (state, action) => {
          state.feedbacks.unshift(
            action.payload
          );
        }
      );
  },
});

export default feedbackSlice.reducer;