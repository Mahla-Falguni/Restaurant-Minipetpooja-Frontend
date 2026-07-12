import { useNavigate } from "react-router-dom";
import { LuArrowUpRight } from "react-icons/lu";

import { Card } from "../cards/StatCard";
import Badge from "../kitchen/Badge";
import EmptyState from "../EmptyState";
import { formatCurrency, formatRelativeTime } from "../../utils/formatters";

/*
=========================================
RECENT ORDERS TABLE
Reused across the management, cashier, and waiter views —
each passes whichever columns are relevant to it.
=========================================
*/

const RecentOrdersTable = ({
  title = "Recent orders",
  orders = [],
  showPaymentStatus = false,
  emptyMessage = "Orders will show up here as soon as they come in.",
  viewAllLink = "/orders",
}) => {

  const navigate = useNavigate();

  return (
    <Card className="p-6">

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-semibold text-ink">
          {title}
        </h3>

        {viewAllLink && orders.length > 0 && (
          <button
            onClick={() => navigate(viewAllLink)}
            className="flex items-center gap-1 text-xs font-semibold text-ember hover:text-ember-dark"
          >
            View all
            <LuArrowUpRight size={14} />
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <EmptyState title="Nothing here yet" description={emptyMessage} />
      ) : (
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left eyebrow">
                <th className="px-2 py-2 font-bold">Order</th>
                <th className="px-2 py-2 font-bold">Customer</th>
                <th className="px-2 py-2 font-bold">Amount</th>
                <th className="px-2 py-2 font-bold">Status</th>
                {showPaymentStatus && (
                  <th className="px-2 py-2 font-bold">Payment</th>
                )}
                <th className="px-2 py-2 font-bold text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-line hover:bg-paper-dim/60 cursor-pointer"
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <td className="px-2 py-3 font-tabular font-medium text-ink">
                    {order.order_number}
                  </td>
                  <td className="px-2 py-3 text-charcoal">
                    {order.customer_name || "—"}
                  </td>
                  <td className="px-2 py-3 font-tabular font-medium text-ink">
                    {formatCurrency(order.grand_total)}
                  </td>
                  <td className="px-2 py-3">
                    <Badge>{order.order_status}</Badge>
                  </td>
                  {showPaymentStatus && (
                    <td className="px-2 py-3">
                      <Badge>{order.payment_status}</Badge>
                    </td>
                  )}
                  <td className="px-2 py-3 text-right text-xs text-slate">
                    {formatRelativeTime(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </Card>
  );

};

export default RecentOrdersTable;