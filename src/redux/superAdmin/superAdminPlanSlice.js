import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import superAdminAxiosInstance from "../../api/superAdminAxiosInstance";

// LIST ALL PLANS (including inactive — management view)
export const getAllPlans = createAsyncThunk(
  "superAdminPlans/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get("/plans/all");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch plans."
      );
    }
  }
);

// CREATE PLAN
export const createPlan = createAsyncThunk(
  "superAdminPlans/create",
  async (data, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.post("/plans", data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create plan."
      );
    }
  }
);

// UPDATE PLAN
export const updatePlan = createAsyncThunk(
  "superAdminPlans/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.put(`/plans/${id}`, data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update plan."
      );
    }
  }
);

// TOGGLE PLAN ACTIVE STATUS
export const togglePlanStatus = createAsyncThunk(
  "superAdminPlans/toggle",
  async (id, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.put(`/plans/${id}/toggle`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to toggle plan status."
      );
    }
  }
);

const superAdminPlanSlice = createSlice({
  name: "superAdminPlans",

  initialState: {
    plans: [],
    loading: false,
    saving: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(getAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPlan.pending, (state) => {
        state.saving = true;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.saving = false;
        state.plans.push({ ...action.payload, subscriber_count: 0 });
      })
      .addCase(createPlan.rejected, (state) => {
        state.saving = false;
      })

      .addCase(updatePlan.pending, (state) => {
        state.saving = true;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.plans.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.plans[idx] = { ...state.plans[idx], ...action.payload };
        }
      })
      .addCase(updatePlan.rejected, (state) => {
        state.saving = false;
      })

      .addCase(togglePlanStatus.fulfilled, (state, action) => {
        const idx = state.plans.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.plans[idx] = { ...state.plans[idx], ...action.payload };
        }
      });
  },
});

export default superAdminPlanSlice.reducer;