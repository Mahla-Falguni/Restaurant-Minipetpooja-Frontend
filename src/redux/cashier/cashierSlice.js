import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

/*
=========================================================
ASYNC THUNKS
=========================================================
*/

export const fetchCashierDashboard = createAsyncThunk(
    "cashier/fetchDashboard",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/cashier/dashboard");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to load dashboard.");
        }
    }
);

export const checkoutOrder = createAsyncThunk(
    "cashier/checkoutOrder",
    async ({ order_id, additional_discount = 0, round_off = true }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cashier/checkout", {
                order_id,
                additional_discount,
                round_off
            });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to finalize bill.");
        }
    }
);

export const addPayment = createAsyncThunk(
    "cashier/addPayment",
    async ({ order_id, payments }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cashier/add-payment", { order_id, payments });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to record payment.");
        }
    }
);

export const fetchInvoice = createAsyncThunk(
    "cashier/fetchInvoice",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get(`/cashier/invoice/${orderId}`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch invoice.");
        }
    }
);

// --- Refunds ---

export const requestRefund = createAsyncThunk(
    "cashier/requestRefund",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cashier/refund/request", payload);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to request refund.");
        }
    }
);

export const fetchRefunds = createAsyncThunk(
    "cashier/fetchRefunds",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/cashier/refunds", { params });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch refunds.");
        }
    }
);

export const approveRefund = createAsyncThunk(
    "cashier/approveRefund",
    async (refundId, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/cashier/refund/${refundId}/approve`);
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to approve refund.");
        }
    }
);

export const rejectRefund = createAsyncThunk(
    "cashier/rejectRefund",
    async ({ refundId, rejected_reason }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/cashier/refund/${refundId}/reject`, { rejected_reason });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to reject refund.");
        }
    }
);

export const completeRefund = createAsyncThunk(
    "cashier/completeRefund",
    async ({ refundId, transaction_reference }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.put(`/cashier/refund/${refundId}/complete`, { transaction_reference });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to complete refund.");
        }
    }
);

// --- Cash Drawer ---

export const fetchDrawerStatus = createAsyncThunk(
    "cashier/fetchDrawerStatus",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/cashier/drawer/status");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch drawer status.");
        }
    }
);

export const openDrawer = createAsyncThunk(
    "cashier/openDrawer",
    async ({ opening_balance, shift }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cashier/drawer/open", { opening_balance, shift });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to open drawer.");
        }
    }
);

export const recordCashPaidOut = createAsyncThunk(
    "cashier/recordCashPaidOut",
    async ({ amount, notes }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cashier/drawer/paid-out", { amount, notes });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to record cash paid out.");
        }
    }
);

export const closeDrawer = createAsyncThunk(
    "cashier/closeDrawer",
    async ({ actual_cash, notes }, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/cashier/drawer/close", { actual_cash, notes });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to close drawer.");
        }
    }
);

export const fetchDrawerHistory = createAsyncThunk(
    "cashier/fetchDrawerHistory",
    async (params = {}, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/cashier/drawer/history", { params });
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch drawer history.");
        }
    }
);

/*
=========================================================
SLICE
=========================================================
*/

const initialState = {
    dashboard: null,
    activeInvoice: null,
    checkoutResult: null,
    refunds: [],
    drawer: null,
    drawerHistory: [],
    loading: false,
    actionLoading: false,
    error: null
};

const cashierSlice = createSlice({
    name: "cashier",
    initialState,
    reducers: {
        clearCashierError: (state) => {
            state.error = null;
        },
        clearCheckoutResult: (state) => {
            state.checkoutResult = null;
        },
        clearActiveInvoice: (state) => {
            state.activeInvoice = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // Dashboard
            .addCase(fetchCashierDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCashierDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
                state.drawer = action.payload.drawer || null;
            })
            .addCase(fetchCashierDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Checkout
            .addCase(checkoutOrder.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(checkoutOrder.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.checkoutResult = action.payload;
            })
            .addCase(checkoutOrder.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Add payment
            .addCase(addPayment.pending, (state) => {
                state.actionLoading = true;
                state.error = null;
            })
            .addCase(addPayment.fulfilled, (state) => {
                state.actionLoading = false;
            })
            .addCase(addPayment.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Invoice
            .addCase(fetchInvoice.fulfilled, (state, action) => {
                state.activeInvoice = action.payload;
            })

            // Refunds
            .addCase(fetchRefunds.fulfilled, (state, action) => {
                state.refunds = action.payload.refunds || action.payload;
            })
            .addCase(requestRefund.fulfilled, (state, action) => {
                state.refunds.unshift(action.payload);
            })
            .addCase(approveRefund.fulfilled, (state, action) => {
                const idx = state.refunds.findIndex((r) => r._id === action.payload._id);
                if (idx !== -1) state.refunds[idx] = action.payload;
            })
            .addCase(rejectRefund.fulfilled, (state, action) => {
                const idx = state.refunds.findIndex((r) => r._id === action.payload._id);
                if (idx !== -1) state.refunds[idx] = action.payload;
            })
            .addCase(completeRefund.fulfilled, (state, action) => {
                const idx = state.refunds.findIndex((r) => r._id === action.payload._id);
                if (idx !== -1) state.refunds[idx] = action.payload;
            })

            // Drawer
            .addCase(fetchDrawerStatus.fulfilled, (state, action) => {
                state.drawer = action.payload;
            })
            .addCase(openDrawer.fulfilled, (state, action) => {
                state.drawer = action.payload;
            })
            .addCase(closeDrawer.fulfilled, (state, action) => {
                state.drawer = action.payload;
            })
            .addCase(recordCashPaidOut.fulfilled, (state, action) => {
                state.drawer = action.payload;
            })
            .addCase(fetchDrawerHistory.fulfilled, (state, action) => {
                state.drawerHistory = action.payload.history || action.payload;
            });
    }
});

export const { clearCashierError, clearCheckoutResult, clearActiveInvoice } = cashierSlice.actions;

export default cashierSlice.reducer;