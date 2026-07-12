import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET AVAILABLE PLANS
export const getAvailablePlans = createAsyncThunk(
  "subscription/getPlans",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/restaurants/plans");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans."
      );
    }
  }
);

// GET MY SUBSCRIPTION (Admin only — full billing details)
export const getMySubscription = createAsyncThunk(
  "subscription/getMine",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/restaurants/subscription");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription."
      );
    }
  }
);

// GET MY PLAN'S FEATURE LIST (any authenticated role — used for UI gating)
export const getMyPlanFeatures = createAsyncThunk(
  "subscription/getMyFeatures",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/restaurants/subscription/features");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch plan features."
      );
    }
  }
);

// SUBSCRIBE TO A PLAN
export const subscribeToPlan = createAsyncThunk(
  "subscription/subscribe",
  async (plan_id, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/restaurants/subscription/subscribe",
        { plan_id }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to subscribe."
      );
    }
  }
);

// CANCEL AUTO-RENEW
export const cancelSubscription = createAsyncThunk(
  "subscription/cancel",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.put("/restaurants/subscription/cancel");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to cancel subscription."
      );
    }
  }
);

// CREATE RAZORPAY ORDER FOR A PAID PLAN
export const createSubscriptionOrder = createAsyncThunk(
  "subscription/createOrder",
  async (plan_id, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/restaurants/subscription/create-order",
        { plan_id }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to start payment."
      );
    }
  }
);

// VERIFY PAYMENT AFTER RAZORPAY CHECKOUT SUCCEEDS
export const verifySubscriptionPayment = createAsyncThunk(
  "subscription/verifyPayment",
  async (paymentDetails, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/restaurants/subscription/verify-payment",
        paymentDetails
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Payment verification failed."
      );
    }
  }
);

// PAYMENT HISTORY
export const getPaymentHistory = createAsyncThunk(
  "subscription/getPaymentHistory",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/restaurants/subscription/payments");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch payment history."
      );
    }
  }
);

// Shared logic: given a populated RestaurantSubscription doc, work out
// whether it's currently usable and sync the feature list from it.
// Used so the Admin's own subscribe/cancel actions instantly reflect
// in the sidebar/route gating without a second network round-trip.
const syncFeaturesFromSubscription = (state, subscription) => {
  const usable =
    subscription &&
    ["Active", "Trial"].includes(subscription.status) &&
    (!subscription.current_period_end || new Date(subscription.current_period_end) >= new Date());

  state.myFeatures = usable && subscription.plan_id ? (subscription.plan_id.features_included || []) : [];
  state.myPlanName = subscription?.plan_id?.plan_name || null;
  state.myPlanStatus = subscription?.status || null;
  state.featuresLoaded = true;
};

const subscriptionSlice = createSlice({
  name: "subscription",

  initialState: {
    plans: [],
    mySubscription: null,
    payments: [],
    loading: false,
    subscribing: false,
    payingPlanId: null,
    error: null,

    // Feature gating — available to every role, not just Admin
    myFeatures: [],
    myPlanName: null,
    myPlanStatus: null,
    featuresLoading: false,
    featuresLoaded: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAvailablePlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailablePlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getAvailablePlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMySubscription.fulfilled, (state, action) => {
        state.mySubscription = action.payload;
        syncFeaturesFromSubscription(state, action.payload);
      })

      // Feature list — any role
      .addCase(getMyPlanFeatures.pending, (state) => {
        state.featuresLoading = true;
      })
      .addCase(getMyPlanFeatures.fulfilled, (state, action) => {
        state.featuresLoading = false;
        state.featuresLoaded = true;
        state.myFeatures = action.payload.features_included || [];
        state.myPlanName = action.payload.plan_name;
        state.myPlanStatus = action.payload.status;
      })
      .addCase(getMyPlanFeatures.rejected, (state) => {
        state.featuresLoading = false;
        // Mark loaded even on failure so gated routes don't hang forever
        // waiting for a response that isn't coming.
        state.featuresLoaded = true;
        state.myFeatures = [];
      })

      .addCase(subscribeToPlan.pending, (state) => {
        state.subscribing = true;
      })
      .addCase(subscribeToPlan.fulfilled, (state, action) => {
        state.subscribing = false;
        state.mySubscription = action.payload;
        syncFeaturesFromSubscription(state, action.payload);
      })
      .addCase(subscribeToPlan.rejected, (state, action) => {
        state.subscribing = false;
        state.error = action.payload;
      })

      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.mySubscription = action.payload;
        syncFeaturesFromSubscription(state, action.payload);
      })

      .addCase(createSubscriptionOrder.pending, (state, action) => {
        state.payingPlanId = action.meta.arg;
        state.error = null;
      })
      .addCase(createSubscriptionOrder.rejected, (state, action) => {
        state.payingPlanId = null;
        state.error = action.payload;
      })

      .addCase(verifySubscriptionPayment.fulfilled, (state, action) => {
        state.payingPlanId = null;
        state.mySubscription = action.payload;
        syncFeaturesFromSubscription(state, action.payload);
      })
      .addCase(verifySubscriptionPayment.rejected, (state, action) => {
        state.payingPlanId = null;
        state.error = action.payload;
      })

      .addCase(getPaymentHistory.fulfilled, (state, action) => {
        state.payments = action.payload;
      });
  },
});

export default subscriptionSlice.reducer;