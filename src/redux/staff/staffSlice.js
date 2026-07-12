import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// GET STAFF MEMBERS
export const getStaffMembers = createAsyncThunk(
  "staff/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/staff/members");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch staff."
      );
    }
  }
);

// CREATE STAFF MEMBER
export const createStaffMember = createAsyncThunk(
  "staff/create",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/staff/members", data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create staff member."
      );
    }
  }
);

// TOGGLE STAFF STATUS
export const toggleStaffStatus = createAsyncThunk(
  "staff/toggleStatus",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/staff/members/${id}/status`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update staff member."
      );
    }
  }
);

// GET LEAVE REQUESTS
export const getLeaveRequests = createAsyncThunk(
  "staff/getLeaveRequests",
  async (params = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/staff/leave", { params });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch leave requests."
      );
    }
  }
);

// REVIEW LEAVE REQUEST
export const reviewLeaveRequest = createAsyncThunk(
  "staff/reviewLeave",
  async ({ id, status, remarks }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/staff/leave/${id}/review`, { status, remarks });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to review leave request."
      );
    }
  }
);


// CHECK IN (self)
export const checkIn = createAsyncThunk(
  "staff/checkIn",
  async (data = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/staff/attendance/check-in", data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to check in."
      );
    }
  }
);

// CHECK OUT (self)
export const checkOut = createAsyncThunk(
  "staff/checkOut",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/staff/attendance/check-out");
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to check out."
      );
    }
  }
);

// MANUALLY MARK ATTENDANCE (Manager/Admin, for any staff member)
export const markAttendance = createAsyncThunk(
  "staff/markAttendance",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/staff/attendance/mark", data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to mark attendance."
      );
    }
  }
);

// GET ATTENDANCE RECORDS (self, or all/by-staff for Manager/Admin)
export const getAttendance = createAsyncThunk(
  "staff/getAttendance",
  async (params = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/staff/attendance", { params });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance."
      );
    }
  }
);

// GET MY TODAY'S ATTENDANCE (self) — used to show check-in/out button state
export const getMyTodayAttendance = createAsyncThunk(
  "staff/getMyTodayAttendance",
  async (_, thunkAPI) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axiosInstance.get("/staff/attendance", {
        params: { date_from: today, date_to: today },
      });
      const records = response.data.data?.records || [];
      return records[0] || null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch today's attendance."
      );
    }
  }
);

// GET MONTHLY ATTENDANCE SUMMARY (Manager/Admin, for payroll)
export const getMonthlyAttendanceSummary = createAsyncThunk(
  "staff/getMonthlyAttendanceSummary",
  async (params, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/staff/attendance/summary", { params });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendance summary."
      );
    }
  }
);

const staffSlice = createSlice({
  name: "staff",

  initialState: {
    members: [],
    leaveRequests: [],
    loading: false,
    error: null,

    // Attendance
    myTodayAttendance: null,
    attendanceRecords: [],
    attendancePagination: null,
    monthlySummary: null,
    attendanceLoading: false,
    attendanceActionLoading: false,
    attendanceError: null,
  },

  reducers: {
    clearMonthlySummary: (state) => {
      state.monthlySummary = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getStaffMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStaffMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(getStaffMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createStaffMember.fulfilled, (state, action) => {
        state.members.unshift(action.payload);
      })
      .addCase(toggleStaffStatus.fulfilled, (state, action) => {
        state.members = state.members.map((m) =>
          m._id === action.payload._id ? action.payload : m
        );
      })
      .addCase(getLeaveRequests.fulfilled, (state, action) => {
        state.leaveRequests = action.payload.leaves || action.payload;
      })
      .addCase(reviewLeaveRequest.fulfilled, (state, action) => {
        state.leaveRequests = state.leaveRequests.map((l) =>
          l._id === action.payload._id ? action.payload : l
        );
      })

      // Check in
      .addCase(checkIn.pending, (state) => {
        state.attendanceActionLoading = true;
        state.attendanceError = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.attendanceActionLoading = false;
        state.myTodayAttendance = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.attendanceActionLoading = false;
        state.attendanceError = action.payload;
      })

      // Check out
      .addCase(checkOut.pending, (state) => {
        state.attendanceActionLoading = true;
        state.attendanceError = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.attendanceActionLoading = false;
        state.myTodayAttendance = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.attendanceActionLoading = false;
        state.attendanceError = action.payload;
      })

      // Get my today's attendance
      .addCase(getMyTodayAttendance.fulfilled, (state, action) => {
        state.myTodayAttendance = action.payload;
      })

      // Manually mark attendance (Manager/Admin)
      .addCase(markAttendance.pending, (state) => {
        state.attendanceActionLoading = true;
        state.attendanceError = null;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.attendanceActionLoading = false;

        const idx = state.attendanceRecords.findIndex((r) => r._id === action.payload._id);

        if (idx !== -1) {
          state.attendanceRecords[idx] = action.payload;
        } else {
          state.attendanceRecords.unshift(action.payload);
        }
      })
      .addCase(markAttendance.rejected, (state, action) => {
        state.attendanceActionLoading = false;
        state.attendanceError = action.payload;
      })

      // Get attendance records (team view / history)
      .addCase(getAttendance.pending, (state) => {
        state.attendanceLoading = true;
        state.attendanceError = null;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceRecords = action.payload.records || [];
        state.attendancePagination = action.payload.pagination || null;
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceError = action.payload;
      })

      // Monthly summary
      .addCase(getMonthlyAttendanceSummary.pending, (state) => {
        state.attendanceLoading = true;
        state.attendanceError = null;
      })
      .addCase(getMonthlyAttendanceSummary.fulfilled, (state, action) => {
        state.attendanceLoading = false;
        state.monthlySummary = action.payload;
      })
      .addCase(getMonthlyAttendanceSummary.rejected, (state, action) => {
        state.attendanceLoading = false;
        state.attendanceError = action.payload;
      });
  },
});

export const { clearMonthlySummary } = staffSlice.actions;

export default staffSlice.reducer;