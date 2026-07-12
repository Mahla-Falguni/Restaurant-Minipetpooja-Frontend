import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUndo2, LuPlus, LuX } from "react-icons/lu";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import { Input, Select, TextArea } from "../../components/Input";
import { getOrders } from "../../redux/order/orderSlice";
import {
  fetchRefunds,
  requestRefund,
  approveRefund,
  rejectRefund,
  completeRefund,
} from "../../redux/cashier/cashierSlice";

const TABS = ["All", "Pending", "Approved", "Rejected", "Completed"];

const emptyForm = {
  order_id: "",
  refund_type: "Full",
  refund_amount: "",
  refund_method: "Original Payment Method",
  reason: "",
};

const Refunds = () => {
  const dispatch = useDispatch();
  const { refunds, actionLoading, error } = useSelector((state) => state.cashier);
  const { orders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);

  const canApprove = user?.role === "Admin" || user?.role === "Manager";

  const [tab, setTab] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    dispatch(fetchRefunds());
    dispatch(getOrders());
  }, [dispatch]);

  const refundableOrders = useMemo(
    () => (orders || []).filter((o) => ["Paid", "Partial"].includes(o.payment_status)),
    [orders]
  );

  const filteredRefunds = useMemo(() => {
    const list = refunds || [];
    if (tab === "All") return list;
    return list.filter((r) => r.status === tab);
  }, [refunds, tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.order_id || !formData.refund_amount || !formData.reason.trim()) {
      toast.error("Order, amount, and reason are required.");
      return;
    }

    const result = await dispatch(
      requestRefund({
        ...formData,
        refund_amount: Number(formData.refund_amount),
      })
    );

    if (requestRefund.rejected.match(result)) {
      toast.error(result.payload || "Failed to request refund.");
    } else {
      toast.success("Refund request submitted.");
      setFormData(emptyForm);
      setShowForm(false);
    }
  };

  const runAction = async (thunk, arg, id, successMsg) => {
    setBusyId(id);
    const result = await dispatch(thunk(arg));
    setBusyId(null);

    if (thunk.rejected.match(result)) {
      toast.error(result.payload || "Action failed.");
    } else {
      toast.success(successMsg);
    }
  };

  return (
    <DashboardLayout title="Refunds" subtitle="Request, approve, and process refunds">

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-ink text-white" : "text-charcoal/60 hover:bg-paper-dim"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Button icon={LuPlus} onClick={() => setShowForm((s) => !s)}>New Refund Request</Button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-line bg-white p-6 mb-6 max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-ink">New Refund Request</h3>
            <button onClick={() => setShowForm(false)} className="text-charcoal/40 hover:text-ink">
              <LuX size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              label="Order"
              value={formData.order_id}
              onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
            >
              <option value="">Select an order…</option>
              {refundableOrders.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.order_number} · ₹{Number(o.grand_total ?? 0).toFixed(2)} · {o.customer_name || "Walk-in"}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Refund type"
                value={formData.refund_type}
                onChange={(e) => setFormData({ ...formData, refund_type: e.target.value })}
              >
                <option value="Full">Full</option>
                <option value="Partial">Partial</option>
              </Select>

              <Input
                label="Refund amount (₹)"
                type="number"
                min="0"
                value={formData.refund_amount}
                onChange={(e) => setFormData({ ...formData, refund_amount: e.target.value })}
              />
            </div>

            <Select
              label="Refund method"
              value={formData.refund_method}
              onChange={(e) => setFormData({ ...formData, refund_method: e.target.value })}
            >
              <option value="Original Payment Method">Original Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Online">Online</option>
            </Select>

            <TextArea
              label="Reason"
              rows={3}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />

            <Button type="submit" loading={actionLoading}>Submit Request</Button>
          </form>
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {!filteredRefunds.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuUndo2 size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No refunds here</h2>
          <p className="text-charcoal/50">Refund requests will show up here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Method</th>
                <th className="px-5 py-3 font-semibold">Reason</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.map((r) => (
                <tr key={r._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3.5 font-mono text-ink">{r.order_id?.order_number ?? "—"}</td>
                  <td className="px-5 py-3.5 text-charcoal/70">{r.refund_type}</td>
                  <td className="px-5 py-3.5 font-mono text-ink">₹{Number(r.refund_amount).toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-charcoal/70">{r.refund_method}</td>
                  <td className="px-5 py-3.5 text-charcoal/70 max-w-[180px] truncate">{r.reason}</td>
                  <td className="px-5 py-3.5"><Badge>{r.status}</Badge></td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-2">
                      {r.status === "Pending" && canApprove && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            loading={busyId === r._id}
                            onClick={() => runAction(approveRefund, r._id, r._id, "Refund approved.")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            loading={busyId === r._id}
                            onClick={() =>
                              runAction(
                                rejectRefund,
                                { refundId: r._id, rejected_reason: "Rejected by staff" },
                                r._id,
                                "Refund rejected."
                              )
                            }
                          >
                            Reject
                          </Button>
                        </>
                      )}

                      {r.status === "Approved" && (
                        <Button
                          size="sm"
                          loading={busyId === r._id}
                          onClick={() =>
                            runAction(
                              completeRefund,
                              { refundId: r._id, transaction_reference: "" },
                              r._id,
                              "Refund completed."
                            )
                          }
                        >
                          Complete
                        </Button>
                      )}
                    </div>
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

export default Refunds;