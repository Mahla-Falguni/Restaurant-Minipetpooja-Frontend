import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuReceipt, LuBellRing, LuCheckCheck, LuSplit, LuUtensils, LuWallet, LuFileWarning} from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import StatCard from "../../components/cards/StatCard";
import Badge from "../../components/kitchen/Badge";
import Button from "../../components/common/Button";
import { fetchCashierDashboard } from "../../redux/cashier/cashierSlice";

const paymentMethodTone = {
    Cash: "basil",
    Card: "slate",
    UPI: "ember",
    Online: "saffron"
};

const CashierDashboard = () => {
    const dispatch = useDispatch();
    const { dashboard, loading } = useSelector((state) => state.cashier);

    useEffect(() => {
        dispatch(fetchCashierDashboard());
    }, [dispatch]);

    return (
        <DashboardLayout title="Cashier Desk" subtitle="Bills, payments, and today's collection at a glance">

            {/* Drawer status banner */}
            <div
                className={`rounded-2xl px-5 py-4 mb-6 flex items-center justify-between border ${
                    dashboard?.drawer_status === "Open"
                        ? "bg-basil/5 border-basil/30"
                        : "bg-ember/5 border-ember/30"
                }`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            dashboard?.drawer_status === "Open" ? "bg-basil/15 text-basil" : "bg-ember/15 text-ember"
                        }`}
                    >
                        <LuWallet size={18} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-ink">
                            Drawer is {dashboard?.drawer_status || "Closed"}
                        </p>
                        <p className="text-xs text-charcoal/50">
                            {dashboard?.drawer_status === "Open"
                                ? "You can accept payments."
                                : "Open your drawer before taking cash payments."}
                        </p>
                    </div>
                </div>
                <Link to="/cashier/drawer">
                    <Button size="sm" variant={dashboard?.drawer_status === "Open" ? "outline" : "primary"}>
                        {dashboard?.drawer_status === "Open" ? "Manage Drawer" : "Open Drawer"}
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={LuReceipt}
                    label="Pending Bills"
                    value={dashboard?.pending_bills ?? "—"}
                />
                <StatCard
                    icon={LuBellRing}
                    label="Bill Requested"
                    value={dashboard?.bill_requested ?? "—"}
                />
                <StatCard
                    icon={LuCheckCheck}
                    label="Paid Today"
                    value={dashboard?.paid_bills_today ?? "—"}
                />
                <StatCard
                    icon={LuSplit}
                    label="Active Split Bills"
                    value={dashboard?.active_split_bills ?? "—"}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                <div className="lg:col-span-2 rounded-2xl border border-black/10 bg-paper p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-ink">Today's Collection</h3>
                        <span className="font-mono text-2xl font-semibold text-ember">
                            ₹{(dashboard?.today_collection ?? 0).toFixed(2)}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(dashboard?.payment_breakdown || {}).map(([method, amount]) => (
                            <div key={method} className="rounded-xl border border-black/5 p-3">
                                <Badge tone={paymentMethodTone[method] || "slate"}>
                                    {method}
                                </Badge>
                                <p className="font-mono text-lg font-semibold text-ink mt-2">
                                    ₹{amount.toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-paper p-5 flex flex-col gap-4">
                    <h3 className="font-display text-lg text-ink">Floor</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ink/5 text-ink flex items-center justify-center">
                            <LuUtensils size={16} />
                        </div>
                        <div>
                            <p className="font-mono text-lg font-semibold text-ink">
                                {dashboard?.Occupied_tables ?? "—"}/{dashboard?.total_tables ?? "—"}
                            </p>
                            <p className="text-xs text-charcoal/50">Tables Occupied</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                            <LuFileWarning size={16} />
                        </div>
                        <div>
                            <p className="font-mono text-lg font-semibold text-ink">
                                {dashboard?.unpaid_invoices ?? "—"}
                            </p>
                            <p className="text-xs text-charcoal/50">Unpaid invoices</p>
                        </div>
                    </div>
                    <Link to="/cashier/checkout" className="mt-auto">
                        <Button className="w-full">Go to Checkout</Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Link to="/cashier/checkout">
                    <Button variant="outline">Checkout Queue</Button>
                </Link>
                <Link to="/cashier/refunds">
                    <Button variant="outline">Refunds</Button>
                </Link>
                <Link to="/cashier/drawer">
                    <Button variant="outline">Cash Drawer</Button>
                </Link>
            </div>
        </DashboardLayout>
    );
};

export default CashierDashboard;