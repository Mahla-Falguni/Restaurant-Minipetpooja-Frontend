import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuClock, LuLogIn, LuLogOut, LuUsersRound, LuX, LuCalendarCheck } from "react-icons/lu";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import { Input, Select, TextArea } from "../../components/Input";
import {
  getStaffMembers,
  checkIn,
  checkOut,
  getMyTodayAttendance,
  getAttendance,
  markAttendance,
  getMonthlyAttendanceSummary,
  clearMonthlySummary,
} from "../../redux/staff/staffSlice";

const todayStr = () => new Date().toISOString().split("T")[0];

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—";

const STATUS_OPTIONS = ["Present", "Absent", "Half Day", "On Leave", "Late"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const emptyMarkForm = {
  staff_id: "",
  date: todayStr(),
  status: "Present",
  check_in_at: "",
  check_out_at: "",
  notes: "",
};

const Attendance = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    members,
    myTodayAttendance,
    attendanceRecords,
    monthlySummary,
    attendanceLoading,
    attendanceActionLoading,
    attendanceError,
  } = useSelector((state) => state.staff);

  const canManage = user?.role === "Admin" || user?.role === "Manager";

  const [tab, setTab] = useState("mine");

  // Team tab state
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [markForm, setMarkForm] = useState(emptyMarkForm);
  const [showMarkForm, setShowMarkForm] = useState(false);

  // Summary state
  const [summaryStaffId, setSummaryStaffId] = useState("");
  const now = new Date();
  const [summaryMonth, setSummaryMonth] = useState(now.getMonth() + 1);
  const [summaryYear, setSummaryYear] = useState(now.getFullYear());

  useEffect(() => {
    dispatch(getMyTodayAttendance());
    if (canManage) dispatch(getStaffMembers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (tab === "team" && canManage) {
      dispatch(getAttendance({ date_from: selectedDate, date_to: selectedDate }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, selectedDate]);

  const handleCheckIn = async () => {
    const result = await dispatch(checkIn());
    if (checkIn.rejected.match(result)) {
      toast.error(result.payload || "Failed to check in.");
    } else {
      toast.success("Checked in successfully.");
    }
  };

  const handleCheckOut = async () => {
    const result = await dispatch(checkOut());
    if (checkOut.rejected.match(result)) {
      toast.error(result.payload || "Failed to check out.");
    } else {
      toast.success("Checked out successfully.");
    }
  };

  // Team view — merge today's/selected-date staff list with any existing record
  const teamRows = useMemo(() => {
    if (!canManage) return [];

    return (members || [])
      .filter((m) => m.is_active !== false)
      .map((m) => {
        const record = (attendanceRecords || []).find(
          (r) => (r.staff_id?._id || r.staff_id) === m._id
        );
        return { staff: m, record };
      });
  }, [members, attendanceRecords, canManage]);

  const openMarkForm = (staff, record) => {
    setMarkForm({
      staff_id: staff._id,
      date: selectedDate,
      status: record?.status || "Present",
      check_in_at: record?.check_in_at ? record.check_in_at.slice(0, 16) : "",
      check_out_at: record?.check_out_at ? record.check_out_at.slice(0, 16) : "",
      notes: record?.notes || "",
    });
    setShowMarkForm(true);
  };

  const handleMarkSubmit = async (e) => {
    e.preventDefault();

    if (!markForm.staff_id || !markForm.date || !markForm.status) {
      toast.error("Staff, date, and status are required.");
      return;
    }

    const payload = {
      ...markForm,
      check_in_at: markForm.check_in_at || undefined,
      check_out_at: markForm.check_out_at || undefined,
    };

    const result = await dispatch(markAttendance(payload));

    if (markAttendance.rejected.match(result)) {
      toast.error(result.payload || "Failed to mark attendance.");
    } else {
      toast.success("Attendance saved.");
      setShowMarkForm(false);
      dispatch(getAttendance({ date_from: selectedDate, date_to: selectedDate }));
    }
  };

  const handleViewSummary = async () => {
    if (!summaryStaffId) {
      toast.error("Select a staff member first.");
      return;
    }
    const result = await dispatch(
      getMonthlyAttendanceSummary({ staff_id: summaryStaffId, month: summaryMonth, year: summaryYear })
    );
    if (getMonthlyAttendanceSummary.rejected.match(result)) {
      toast.error(result.payload || "Failed to load summary.");
    }
  };

  return (
    <DashboardLayout title="Attendance" subtitle="Check in, check out, and track staff attendance">

      {canManage && (
        <div className="flex gap-1.5 mb-6">
          {[
            { key: "mine", label: "My Attendance" },
            { key: "team", label: "Team Attendance" },
            { key: "summary", label: "Monthly Summary" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? "bg-ink text-white" : "text-charcoal/60 hover:bg-paper-dim"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {attendanceError && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {attendanceError}
        </div>
      )}

      {/* ===================== MY ATTENDANCE ===================== */}
      {tab === "mine" && (
        <div className="rounded-2xl border border-line bg-white p-6 max-w-md">
          <div className="w-12 h-12 rounded-full bg-ember/10 text-ember flex items-center justify-center mb-4">
            <LuClock size={20} />
          </div>

          <h2 className="font-display text-xl text-ink mb-1">Today · {todayStr()}</h2>

          {!myTodayAttendance?.check_in_at ? (
            <p className="text-sm text-charcoal/50 mb-5">You haven't checked in yet.</p>
          ) : !myTodayAttendance?.check_out_at ? (
            <p className="text-sm text-charcoal/50 mb-5">
              Checked in at <span className="font-mono text-ink">{formatTime(myTodayAttendance.check_in_at)}</span>
            </p>
          ) : (
            <p className="text-sm text-charcoal/50 mb-5">
              Checked in <span className="font-mono text-ink">{formatTime(myTodayAttendance.check_in_at)}</span> · Checked out{" "}
              <span className="font-mono text-ink">{formatTime(myTodayAttendance.check_out_at)}</span> ·{" "}
              <span className="font-mono text-ink">{myTodayAttendance.total_hours ?? 0}h</span> worked
            </p>
          )}

          {myTodayAttendance && (
            <div className="mb-5">
              <Badge>{myTodayAttendance.status}</Badge>
            </div>
          )}

          {!myTodayAttendance?.check_in_at ? (
            <Button icon={LuLogIn} fullWidth loading={attendanceActionLoading} onClick={handleCheckIn}>
              Check In
            </Button>
          ) : !myTodayAttendance?.check_out_at ? (
            <Button icon={LuLogOut} variant="dark" fullWidth loading={attendanceActionLoading} onClick={handleCheckOut}>
              Check Out
            </Button>
          ) : (
            <p className="text-sm text-basil font-medium">Attendance complete for today.</p>
          )}
        </div>
      )}

      {/* ===================== TEAM ATTENDANCE ===================== */}
      {tab === "team" && canManage && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
            <p className="text-sm text-charcoal/60">
              {teamRows.length} staff member{teamRows.length === 1 ? "" : "s"}
            </p>
          </div>

          {attendanceLoading ? (
            <p className="text-charcoal/50">Loading attendance…</p>
          ) : !teamRows.length ? (
            <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
                <LuUsersRound size={24} />
              </div>
              <h2 className="font-display text-xl text-ink mb-2">No staff members</h2>
              <p className="text-charcoal/50">Add staff members first to track their attendance.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper-dim text-left text-xs uppercase tracking-wide text-charcoal/50">
                    <th className="px-5 py-3 font-semibold">Staff</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Check In</th>
                    <th className="px-5 py-3 font-semibold">Check Out</th>
                    <th className="px-5 py-3 font-semibold">Hours</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {teamRows.map(({ staff, record }) => (
                    <tr key={staff._id} className="border-b border-line last:border-0">
                      <td className="px-5 py-3.5 text-ink font-medium">
                        {staff.first_name} {staff.last_name}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">{staff.role}</td>
                      <td className="px-5 py-3.5 font-mono text-charcoal/70">{formatTime(record?.check_in_at)}</td>
                      <td className="px-5 py-3.5 font-mono text-charcoal/70">{formatTime(record?.check_out_at)}</td>
                      <td className="px-5 py-3.5 font-mono text-charcoal/70">{record?.total_hours ?? "—"}</td>
                      <td className="px-5 py-3.5">
                        {record ? <Badge>{record.status}</Badge> : <Badge tone="slate">Not Marked</Badge>}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button size="sm" variant="outline" onClick={() => openMarkForm(staff, record)}>
                          {record ? "Edit" : "Mark"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===================== MONTHLY SUMMARY ===================== */}
      {tab === "summary" && canManage && (
        <div className="rounded-2xl border border-line bg-white p-6 max-w-xl">
          <h3 className="font-display text-lg text-ink mb-4">Monthly Attendance Summary</h3>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <Select
              label="Staff"
              value={summaryStaffId}
              onChange={(e) => {
                setSummaryStaffId(e.target.value);
                dispatch(clearMonthlySummary());
              }}
            >
              <option value="">Select…</option>
              {(members || []).map((m) => (
                <option key={m._id} value={m._id}>
                  {m.first_name} {m.last_name}
                </option>
              ))}
            </Select>

            <Select
              label="Month"
              value={summaryMonth}
              onChange={(e) => setSummaryMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </Select>

            <Input
              label="Year"
              type="number"
              value={summaryYear}
              onChange={(e) => setSummaryYear(Number(e.target.value))}
            />
          </div>

          <Button icon={LuCalendarCheck} loading={attendanceLoading} onClick={handleViewSummary}>
            View Summary
          </Button>

          {monthlySummary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="rounded-xl border border-line bg-paper-dim/40 p-4">
                <p className="text-xs text-charcoal/50 mb-1">Present</p>
                <p className="font-mono text-lg font-semibold text-ink">{monthlySummary.days_present}</p>
              </div>
              <div className="rounded-xl border border-line bg-paper-dim/40 p-4">
                <p className="text-xs text-charcoal/50 mb-1">Absent</p>
                <p className="font-mono text-lg font-semibold text-ink">{monthlySummary.days_absent}</p>
              </div>
              <div className="rounded-xl border border-line bg-paper-dim/40 p-4">
                <p className="text-xs text-charcoal/50 mb-1">Half Days</p>
                <p className="font-mono text-lg font-semibold text-ink">{monthlySummary.days_half}</p>
              </div>
              <div className="rounded-xl border border-line bg-paper-dim/40 p-4">
                <p className="text-xs text-charcoal/50 mb-1">On Leave</p>
                <p className="font-mono text-lg font-semibold text-ink">{monthlySummary.days_on_leave}</p>
              </div>
              <div className="rounded-xl border border-line bg-paper-dim/40 p-4 col-span-2 sm:col-span-4">
                <p className="text-xs text-charcoal/50 mb-1">Total hours worked</p>
                <p className="font-mono text-lg font-semibold text-ink">{monthlySummary.total_hours}h</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== MARK / EDIT MODAL ===================== */}
      {showMarkForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg text-ink">Mark Attendance</h3>
              <button onClick={() => setShowMarkForm(false)} className="text-charcoal/40 hover:text-ink">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleMarkSubmit} className="space-y-4">
              <Input label="Date" type="date" value={markForm.date}
                onChange={(e) => setMarkForm({ ...markForm, date: e.target.value })} />

              <Select label="Status" value={markForm.status}
                onChange={(e) => setMarkForm({ ...markForm, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Check in" type="datetime-local" value={markForm.check_in_at}
                  onChange={(e) => setMarkForm({ ...markForm, check_in_at: e.target.value })} />
                <Input label="Check out" type="datetime-local" value={markForm.check_out_at}
                  onChange={(e) => setMarkForm({ ...markForm, check_out_at: e.target.value })} />
              </div>

              <TextArea label="Notes" rows={2} value={markForm.notes}
                onChange={(e) => setMarkForm({ ...markForm, notes: e.target.value })} />

              <Button type="submit" fullWidth loading={attendanceActionLoading}>
                Save Attendance
              </Button>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default Attendance;