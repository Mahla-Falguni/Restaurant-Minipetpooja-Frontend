import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";

import axiosInstance from "../../api/axiosInstance";

// GET DASHBOARD OVERVIEW (shape depends on the logged-in user's role)
export const getDashboardOverview =
    createAsyncThunk("dashboard/getOverview",

        async (_, thunkAPI) => {
            try {
                const response = await axiosInstance.get("/dashboard/overview");

                return response.data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message || "Failed to load dashboard."
                );
            }
        }
    );

const dashboardSlice = createSlice({
    name: "dashboard",

    initialState: {
        overview: null,
        loading: false,
        error: null,
        lastFetchedAt: null,
    },

    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(
                getDashboardOverview.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getDashboardOverview.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.overview = action.payload;
                    state.lastFetchedAt = Date.now();
                }
            )

            .addCase(
                getDashboardOverview.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;