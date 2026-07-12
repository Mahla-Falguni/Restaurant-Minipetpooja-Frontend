import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuWallet, LuHistory } from "react-icons/lu";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import { Input, Select } from "../../components/Input";
import {
  fetchDrawerStatus,
  openDrawer,
  recordCashPaidOut,
  closeDrawer,
  fetchDrawerHistory,
} from "../../redux/cashier/cashierSlice";

const StatBox = ({ label, value }) => (
  <div className="rounded-xl border border-line bg-paper-dim/40 p-4">
    <p className="text-xs text-charcoal/50 mb-1">{label}</p>
    <p className="font-mono text-lg font-semibold text-ink">₹{Number(value ?? 0).toFixed(2)}</p>
  </div>
);

const CashDrawerPage = () => {
  const dispatch = useDispatch();
  const { drawer, drawerHistory, actionLoading, loading, error } = useSelector((state) => state.cashier);

  const [openingBalance, setOpeningBalance] = useState("");
  const [shift, setShift] = useState("Morning");

  const [paidOutAmount, setPaidOutAmount] = useState("");
  const [paidOutNotes, setPaidOutNotes] = useState("");

  const [actualCash, setActualCash] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    dispatch(fetchDrawerStatus());
  }, [dispatch]);

  const isOpen = drawer && drawer.status === "Open";

  const handleOpen = async (e) => {
    e.preventDefault();
    if (openingBalance === "" || Number(openingBalance) < 0) {
      toast.error("Enter a valid opening balance.");
      return;
    }
    const result = await dispatch(openDrawer({ opening_balance: Number(openingBalance), shift }));
    if (openDrawer.rejected.match(result)) {
      toast.error(result.payload || "Failed to open drawer.");
    } else {
      toast.success("Drawer opened.");
      setOpeningBalance("");
    }
  };

  const handlePaidOut = async (e) => {
    e.preventDefault();
    if (!paidOutAmount || Number(paidOutAmount) <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    const result = await dispatch(recordCashPaidOut({ amount: Number(paidOutAmount), notes: paidOutNotes }));
    if (recordCashPaidOut.rejected.match(result)) {
      toast.error(result.payload || "Failed to record cash paid out.");
    } else {
      toast.success("Cash paid-out recorded.");
      setPaidOutAmount("");
      setPaidOutNotes("");
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();
    if (actualCash === "" || Number(actualCash) < 0) {
      toast.error("Enter the counted cash amount.");
      return;
    }
    const result = await dispatch(closeDrawer({ actual_cash: Number(actualCash), notes: closeNotes }));
    if (closeDrawer.rejected.match(result)) {
      toast.error(result.payload || "Failed to close drawer.");
    } else {
      toast.success("Drawer closed.");
      setActualCash("");
      setCloseNotes("");
    }
  };

  const toggleHistory = () => {
    if (!showHistory) dispatch(fetchDrawerHistory());
    setShowHistory((s) => !s);
  };

  return (
    <DashboardLayout title="Cash Drawer" subtitle="Open, reconcile, and close your shift drawer">

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {loading && !drawer ? (
        <p className="text-charcoal/50">Loading drawer status…</p>
      ) : !isOpen ? (
        <div className="rounded-2xl border border-line bg-white p-6 max-w-md">
          <div className="w-12 h-12 rounded-full bg-ember/10 text-ember flex items-center justify-center mb-4">
            <LuWallet size={20} />
          </div>
          <h2 className="font-display text-xl text-ink mb-1">Open your drawer</h2>
          <p className="text-sm text-charcoal/50 mb-5">Count your starting cash before taking any payments.</p>

          <form onSubmit={handleOpen} className="space-y-4">
            <Input
              label="Opening balance (₹)"
              type="number"
              min="0"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
            />
            <Select label="Shift" value={shift} onChange={(e) => setShift(e.target.value)}>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </Select>
            <Button type="submit" fullWidth loading={actionLoading}>Open Drawer</Button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBox label="Opening balance" value={drawer.opening_balance} />
            <StatBox label="Cash received" value={drawer.cash_received} />
            <StatBox label="UPI received" value={drawer.upi_received} />
            <StatBox label="Card received" value={drawer.card_received} />
            <StatBox label="Online received" value={drawer.online_received} />
            <StatBox label="Cash paid out" value={drawer.cash_paid_out} />
            <StatBox label="Cash refunded" value={drawer.cash_refunded} />
            <StatBox label="Expected cash" value={drawer.expected_cash} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-lg text-ink mb-4">Record Cash Paid Out</h3>
              <form onSubmit={handlePaidOut} className="space-y-4">
                <Input
                  label="Amount (₹)"
                  type="number"
                  min="0"
                  value={paidOutAmount}
                  onChange={(e) => setPaidOutAmount(e.target.value)}
                />
                <Input
                  label="Note"
                  placeholder="e.g. Vegetable vendor payment"
                  value={paidOutNotes}
                  onChange={(e) => setPaidOutNotes(e.target.value)}
                />
                <Button type="submit" variant="outline" fullWidth loading={actionLoading}>
                  Record Paid Out
                </Button>
              </form>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-lg text-ink mb-4">Close Drawer</h3>
              <form onSubmit={handleClose} className="space-y-4">
                <Input
                  label="Actual counted cash (₹)"
                  type="number"
                  min="0"
                  value={actualCash}
                  onChange={(e) => setActualCash(e.target.value)}
                />
                <Input
                  label="Closing note (optional)"
                  value={closeNotes}
                  onChange={(e) => setCloseNotes(e.target.value)}
                />
                {actualCash !== "" && (
                  <p className="text-xs text-charcoal/50">
                    Expected ₹{Number(drawer.expected_cash ?? 0).toFixed(2)} · Difference{" "}
                    <span className={Number(actualCash) - drawer.expected_cash < 0 ? "text-claret" : "text-basil"}>
                      ₹{(Number(actualCash) - drawer.expected_cash).toFixed(2)}
                    </span>
                  </p>
                )}
                <Button type="submit" variant="danger" fullWidth loading={actionLoading}>
                  Close Drawer
                </Button>
              </form>
            </div>

          </div>

          <button
            onClick={toggleHistory}
            className="flex items-center gap-2 text-sm text-ember font-medium hover:underline"
          >
            <LuHistory size={14} /> {showHistory ? "Hide" : "View"} drawer history
          </button>

          {showHistory && (
            <div className="rounded-2xl border border-line bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper-dim text-left text-xs uppercase tracking-wide text-charcoal/50">
                    <th className="px-5 py-3 font-semibold">Cashier</th>
                    <th className="px-5 py-3 font-semibold">Shift</th>
                    <th className="px-5 py-3 font-semibold">Opened</th>
                    <th className="px-5 py-3 font-semibold">Closed</th>
                    <th className="px-5 py-3 font-semibold text-right">Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {(drawerHistory || []).map((d) => (
                    <tr key={d._id} className="border-b border-line last:border-0">
                      <td className="px-5 py-3.5 text-charcoal/70">
                        {d.cashier_id?.first_name} {d.cashier_id?.last_name}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">{d.shift}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">
                        {d.opened_at ? new Date(d.opened_at).toLocaleString() : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-charcoal/70">
                        {d.closed_at ? new Date(d.closed_at).toLocaleString() : "Still open"}
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-ink">
                        {d.difference !== undefined && d.closed_at ? `₹${Number(d.difference).toFixed(2)}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

    </DashboardLayout>
  );
};

export default CashDrawerPage;