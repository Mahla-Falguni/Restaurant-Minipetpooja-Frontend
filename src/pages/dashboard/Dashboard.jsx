import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuRefreshCw, LuTriangleAlert } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Loader from "../../components/common/Loader";
import { getDashboardOverview } from "../../redux/dashboard/dashboardSlice";
import { getGreeting } from "../../utils/formatters";

import ManagementDashboard from "../../components/dashboard/ManagementDashboard";
import CashierHome from "../../components/dashboard/CashierHome";
import WaiterHome from "../../components/dashboard/WaiterHome";
import KitchenHome from "../../components/dashboard/KitchenHome";

/*
=========================================
DASHBOARD
=========================================
*/

const Dashboard = () => {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { overview, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardOverview());
  }, [dispatch]);

  const firstName = user?.first_name || "there";
  const role = user?.role;

  const renderContent = () => {

    if (loading && !overview) {
      return (
        <div className="flex justify-center py-24">
          <Loader />
        </div>
      );
    }

    if (error && !overview) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <LuTriangleAlert size={28} className="text-claret" />
          <p className="text-sm text-slate max-w-sm">{error}</p>
          <button
            onClick={() => dispatch(getDashboardOverview())}
            className="flex items-center gap-1.5 text-sm font-semibold text-ember hover:text-ember-dark"
          >
            <LuRefreshCw size={14} />
            Try again
          </button>
        </div>
      );
    }

    if (!overview) return null;

    switch (overview.dashboard_type) {

      case "management":
        return <ManagementDashboard overview={overview} role={role} />;

      case "cashier":
        return <CashierHome overview={overview} />;

      case "waiter":
        return <WaiterHome overview={overview} />;

      case "kitchen":
        return <KitchenHome overview={overview} />;

      default:
        return null;

    }

  };

  return (
    <DashboardLayout>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-sm text-slate mt-1">
            {overview?.restaurant_name || "Here's what's happening"}
            {role ? ` · ${role}` : ""}
          </p>
        </div>

        {overview && (
          <button
            onClick={() => dispatch(getDashboardOverview())}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 h-9 text-sm font-medium text-slate hover:text-ink disabled:opacity-50"
          >
            <LuRefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        )}
      </div>

      {renderContent()}

    </DashboardLayout>
  );

};

export default Dashboard;