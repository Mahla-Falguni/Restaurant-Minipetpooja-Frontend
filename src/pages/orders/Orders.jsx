import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuClipboardList, LuChevronRight } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Badge from "../../components/kitchen/Badge";
import { getOrders } from "../../redux/order/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  return (
    <DashboardLayout title="Orders" subtitle="Every order placed across the floor">

      {loading && !orders?.length && (
        <p className="text-charcoal/50">Loading orders…</p>
      )}

      {error && (
        <div className="rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret mb-5">
          {error}
        </div>
      )}

      {!loading && !orders?.length && !error && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuClipboardList size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No orders yet</h2>
          <p className="text-charcoal/50">Orders placed by customers will show up here.</p>
        </div>
      )}

      {!!orders?.length && (
        <div className="rounded-2xl border border-line bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-dim text-left text-xs uppercase tracking-wide text-charcoal/50">
                <th className="px-5 py-3 font-semibold">Order #</th>
                <th className="px-5 py-3 font-semibold">Table</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Payment</th>
                <th className="px-5 py-3 font-semibold text-right">Total</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-line last:border-0 hover:bg-paper-dim/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-ink">{order.order_number}</td>
                  <td className="px-5 py-3.5 text-charcoal/70">
                    {order.table_id?.table_number ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-charcoal/70">{order.customer_name}</td>
                  <td className="px-5 py-3.5 text-charcoal/70">{order.order_type}</td>
                  <td className="px-5 py-3.5"><Badge>{order.order_status}</Badge></td>
                  <td className="px-5 py-3.5"><Badge>{order.payment_status}</Badge></td>
                  <td className="px-5 py-3.5 text-right font-mono text-ink">
                    ₹{Number(order.grand_total ?? 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center text-charcoal/40 hover:text-ember"
                    >
                      <LuChevronRight size={18} />
                    </Link>
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

export default Orders;