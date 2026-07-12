import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Badge from "../../components/kitchen/Badge";
import { getOrderById, clearActiveOrder } from "../../redux/order/orderSlice";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { activeOrder: order, detailLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderById(id));
    return () => dispatch(clearActiveOrder());
  }, [dispatch, id]);

  return (
    <DashboardLayout title="Order Details" subtitle={order ? `Order ${order.order_number}` : ""}>

      <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-ink mb-6">
        <LuArrowLeft size={16} />
        Back to Orders
      </Link>

      {detailLoading && <p className="text-charcoal/50">Loading order…</p>}

      {error && (
        <div className="rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret max-w-md">
          {error}
        </div>
      )}

      {!detailLoading && order && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 rounded-2xl border border-line bg-white p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-display text-xl text-ink">{order.order_number}</h2>
                <p className="text-sm text-charcoal/50">
                  Table {order.table_id?.table_number ?? "—"} · {order.order_type}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge>{order.order_status}</Badge>
                <Badge>{order.payment_status}</Badge>
              </div>
            </div>

            <div className="divide-y divide-line">
              {(order.items || []).map((item) => (
                <div key={item._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {item.quantity} × {item.item_name}
                    </p>
                    {item.spice_level && (
                      <p className="text-xs text-charcoal/40">{item.spice_level}</p>
                    )}
                  </div>
                  <p className="font-mono text-sm text-ink">
                    ₹{Number(item.total_price ?? 0).toFixed(2)}
                  </p>
                </div>
              ))}

              {!order.items?.length && (
                <p className="py-3 text-sm text-charcoal/40">No items recorded for this order.</p>
              )}
            </div>

            {order.special_instruction && (
              <div className="mt-5 rounded-xl bg-paper-dim px-4 py-3 text-sm text-charcoal/70">
                <span className="font-semibold text-ink">Note: </span>
                {order.special_instruction}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-6 h-fit">
            <h3 className="font-display text-lg text-ink mb-4">Bill Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-charcoal/60">
                <span>Subtotal</span>
                <span className="font-mono">₹{Number(order.subtotal ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal/60">
                <span>Discount</span>
                <span className="font-mono">− ₹{Number(order.discount ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal/60">
                <span>CGST + SGST</span>
                <span className="font-mono">
                  ₹{(Number(order.cgst ?? 0) + Number(order.sgst ?? 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-charcoal/60">
                <span>Service Charge</span>
                <span className="font-mono">₹{Number(order.service_charge ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-line font-semibold text-ink">
                <span>Grand Total</span>
                <span className="font-mono">₹{Number(order.grand_total ?? 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-line text-sm text-charcoal/60 space-y-1">
              <p>{order.customer_name}</p>
              {order.customer_phone && <p>{order.customer_phone}</p>}
              <p className="capitalize">Payment: {order.payment_method}</p>
            </div>
          </div>

        </div>
      )}

    </DashboardLayout>
  );
};

export default OrderDetails;