import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayouts";
import Badge from "../../components/kitchen/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/EmptyState";
import { fetchWaiterTables } from "../../redux/waiter/waiterSlice";

const statusToneMap = {
    Available: "success",
    Occupied: "ember",
    Reserved: "warning",
    Cleaning: "muted",
    "Out of Service": "muted"
};

const WaiterTables = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tables, loading } = useSelector((state) => state.waiter);
    const [zoneFilter, setZoneFilter] = useState("All");

    useEffect(() => {
        dispatch(fetchWaiterTables());
    }, [dispatch]);

    const zones = ["All", ...new Set(tables.map((t) => t.zone))];

    const filtered =
        zoneFilter === "All" ? tables : tables.filter((t) => t.zone === zoneFilter);

    return (
        <DashboardLayout title="Floor Plan" subtitle="Tap a table to take or view an order">
            <div className="flex flex-wrap gap-2 mb-6">
                {zones.map((zone) => (
                    <button
                        key={zone}
                        onClick={() => setZoneFilter(zone)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${zoneFilter === zone
                                ? "bg-ink text-paper border-ink"
                                : "bg-transparent text-charcoal/70 border-black/10 hover:border-ink/30"
                            }`}
                    >
                        {zone}
                    </button>
                ))}
            </div>

            {filtered.length === 0 && !loading ? (
                <EmptyState title="No tables in this zone" />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filtered.map((table) => (
                        <div
                            key={table._id}
                            onClick={() => navigate(`/waiter/tables/${table._id}`)}
                            className={`cursor-pointer rounded-2xl p-5 flex flex-col gap-3 border transition-all hover:shadow-lg hover:-translate-y-0.5 ${table.status === "Available"
                                    ? "bg-basil/5 border-basil/30"
                                    : table.status === "Occupied"
                                        ? "bg-ember/5 border-ember/30"
                                        : "bg-paper border-black/10"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-2xl font-semibold text-ink">
                                    {table.table_number}
                                </span>
                                <Badge tone={statusToneMap[table.status] || "muted"}>
                                    {table.status}
                                </Badge>
                            </div>
                            <span className="text-sm text-charcoal/60">
                                Seats {table.seating_capacity}
                            </span>
                            {table.status === "Available" && (
                                <Button size="sm" variant="ghost" className="mt-auto self-start">
                                    Start Order
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default WaiterTables;