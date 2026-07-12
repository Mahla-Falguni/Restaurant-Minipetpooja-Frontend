import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuUtensils, LuClipboardList, LuBellRing, LuTimer } from "react-icons/lu";
import DashboardLayout from "../../layouts/DashboardLayouts";
import StatCard from "../../components/cards/StatCard";
import Badge from "../../components/kitchen/Badge";
import EmptyState from "../../components/EmptyState";
import { fetchWaiterTables, fetchWaiterOrders } from "../../redux/waiter/waiterSlice";
import { Link } from "react-router-dom";

const statusToneMap = {
    Available: "success",
    Occupied: "ember",
    Reserved: "warning",
    Cleaning: "muted",
    "Out of Service": "muted"
};

const WaiterDashboard = () => {
    const dispatch = useDispatch();
    const { tables, orders, loading } = useSelector((state) => state.waiter);

    useEffect(() => {
        dispatch(fetchWaiterTables());
        dispatch(fetchWaiterOrders({ status: "Active" }));
    }, [dispatch]);

    const Occupied = tables.filter((t) => t.status === "Occupied").length;
    const readyToServe = orders.filter((o) =>
        o.items?.some((i) => i.status === "Ready")
    ).length;
    const billRequested = orders.filter((o) => o.bill_requested).length;

    return (
        <DashboardLayout title="Floor" subtitle="Your live view of tables and orders">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    icon={LuUtensils}
                    label="Tables Occupied"
                    value={`${Occupied}/${tables.length}`}
                    tone="ember"
                />
                <StatCard
                    icon={LuClipboardList}
                    label="Active Orders"
                    value={orders.length}
                    tone="ink"
                />
                <StatCard
                    icon={LuBellRing}
                    label="Ready to Serve"
                    value={readyToServe}
                    tone="success"
                />
                <StatCard
                    icon={LuTimer}
                    label="Bill Requested"
                    value={billRequested}
                    tone="warning"
                />
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl text-ink">Table Overview</h3>
                <Link to="/waiter/tables" className="text-sm font-medium text-ember hover:underline">
                    View floor plan →
                </Link>
            </div>

            {tables.length === 0 && !loading ? (
                <EmptyState title="No tables found" subtitle="Tables assigned to your section will appear here." />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {tables.map((table) => (
                        <Link
                            key={table._id}
                            to={`/waiter/tables/${table._id}`}
                            className="rounded-xl border border-black/10 bg-paper hover:border-ember/40 hover:shadow-md transition-all p-4 flex flex-col gap-2"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-lg font-semibold text-ink">
                                    {table.table_number}
                                </span>
                                <Badge tone={statusToneMap[table.status] || "muted"}>
                                    {table.status}
                                </Badge>
                            </div>
                            <span className="text-xs text-charcoal/60">
                                Seats {table.seating_capacity} · {table.zone}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default WaiterDashboard;