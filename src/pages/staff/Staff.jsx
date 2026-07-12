import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuPlus, LuUsers, LuX, LuCheck, LuBan } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import {
  getStaffMembers,
  createStaffMember,
  toggleStaffStatus,
  getLeaveRequests,
  reviewLeaveRequest,
} from "../../redux/staff/staffSlice";

const roleTone = { Admin: "claret", Manager: "ember", Waiter: "basil", Cashier: "saffron", Kitchen: "slate" };

const emptyForm = { first_name: "", last_name: "", email: "", phone: "", password: "", role: "Waiter" };

const Staff = () => {
  const dispatch = useDispatch();
  const { members, leaveRequests, loading, error } = useSelector((state) => state.staff);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    dispatch(getStaffMembers());
    dispatch(getLeaveRequests({ status: "Pending" }));
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { first_name, last_name, email, password, role } = formData;
    if (!first_name || !last_name || !email || !password || !role) {
      setFormError("All fields except phone are required.");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(createStaffMember(formData));
    setSubmitting(false);

    if (createStaffMember.fulfilled.match(result)) {
      setFormData(emptyForm);
      setShowForm(false);
    } else {
      setFormError(result.payload);
    }
  };

  const handleToggleStatus = async (id) => {
    setBusyId(id);
    await dispatch(toggleStaffStatus(id));
    setBusyId(null);
  };

  const handleReviewLeave = async (id, status) => {
    setBusyId(id);
    await dispatch(reviewLeaveRequest({ id, status }));
    setBusyId(null);
  };

  return (
    <DashboardLayout title="Staff" subtitle="Team members and pending leave requests">

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-charcoal/60">
          {members?.length || 0} team member{members?.length === 1 ? "" : "s"}
        </p>
        <Button icon={LuPlus} onClick={() => setShowForm((s) => !s)}>Add Staff</Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-line bg-white p-6 mb-6 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-ink">New Staff Member</h3>
            <button onClick={() => setShowForm(false)} className="text-charcoal/40 hover:text-ink">
              <LuX size={18} />
            </button>
          </div>

          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            {formError && (
              <div className="sm:col-span-2 rounded-lg border border-claret/30 bg-claret/5 px-4 py-2.5 text-sm text-claret">
                {formError}
              </div>
            )}

            <input type="text" placeholder="First name" className="border border-line p-2.5 rounded-lg"
              value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
            <input type="text" placeholder="Last name" className="border border-line p-2.5 rounded-lg"
              value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
            <input type="email" placeholder="Email" className="border border-line p-2.5 rounded-lg"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="tel" placeholder="Phone (optional)" className="border border-line p-2.5 rounded-lg"
              value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <input type="password" placeholder="Temporary password" className="border border-line p-2.5 rounded-lg"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <select className="border border-line p-2.5 rounded-lg"
              value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="Manager">Manager</option>
              <option value="Waiter">Waiter</option>
              <option value="Cashier">Cashier</option>
              <option value="Kitchen">Kitchen</option>
            </select>

            <div className="sm:col-span-2">
              <Button type="submit" loading={submitting}>Create Staff Member</Button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {!!leaveRequests?.length && (
        <div className="mb-8">
          <h3 className="font-display text-lg text-ink mb-3">Pending Leave Requests</h3>
          <div className="rounded-2xl border border-line bg-white divide-y divide-line">
            {leaveRequests.map((leave) => (
              <div key={leave._id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {leave.staff_id?.first_name} {leave.staff_id?.last_name} · {leave.leave_type}
                  </p>
                  <p className="text-xs text-charcoal/50">{leave.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="success" icon={LuCheck} loading={busyId === leave._id}
                    onClick={() => handleReviewLeave(leave._id, "Approved")}>Approve</Button>
                  <Button size="sm" variant="danger" icon={LuBan} loading={busyId === leave._id}
                    onClick={() => handleReviewLeave(leave._id, "Rejected")}>Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && !members?.length ? (
        <p className="text-charcoal/50">Loading staff…</p>
      ) : !members?.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuUsers size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No staff yet</h2>
          <p className="text-charcoal/50">Add your team to start assigning shifts.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} className="border-b border-line last:border-0 hover:bg-paper-dim/60">
                  <td className="px-5 py-3.5 text-ink font-medium">{m.first_name} {m.last_name}</td>
                  <td className="px-5 py-3.5 text-charcoal/70">{m.email}</td>
                  <td className="px-5 py-3.5"><Badge tone={roleTone[m.role] || "slate"}>{m.role}</Badge></td>
                  <td className="px-5 py-3.5"><Badge tone={m.status ? "basil" : "slate"}>{m.status ? "Active" : "Inactive"}</Badge></td>
                  <td className="px-5 py-3.5 text-right">
                    {m.role !== "Admin" && (
                      <button
                        onClick={() => handleToggleStatus(m._id)}
                        disabled={busyId === m._id}
                        className="text-xs text-charcoal/50 hover:text-ink disabled:opacity-50"
                      >
                        {m.status ? "Deactivate" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </DashboardLayout>
  );
};

export default Staff;