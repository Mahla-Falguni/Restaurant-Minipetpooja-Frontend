import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuPlus, LuSearch, LuUsers, LuX } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import { getCustomers, createCustomer } from "../../redux/customer/customerSlice";

const tierTone = { None: "slate", Bronze: "ember", Silver: "slate", Gold: "saffron", Platinum: "basil" };

const emptyForm = { name: "", phone: "", email: "" };

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, pagination, loading, error } = useSelector((state) => state.customers);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(getCustomers({ search: search || undefined }));
    }, 350);
    return () => clearTimeout(timeout);
  }, [dispatch, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.phone.trim()) {
      setFormError("Name and phone are required.");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(createCustomer(formData));
    setSubmitting(false);

    if (createCustomer.fulfilled.match(result)) {
      setFormData(emptyForm);
      setShowForm(false);
    } else {
      setFormError(result.payload);
    }
  };

  return (
    <DashboardLayout title="Customers" subtitle="Guest profiles, loyalty, and history">

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
          <input
            type="text"
            placeholder="Search name, phone, email…"
            className="w-full border border-line rounded-lg pl-9 pr-3 py-2.5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Button icon={LuPlus} onClick={() => setShowForm((s) => !s)}>
          Add Customer
        </Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-line bg-white p-6 mb-6 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-ink">New Customer</h3>
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

            <input
              type="text"
              placeholder="Full name"
              className="border border-line p-2.5 rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone number"
              className="border border-line p-2.5 rounded-lg"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              className="border border-line p-2.5 rounded-lg sm:col-span-2"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="sm:col-span-2">
              <Button type="submit" loading={submitting}>Save Customer</Button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {loading && !customers?.length ? (
        <p className="text-charcoal/50">Loading customers…</p>
      ) : !customers?.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuUsers size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No customers yet</h2>
          <p className="text-charcoal/50">Guests you add or who order will show up here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Tier</th>
                <th className="px-5 py-3 font-semibold text-right">Orders</th>
                <th className="px-5 py-3 font-semibold text-right">Total Spent</th>
                <th className="px-5 py-3 font-semibold text-right">Loyalty Pts</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-line last:border-0 hover:bg-paper-dim/60">
                  <td className="px-5 py-3.5 text-ink font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-charcoal/70">{c.phone}</td>
                  <td className="px-5 py-3.5"><Badge tone={tierTone[c.membership_tier] || "slate"}>{c.membership_tier}</Badge></td>
                  <td className="px-5 py-3.5 text-right font-mono">{c.total_orders}</td>
                  <td className="px-5 py-3.5 text-right font-mono">₹{Number(c.total_spent ?? 0).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-right font-mono">{c.loyalty_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <p className="text-xs text-charcoal/40 mt-3">
          Page {pagination.page} of {pagination.pages} · {pagination.total} total
        </p>
      )}

    </DashboardLayout>
  );
};

export default Customers;