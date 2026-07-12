import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuReceipt, LuX, LuPlus, LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import { Input, Select } from "../../components/Input";
import { getOrders } from "../../redux/order/orderSlice";
import { checkoutOrder, addPayment, clearCheckoutResult } from "../../redux/cashier/cashierSlice";

// Orders that still need cashier attention — anything not fully paid and
// not already dead (cancelled/rejected/merged).
const isBillable = (order) =>
  order.payment_status !== "Paid" &&
  !["Cancelled", "Rejected", "Merged"].includes(order.order_status);

const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Online"];

const CheckoutQueue = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const { actionLoading, checkoutResult, error } = useSelector((state) => state.cashier);

  const [activeOrder, setActiveOrder] = useState(null);
  const [additionalDiscount, setAdditionalDiscount] = useState(0);
  const [roundOff, setRoundOff] = useState(true);
  const [payments, setPayments] = useState([{ method: "Cash", amount: "" }]);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const billableOrders = useMemo(
    () => (orders || []).filter(isBillable),
    [orders]
  );

  const openOrder = (order) => {
    setActiveOrder(order);
    setAdditionalDiscount(0);
    setRoundOff(true);
    setPayments([{ method: "Cash", amount: "" }]);
    dispatch(clearCheckoutResult());
  };

  const closePanel = () => {
    setActiveOrder(null);
    dispatch(clearCheckoutResult());
  };

  const handleFinalize = async () => {
    const result = await dispatch(
      checkoutOrder({
        order_id: activeOrder._id,
        additional_discount: Number(additionalDiscount) || 0,
        round_off: roundOff,
      })
    );

    if (checkoutOrder.rejected.match(result)) {
      toast.error(result.payload || "Failed to finalize bill.");
    } else {
      toast.success("Bill finalized. Ready for payment.");
    }
  };

  const dueAmount = useMemo(() => {
    if (!checkoutResult) return null;
    const alreadyEntered = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    return Number((checkoutResult.grand_total - alreadyEntered).toFixed(2));
  }, [checkoutResult, payments]);

  const addPaymentRow = () => setPayments((rows) => [...rows, { method: "Cash", amount: "" }]);

  const removePaymentRow = (idx) =>
    setPayments((rows) => rows.filter((_, i) => i !== idx));

  const updatePaymentRow = (idx, field, value) =>
    setPayments((rows) => rows.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));

  const handleCollectPayment = async () => {
    const cleaned = payments
      .filter((p) => Number(p.amount) > 0)
      .map((p) => ({ method: p.method, amount: Number(p.amount) }));

    if (cleaned.length === 0) {
      toast.error("Enter at least one payment amount.");
      return;
    }

    const result = await dispatch(addPayment({ order_id: activeOrder._id, payments: cleaned }));

    if (addPayment.rejected.match(result)) {
      toast.error(result.payload || "Failed to record payment.");
    } else {
      toast.success("Payment recorded.");
      dispatch(getOrders());
      closePanel();
    }
  };

  return (
    <DashboardLayout title="Checkout Queue" subtitle="Finalize bills and collect payment">

      {loading && !billableOrders.length ? (
        <p className="text-charcoal/50">Loading orders…</p>
      ) : !billableOrders.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuReceipt size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">Nothing to checkout</h2>
          <p className="text-charcoal/50">Bills waiting for payment will show up here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {billableOrders.map((order) => (
            <div key={order._id} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-display text-lg text-ink">{order.order_number}</p>
                  <p className="text-xs text-charcoal/50">
                    Table {order.table_id?.table_number ?? "—"} · {order.customer_name || "Walk-in"}
                  </p>
                </div>
                <Badge>{order.payment_status}</Badge>
              </div>

              <p className="font-mono text-xl font-semibold text-ink mb-4">
                ₹{Number(order.grand_total ?? 0).toFixed(2)}
              </p>

              <Button size="sm" fullWidth onClick={() => openOrder(order)}>
                Bill / Collect Payment
              </Button>
            </div>
          ))}
        </div>
      )}

      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-lg text-ink">
                {activeOrder.order_number} — {activeOrder.customer_name || "Walk-in"}
              </h3>
              <button onClick={closePanel} className="text-charcoal/40 hover:text-ink">
                <LuX size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-claret/30 bg-claret/5 px-4 py-2.5 text-sm text-claret">
                {error}
              </div>
            )}

            {!checkoutResult ? (
              <div className="space-y-4">
                <p className="text-sm text-charcoal/60">
                  Bill total so far: <span className="font-mono text-ink">₹{Number(activeOrder.grand_total ?? 0).toFixed(2)}</span>
                </p>

                <Input
                  label="Additional discount (₹)"
                  type="number"
                  min="0"
                  value={additionalDiscount}
                  onChange={(e) => setAdditionalDiscount(e.target.value)}
                />

                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={roundOff}
                    onChange={(e) => setRoundOff(e.target.checked)}
                  />
                  Round off final total
                </label>

                <Button fullWidth loading={actionLoading} onClick={handleFinalize}>
                  Finalize Bill
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-xl border border-line bg-paper-dim/40 p-4 text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-charcoal/60">Subtotal</span><span>₹{checkoutResult.subtotal?.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-charcoal/60">Tax (CGST+SGST)</span><span>₹{(checkoutResult.cgst + checkoutResult.sgst).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-charcoal/60">Service charge</span><span>₹{checkoutResult.service_charge?.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-charcoal/60">Discount</span><span>-₹{checkoutResult.discount?.toFixed(2)}</span></div>
                  <div className="flex justify-between font-semibold text-ink pt-1 border-t border-line mt-1"><span>Grand total</span><span>₹{checkoutResult.grand_total?.toFixed(2)}</span></div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-ink">Collect payment</p>

                  {payments.map((row, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <Select
                        label={idx === 0 ? "Method" : undefined}
                        value={row.method}
                        onChange={(e) => updatePaymentRow(idx, "method", e.target.value)}
                        className="w-32"
                      >
                        {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                      </Select>

                      <Input
                        label={idx === 0 ? "Amount (₹)" : undefined}
                        type="number"
                        min="0"
                        value={row.amount}
                        onChange={(e) => updatePaymentRow(idx, "amount", e.target.value)}
                      />

                      {payments.length > 1 && (
                        <button
                          onClick={() => removePaymentRow(idx)}
                          className="h-10 w-10 flex items-center justify-center text-charcoal/40 hover:text-claret"
                        >
                          <LuTrash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={addPaymentRow}
                    className="flex items-center gap-1.5 text-sm text-ember font-medium hover:underline"
                  >
                    <LuPlus size={14} /> Add another method
                  </button>

                  {dueAmount !== null && (
                    <p className={`text-sm font-medium ${dueAmount <= 0.5 ? "text-basil" : "text-charcoal/60"}`}>
                      {dueAmount <= 0.5 ? "Fully covered" : `Remaining due: ₹${dueAmount.toFixed(2)}`}
                    </p>
                  )}
                </div>

                <Button fullWidth loading={actionLoading} onClick={handleCollectPayment}>
                  Record Payment
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default CheckoutQueue;