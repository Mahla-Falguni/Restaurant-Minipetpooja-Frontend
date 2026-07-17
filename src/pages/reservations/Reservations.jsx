import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuPlus, LuCalendarClock, LuX } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import {
  getTodaysReservations,
  getReservationsList,
  createReservation,
  confirmReservation,
  seatReservation,
  completeReservation,
  cancelReservation,
  markNoShowReservation,
} from "../../redux/reservation/reservationSlice";

const statusTone = {
  Requested: "saffron",
  Confirmed: "ember",
  Seated: "basil",
  Completed: "slate",
  "No Show": "claret",
  Cancelled: "claret",
};

const emptyForm = {
  customer_name: "",
  customer_phone: "",
  party_size: "",
  reservation_date: new Date().toISOString().split("T")[0],
  reservation_time: "",
};

// Which action buttons make sense for each current status.
// `restricted: true` means only Admin/Manager can use this action —
// Confirm and Cancel change the commitment of the booking, so those
// are locked down; Seat/Complete/No Show stay open to Waiter/Cashier
// since they're just floor operations.
const nextActions = {
  Requested: [
    { label: "Confirm", thunk: confirmReservation, variant: "primary", restricted: true },
    { label: "Cancel", thunk: cancelReservation, variant: "danger", restricted: true },
  ],
  Confirmed: [
    { label: "Seat", thunk: seatReservation, variant: "primary" },
    { label: "No Show", thunk: markNoShowReservation, variant: "outline" },
    { label: "Cancel", thunk: cancelReservation, variant: "danger", restricted: true },
  ],
  Seated: [
    { label: "Complete", thunk: completeReservation, variant: "primary" },
  ],
};

const Reservations = () => {
  const dispatch = useDispatch();
  const { reservations, loading, error } = useSelector((state) => state.reservations);
  const { user } = useSelector((state) => state.auth);

  // Only Admin/Manager can Confirm or Cancel a reservation — Cashier and
  // Waiter can still view and handle Seat/Complete/No Show.
  const canManage = user?.role === "Admin" || user?.role === "Manager";

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    date: "",
    search: "",
  });

  useEffect(() => {
    dispatch(getReservationsList(filters));
  }, [dispatch, filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { customer_name, customer_phone, party_size, reservation_date, reservation_time } = formData;
    if (!customer_name || !customer_phone || !party_size || !reservation_date || !reservation_time) {
      setFormError("All fields are required.");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(createReservation(formData));
    setSubmitting(false);

    if (createReservation.fulfilled.match(result)) {
      setFormData(emptyForm);
      setShowForm(false);
    } else {
      setFormError(result.payload);
    }
  };

  const runAction = async (thunk, id) => {
    setBusyId(id);
    await dispatch(thunk(id));
    setBusyId(null);
  };

  return (
    <DashboardLayout title="Reservations" subtitle="Manage customer table bookings and requests">

      {/* Filter Bar */}
      <div className="bg-white border border-line rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4 text-sm shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-charcoal/70">Filter Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="border border-line rounded-lg px-3 py-1.5 bg-white text-ink text-xs focus:outline-none focus:ring-1 focus:ring-ember animate-none"
          >
            <option value="">All Statuses</option>
            <option value="Requested">Requested (New Requests)</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Seated">Seated</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled / Declined</option>
            <option value="No Show">No Show</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-charcoal/70">Select Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="border border-line rounded-lg px-3 py-1.5 bg-white text-ink text-xs focus:outline-none focus:ring-1 focus:ring-ember h-[34px]"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-charcoal/70">Search Customer</label>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-line rounded-lg px-3 py-1.5 bg-white text-ink text-xs focus:outline-none focus:ring-1 focus:ring-ember h-[34px]"
          />
        </div>

        <div className="flex items-end self-end">
          <button
            onClick={() => setFilters({ status: "", date: "", search: "" })}
            className="text-xs text-ember hover:underline font-semibold h-[34px]"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-charcoal/60">
          {reservations?.length || 0} reservation{reservations?.length === 1 ? "" : "s"} found
        </p>
        <Button icon={LuPlus} onClick={() => setShowForm((s) => !s)}>New Reservation</Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-line bg-white p-6 mb-6 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-ink">New Reservation</h3>
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

            <input type="text" placeholder="Customer name" className="border border-line p-2.5 rounded-lg"
              value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />

            <input type="tel" placeholder="Phone number" className="border border-line p-2.5 rounded-lg"
              value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} />

            <input type="number" min="1" placeholder="Party size" className="border border-line p-2.5 rounded-lg"
              value={formData.party_size} onChange={(e) => setFormData({ ...formData, party_size: e.target.value })} />

            <input type="date" className="border border-line p-2.5 rounded-lg"
              value={formData.reservation_date} onChange={(e) => setFormData({ ...formData, reservation_date: e.target.value })} />

            <input type="time" className="border border-line p-2.5 rounded-lg sm:col-span-2"
              value={formData.reservation_time} onChange={(e) => setFormData({ ...formData, reservation_time: e.target.value })} />

            <div className="sm:col-span-2">
              <Button type="submit" loading={submitting}>Book Table</Button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {loading && !reservations?.length ? (
        <p className="text-charcoal/50">Loading reservations…</p>
      ) : !reservations?.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuCalendarClock size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No reservations today</h2>
          <p className="text-charcoal/50">Bookings for today will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((r) => (
            <div key={r._id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display text-lg text-ink">{r.customer_name}</p>
                  <p className="text-xs text-charcoal/50">
                    {r.reservation_time} · Party of {r.party_size}
                  </p>
                </div>
                <Badge tone={statusTone[r.status] || "slate"}>{r.status}</Badge>
              </div>

              <p className="text-xs text-charcoal/50 mb-4">{r.customer_phone}</p>

              <div className="flex flex-wrap gap-2">
                {(nextActions[r.status] || [])
                  .filter((action) => !action.restricted || canManage)
                  .map((action) => (
                  <Button
                    key={action.label}
                    size="sm"
                    variant={action.variant}
                    loading={busyId === r._id}
                    onClick={() => runAction(action.thunk, r._id)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default Reservations;