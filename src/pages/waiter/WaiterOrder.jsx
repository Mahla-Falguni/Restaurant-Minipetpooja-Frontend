import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../layouts/DashboardLayouts";
import TicketCard from "../../components/TicketCard";
import Badge from "../../components/kitchen/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/EmptyState";
import {
    fetchWaiterOrders,
    markOrderServed,
    requestBillForTable
} from "../../redux/waiter/waiterSlice";

const itemStatusTone = {
    Pending: "warning",
    Preparing: "ember",
    Ready: "success",
    Served: "muted"
};

const WaiterOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, actionLoading } = useSelector((state) => state.waiter);

    useEffect(() => {
        dispatch(fetchWaiterOrders({ status: "Active" }));
    }, [dispatch]);

    if (!loading && orders.length === 0) {
        return (
            <DashboardLayout title="My Orders" subtitle="Orders currently open on your tables">
                <EmptyState
                    title="No active orders"
                    subtitle="Orders you place will show up here until they're paid and closed."
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Orders" subtitle="Orders currently open on your tables">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {orders.map((order) => {
                    const allReady = order.items?.every((i) => i.status === "Ready" || i.status === "Served");

                    return (
                        <TicketCard key={order._id}>
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-mono text-sm text-charcoal/50">
                                        #{order.order_number}
                                    </p>
                                    <p className="font-display text-lg text-ink">
                                        Table {order.table_number || order.table_id?.table_number}
                                    </p>
                                </div>
                                <Badge tone={order.bill_requested ? "warning" : "ember"}>
                                    {order.bill_requested ? "Bill Requested" : order.order_status}
                                </Badge>
                            </div>

                            <ul className="divide-y divide-black/5 mb-4">
                                {order.items?.map((item) => (
                                    <li key={item._id} className="py-2 flex items-center justify-between text-sm">
                                        <span className="text-charcoal">
                                            {item.quantity}× {item.item_name}
                                        </span>
                                        <Badge tone={itemStatusTone[item.status] || "muted"} size="sm">
                                            {item.status}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-center justify-between pt-2 border-t border-dashed border-black/10">
                                <span className="font-mono text-lg font-semibold text-ink">
                                    ₹{order.grand_total?.toFixed(2)}
                                </span>
                                <div className="flex gap-2">
                                    {allReady && !order.bill_requested && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            loading={actionLoading}
                                            onClick={() => dispatch(markOrderServed(order._id))}
                                        >
                                            Mark Served
                                        </Button>
                                    )}
                                    {!order.bill_requested && (
                                        <Button
                                            size="sm"
                                            loading={actionLoading}
                                            onClick={() => dispatch(requestBillForTable(order._id))}
                                        >
                                            Request Bill
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </TicketCard>
                    );
                })}
            </div>
        </DashboardLayout>
    );
};

export default WaiterOrders;