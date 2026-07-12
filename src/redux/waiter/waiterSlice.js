import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/*
=========================================================
ASYNC THUNKS
=========================================================
*/

export const fetchWaiterTables = createAsyncThunk(
    "waiter/fetchTables",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/tables");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch tables.");
        }
    }
);

export const fetchWaiterOrders = createAsyncThunk(
    "waiter/fetchOrders",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/orders", { params });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch orders.");
        }
    }
);

export const createWaiterOrder = createAsyncThunk(
    "waiter/createOrder",
    async (orderPayload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/orders/create", orderPayload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to create order.");
        }
    }
);

export const updateOrderItemStatus = createAsyncThunk(
    "waiter/updateOrderItemStatus",
    async ({ orderId, itemId, status }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/orders/${orderId}/items/${itemId}`, { status });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update item status.");
        }
    }
);

export const markOrderServed = createAsyncThunk(
    "waiter/markOrderServed",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/orders/${orderId}/serve`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to mark order served.");
        }
    }
);

export const requestBillForTable = createAsyncThunk(
    "waiter/requestBill",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/orders/${orderId}/request-bill`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to request bill.");
        }
    }
);

/*
=========================================================
SLICE
=========================================================
*/

const initialState = {
    tables: [],
    orders: [],
    activeOrder: null,
    loading: false,
    actionLoading: false,
    error: null
};

const waiterSlice = createSlice({
    name: "waiter",
    initialState,
    reducers: {
        setActiveOrder: (state, action) => {
            state.activeOrder = action.payload;
        },
        clearWaiterError: (state) => {
            state.error = null;
        },
        // Optimistic local table status update (e.g. before server confirms)
        setTableStatusLocal: (state, action) => {
            const { tableId, status } = action.payload;
            const table = state.tables.find((t) => t._id === tableId);
            if (table) table.status = status;
        }
    },
    extraReducers: (builder) => {
        builder

            // Tables
            .addCase(fetchWaiterTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWaiterTables.fulfilled, (state, action) => {
                state.loading = false;
                state.tables = action.payload;
            })
            .addCase(fetchWaiterTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Orders
            .addCase(fetchWaiterOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWaiterOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders || action.payload;
            })
            .addCase(fetchWaiterOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create order
            .addCase(createWaiterOrder.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(createWaiterOrder.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.orders.unshift(action.payload);
            })
            .addCase(createWaiterOrder.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Update item status
            .addCase(updateOrderItemStatus.fulfilled, (state, action) => {
                const idx = state.orders.findIndex((o) => o._id === action.payload._id);
                if (idx !== -1) state.orders[idx] = action.payload;
            })

            // Mark served
            .addCase(markOrderServed.fulfilled, (state, action) => {
                const idx = state.orders.findIndex((o) => o._id === action.payload._id);
                if (idx !== -1) state.orders[idx] = action.payload;
            })

            // Request bill
            .addCase(requestBillForTable.fulfilled, (state, action) => {
                const idx = state.orders.findIndex((o) => o._id === action.payload._id);
                if (idx !== -1) state.orders[idx] = action.payload;
            });
    }
});

export const { setActiveOrder, clearWaiterError, setTableStatusLocal } = waiterSlice.actions;

export default waiterSlice.reducer;