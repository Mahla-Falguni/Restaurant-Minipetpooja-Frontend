import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import superAdminAxiosInstance from "../../api/superAdminAxiosInstance";

const token = localStorage.getItem("superAdminToken");
const storedAdmin = localStorage.getItem("superAdminUser");

let parsedAdmin = null;

try {
  parsedAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;
} catch (err) {
  parsedAdmin = null;
}


// LOGIN
export const superAdminLogin = createAsyncThunk(
  "superAdminAuth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.post(
        "/auth/login",
        credentials
      );

      const { token, super_admin } = response.data.data;

      localStorage.setItem("superAdminToken", token);
      localStorage.setItem("superAdminUser", JSON.stringify(super_admin));

      return { token, super_admin };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed."
      );
    }
  }
);

// PROFILE
export const getSuperAdminProfile = createAsyncThunk(
  "superAdminAuth/profile",
  async (_, thunkAPI) => {
    try {
      const response = await superAdminAxiosInstance.get("/auth/me");

      const superAdmin = response.data.data;

      localStorage.setItem("superAdminUser", JSON.stringify(superAdmin));

      return superAdmin;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  }
);

const superAdminAuthSlice = createSlice({
  name: "superAdminAuth",

  initialState: {
    superAdmin: parsedAdmin,
    token: token || null,
    loading: false,
    error: null,
  },

  reducers: {
    superAdminLogout: (state) => {
      localStorage.removeItem("superAdminToken");
      localStorage.removeItem("superAdminUser");
      state.superAdmin = null;
      state.token = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(superAdminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(superAdminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.superAdmin = action.payload.super_admin;
      })
      .addCase(superAdminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSuperAdminProfile.fulfilled, (state, action) => {
        state.superAdmin = action.payload;
      });
  },
});

export const { superAdminLogout } = superAdminAuthSlice.actions;

export default superAdminAuthSlice.reducer;