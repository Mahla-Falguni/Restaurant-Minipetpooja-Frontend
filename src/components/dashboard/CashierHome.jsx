import { useNavigate } from "react-router-dom";
import {
  LuWallet,
  LuReceipt,
  LuClock,
  LuLockKeyholeOpen,
  LuArrowRight,
} from "react-icons/lu";

import StatCard, { Card } from "../cards/StatCard";
import RecentOrdersTable from "./RecentOrdersTable";
import { formatCurrency } from "../../utils/formatters";

/*
=========================================
CASHIER HOME
Landing view for the Cashier role — today's collections,
the state of their cash drawer, and a shortcut into the
full billing counter.
=========================================
*/

const CashierHome = ({ overview }) => {

  const navigate = useNavigate();
  const kpis = overview.kpis || {};
  const drawer = overview.active_drawer;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          index={0}
          label="Today's Collections"
          value={formatCurrency(kpis.today_collections)}
          icon={LuWallet}
        />

        <StatCard
          index={1}
          label="Orders Billed"
          value={kpis.today_orders_billed ?? 0}
          icon={LuReceipt}
        />

        <StatCard
          index={2}
          label="Pending Payments"
          value={kpis.pending_payments ?? 0}
          icon={LuClock}
        />

        <StatCard
          index={3}
          label="Drawer Status"
          value={kpis.drawer_status || "Closed"}
          icon={LuLockKeyholeOpen}
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        <div className="xl:col-span-2 space-y-6">

          <Card className="p-6">
            <h3 className="font-display text-base font-semibold text-ink mb-4">
              Payment mode split (today)
            </h3>

            {(!overview.payment_breakdown || overview.payment_breakdown.length === 0) ? (
              <p className="text-sm text-slate">No payments recorded yet today.</p>
            ) : (
              <div className="space-y-3">
                {overview.payment_breakdown.map((row) => (
                  <div key={row.method} className="flex items-center justify-between text-sm">
                    <span className="text-charcoal font-medium">{row.method}</span>
                    <span className="font-tabular font-semibold text-ink">
                      {formatCurrency(row.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {drawer ? (
            <Card className="p-6">
              <h3 className="font-display text-base font-semibold text-ink mb-4">
                Your open drawer
              </h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <span className="text-slate">Opening balance</span>
                <span className="text-right font-tabular font-medium text-ink">
                  {formatCurrency(drawer.opening_balance)}
                </span>
                <span className="text-slate">Cash received</span>
                <span className="text-right font-tabular font-medium text-ink">
                  {formatCurrency(drawer.cash_received)}
                </span>
                <span className="text-slate">UPI received</span>
                <span className="text-right font-tabular font-medium text-ink">
                  {formatCurrency(drawer.upi_received)}
                </span>
                <span className="text-slate">Card received</span>
                <span className="text-right font-tabular font-medium text-ink">
                  {formatCurrency(drawer.card_received)}
                </span>
              </div>
            </Card>
          ) : (
            <Card className="p-6 flex flex-col items-start gap-3">
              <h3 className="font-display text-base font-semibold text-ink">
                No drawer open
              </h3>
              <p className="text-sm text-slate">
                Open a cash drawer from the billing counter before taking payments.
              </p>
              <button
                onClick={() => navigate("/cashier")}
                className="flex items-center gap-1.5 text-sm font-semibold text-ember hover:text-ember-dark"
              >
                Go to billing counter
                <LuArrowRight size={15} />
              </button>
            </Card>
          )}

        </div>

        <div className="xl:col-span-3">
          <RecentOrdersTable
            orders={overview.recent_orders}
            showPaymentStatus
            viewAllLink="/orders"
          />
        </div>

      </div>

      <button
        onClick={() => navigate("/cashier")}
        className="flex items-center gap-2 rounded-lg bg-ink text-white px-5 py-3 text-sm font-semibold hover:bg-ink-soft"
      >
        Open billing counter
        <LuArrowRight size={16} />
      </button>

    </div>
  );

};

export default CashierHome;