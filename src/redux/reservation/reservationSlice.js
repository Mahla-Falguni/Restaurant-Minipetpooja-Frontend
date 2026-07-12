import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET TODAY'S RESERVATIONS
export const getTodaysReservations = createAsyncThunk(
  "reservations/getToday",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/reservations/today");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch reservations."
      );
    }
  }
);

// CREATE RESERVATION
export const createReservation = createAsyncThunk(
  "reservations/create",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/reservations", data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create reservation."
      );
    }
  }
);

// STATUS TRANSITIONS
const makeStatusThunk = (name, path) =>
  createAsyncThunk(`reservations/${name}`, async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/reservations/${id}/${path}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || `Failed to ${name} reservation.`
      );
    }
  });

export const confirmReservation = makeStatusThunk("confirm", "confirm");
export const seatReservation = makeStatusThunk("seat", "seat");
export const completeReservation = makeStatusThunk("complete", "complete");
export const cancelReservation = makeStatusThunk("cancel", "cancel");
export const markNoShowReservation = makeStatusThunk("noShow", "no-show");

const upsert = (state, action) => {
  state.reservations = state.reservations.map((r) =>
    r._id === action.payload._id ? action.payload : r
  );
};

const reservationSlice = createSlice({
  name: "reservations",

  initialState: {
    reservations: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getTodaysReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTodaysReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload;
      })
      .addCase(getTodaysReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.reservations.unshift(action.payload);
      })
      .addCase(confirmReservation.fulfilled, upsert)
      .addCase(seatReservation.fulfilled, upsert)
      .addCase(completeReservation.fulfilled, upsert)
      .addCase(cancelReservation.fulfilled, upsert)
      .addCase(markNoShowReservation.fulfilled, upsert);
  },
});

export default reservationSlice.reducer;