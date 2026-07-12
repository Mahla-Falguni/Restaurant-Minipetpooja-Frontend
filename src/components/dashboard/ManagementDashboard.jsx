import { useNavigate } from "react-router-dom";
import { LuClipboardList, LuWallet, LuReceipt, LuTable2, LuUsersRound, LuUserRoundCog, LuCalendarClock, LuFileClock, LuUtensilsCrossed, LuChartLine, LuQrCode, } from "react-icons/lu";

import StatCard, { Card } from "../cards/StatCard";
import RevenueTrendChart from "./RevenueTrendChart";
import OrderPipeline from "./OrderPipeline";
import RecentOrdersTable from "./RecentOrdersTable";
import TopItemsList from "./TopItemList";
import { formatCurrency } from "../../utils/formatters";

/*
=========================================
MANAGEMENT DASHBOARD
=========================================
*/

const QUICK_ACTIONS = [
  { to: "/orders", label: "Orders", icon: LuClipboardList, roles: ["Admin", "Manager"] },
  { to: "/tables", label: "Tables", icon: LuTable2, roles: ["Admin", "Manager"] },
  { to: "/menu", label: "Menu Items", icon: LuUtensilsCrossed, roles: ["Admin", "Manager"] },
  { to: "/staff", label: "Staff & Payroll", icon: LuUserRoundCog, roles: ["Admin", "Manager"] },
  { to: "/reservations", label: "Reservations", icon: LuCalendarClock, roles: ["Admin", "Manager"] },
  { to: "/qr", label: "QR Menu", icon: LuQrCode, roles: ["Admin", "Manager"] },
  { to: "/reports", label: "Reports", icon: LuChartLine, roles: ["Admin", "Manager"] },
];

const ManagementDashboard = ({ overview, role }) => {

  const navigate = useNavigate();
  const kpis = overview.kpis || {};

  const actions = QUICK_ACTIONS.filter((a) => a.roles.includes(role));

  return (
    <div className="space-y-6">

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          index={0}
          label="Orders Today"
          value={kpis.today_orders ?? 0}
          icon={LuClipboardList}
        />

        <StatCard
          index={1}
          label="Revenue Today"
          value={formatCurrency(kpis.today_revenue)}
          icon={LuWallet}
        />

        <StatCard
          index={2}
          label="Avg. Order Value"
          value={formatCurrency(kpis.average_order_value)}
          icon={LuReceipt}
        />

        <StatCard
          index={3}
          label="Tables Occupied"
          value={`${kpis.occupied_tables ?? 0} / ${kpis.total_tables ?? 0}`}
          icon={LuTable2}
        />

        <StatCard
          index={4}
          label="Customers"
          value={kpis.total_customers ?? 0}
          delta={kpis.new_customers_today ? `+${kpis.new_customers_today} today` : undefined}
          icon={LuUsersRound}
        />

        <StatCard
          index={5}
          label="Staff Active"
          value={kpis.staff_active ?? 0}
          icon={LuUserRoundCog}
        />

        <StatCard
          index={6}
          label="Reservations Today"
          value={kpis.reservations_today ?? 0}
          icon={LuCalendarClock}
        />

        <StatCard
          index={7}
          label="Pending Leave Requests"
          value={kpis.pending_leave_requests ?? 0}
          icon={LuFileClock}
        />

      </div>

      {/* Trend + pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <RevenueTrendChart data={overview.revenue_trend} />
        </div>
        <div className="xl:col-span-2">
          <OrderPipeline breakdown={overview.order_status_breakdown} />
        </div>
      </div>

      {/* Recent orders + top sellers */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <RecentOrdersTable
            orders={overview.recent_orders}
            showPaymentStatus
          />
        </div>
        <div className="xl:col-span-2">
          <TopItemsList items={overview.top_items} />
        </div>
      </div>

      {/* Quick actions */}
      <Card className="p-6">
        <h3 className="font-display text-base font-semibold text-ink mb-4">
          Quick actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {actions.map((action) => (
            <button
              key={action.to}
              onClick={() => navigate(action.to)}
              className="flex items-center gap-2.5 rounded-lg border border-line px-4 py-3 text-sm font-medium text-ink hover:border-ember hover:bg-ember-light/40 transition-colors text-left"
            >
              <action.icon size={17} className="text-ember shrink-0" />
              {action.label}
            </button>
          ))}
        </div>
      </Card>

    </div>
  );

};

export default ManagementDashboard;