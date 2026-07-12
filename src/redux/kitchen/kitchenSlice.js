import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getKitchenOrders, getKitchenDashboard, acceptOrder, startPreparing, markReady, serveOrder, completeOrder, rejectOrder } from "../../services/kitchenApi";


// ============================
export const fetchKitchenOrders =
    createAsyncThunk(
        "kitchen/fetchOrders",
        async (params, thunkAPI) => {
            try {
                const res = await getKitchenOrders(params);
                return res.data.data.orders;
            }

            catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                    "Unable to fetch orders"
                );
            }
        }
    );


// ============================
export const fetchKitchenDashboard =
    createAsyncThunk("kitchen/dashboard",
        async (_, thunkAPI) => {
            try {
                const res = await getKitchenDashboard();
                return res.data.data;
            }

            catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message ||
                    "Dashboard Error"
                );
            }
        }
    );


// ============================
export const acceptKitchenOrder =
    createAsyncThunk("kitchen/accept",
        async (id, thunkAPI) => {
            try {
                const res = await acceptOrder(id);
                thunkAPI.dispatch(fetchKitchenOrders());
                return res.data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message || "Unable to accept order"
                );
            }
        }
    );


// ============================
export const preparingKitchenOrder =
    createAsyncThunk("kitchen/preparing",
        async (id, thunkAPI) => {
            try {
                const res = await startPreparing(id);
                thunkAPI.dispatch(fetchKitchenOrders());
                return res.data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message || "Unable to update order"
                );
            }
        }
    );


// ============================
export const readyKitchenOrder =
    createAsyncThunk("kitchen/ready",
        async (id, thunkAPI) => {
            try {
                const res = await markReady(id);
                thunkAPI.dispatch(fetchKitchenOrders());
                return res.data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message || "Unable to update order"
                );
            }
        }
    );


// ============================
export const serveKitchenOrder =
    createAsyncThunk("kitchen/serve",
        async (id, thunkAPI) => {
            try {
                const res = await serveOrder(id);
                thunkAPI.dispatch(fetchKitchenOrders());
                return res.data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message || "Unable to update order"
                );
            }
        }
    );


// ============================
export const completeKitchenOrder =
    createAsyncThunk("kitchen/complete",
        async (id, thunkAPI) => {
            try {
                const res = await completeOrder(id);
                thunkAPI.dispatch(fetchKitchenOrders());
                return res.data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message || "Unable to update order"
                );
            }
        }
    );


// ============================
// NOTE: this thunk used to be declared TWICE in this file — the second
// copy called `axios` directly (never imported, would throw
// "axios is not defined") and hit a URL that didn't match kitchenRoutes.js.
// Removed the duplicate and kept the version consistent with the others.
export const rejectKitchenOrder =
    createAsyncThunk("kitchen/reject",
        async ({ id, reason }, thunkAPI) => {
            try {
                const res = await rejectOrder(id, reason);
                thunkAPI.dispatch(fetchKitchenOrders());
                return res.data.data;
            } catch (error) {
                return thunkAPI.rejectWithValue(
                    error.response?.data?.message || "Unable to reject order"
                );
            }
        }
    );


// ============================
const kitchenSlice =
    createSlice({
        name: "kitchen",
        initialState: {
            orders: [],
            dashboard: {},
            loading: false,
            actionLoading: false,
            error: null
        },

        reducers: {
            addOrder: (state, action) => {
                state.orders.unshift(
                    action.payload
                );
            },

            updateOrder: (state, action) => {
                const updated =
                    action.payload;
                state.orders =
                    state.orders.map(
                        order =>
                            order._id === updated._id
                                ? updated
                                : order
                    );
            },

            removeOrder: (state, action) => {
                state.orders =
                    state.orders.filter(
                        order =>
                            order._id !== action.payload
                    );
            }
        },

        extraReducers: (builder) => {
            builder.addCase(
                fetchKitchenOrders.pending,
                (state) => {
                    state.loading = true;
                }
            )

                .addCase(
                    fetchKitchenOrders.fulfilled,
                    (state, action) => {
                        state.loading = false;
                        state.orders =
                            action.payload;
                    }
                )

                .addCase(
                    fetchKitchenOrders.rejected,
                    (state, action) => {
                        state.loading = false;
                        state.error =
                            action.payload;
                    }
                )

                .addCase(
                    fetchKitchenDashboard.fulfilled,
                    (state, action) => {
                        state.dashboard =
                            action.payload;
                    }
                )

                .addMatcher(
                    (action) =>
                        action.type.startsWith("kitchen/") &&
                        ["accept", "preparing", "ready", "serve", "complete", "reject"]
                            .some((verb) => action.type.includes(verb)) &&
                        action.type.endsWith("/pending"),
                    (state) => {
                        state.actionLoading = true;
                    }
                )

                .addMatcher(
                    (action) =>
                        action.type.startsWith("kitchen/") &&
                        ["accept", "preparing", "ready", "serve", "complete", "reject"]
                            .some((verb) => action.type.includes(verb)) &&
                        (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")),
                    (state, action) => {
                        state.actionLoading = false;
                        if (action.type.endsWith("/rejected")) {
                            state.error = action.payload;
                        }
                    }
                );
        }
    });


export const { addOrder, updateOrder, removeOrder } = kitchenSlice.actions;


export default kitchenSlice.reducer;