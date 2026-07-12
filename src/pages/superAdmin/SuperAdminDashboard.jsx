import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LuBuilding2,
  LuUsersRound,
  LuCircleCheck,
  LuCircleSlash,
  LuTrendingUp,
} from "react-icons/lu";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import { Card, StatCard } from "../../components/cards/StatCard";
import Badge from "../../components/kitchen/Badge";
import EmptyState from "../../components/EmptyState";
import { formatCurrency, formatCompactNumber } from "../../utils/formatters";
import { getPlatformOverview } from "../../redux/superAdmin/superAdminAnalyticsSlice";

const SuperAdminDashboard = () => {

  const dispatch = useDispatch();
  const { overview, loading } = useSelector((state) => state.superAdminAnalytics);

  useEffect(() => {
    dispatch(getPlatformOverview());
  }, [dispatch]);

  const totalMRR = overview?.revenue_by_plan?.reduce((sum, p) => sum + (p.total_mrr || 0), 0) || 0;

  const maxMRR = Math.max(...(overview?.revenue_by_plan?.map((p) => p.total_mrr) || [1]), 1);

  return (
    <SuperAdminLayout title="Platform Overview" subtitle="Everything happening across every restaurant, at a glance">

      {loading && !overview ? (
        <div className="text-sm text-slate">Loading platform data…</div>
      ) : !overview ? (
        <EmptyState title="No data yet" description="Platform metrics will appear here once restaurants sign up." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

            <StatCard
              index={0}
              label="Total Restaurants"
              value={formatCompactNumber(overview.total_restaurants)}
              icon={LuBuilding2}
            />

            <StatCard
              index={1}
              label="Active"
              value={formatCompactNumber(overview.active_restaurants)}
              icon={LuCircleCheck}
            />

            <StatCard
              index={2}
              label="Suspended"
              value={formatCompactNumber(overview.suspended_restaurants)}
              icon={LuCircleSlash}
            />

            <StatCard
              index={3}
              label="Staff Accounts"
              value={formatCompactNumber(overview.total_staff_accounts)}
              icon={LuUsersRound}
            />

            <StatCard
              index={4}
              label="New (30 days)"
              value={formatCompactNumber(overview.new_restaurants_last_30_days)}
              icon={LuTrendingUp}
              delta={overview.new_restaurants_last_30_days > 0 ? "growing" : undefined}
            />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* REVENUE BY PLAN */}
            <Card className="p-6">

              <div className="flex items-center justify-between mb-1">
                <h3 className="font-display text-base font-semibold text-ink">
                  Revenue by plan (MRR)
                </h3>
                <span className="font-tabular text-sm font-semibold text-ink">
                  {formatCurrency(totalMRR)}
                </span>
              </div>
              <p className="text-xs text-slate mb-5">
                Monthly recurring revenue from active subscriptions
              </p>

              {!overview.revenue_by_plan?.length ? (
                <EmptyState title="No active subscriptions yet" />
              ) : (
                <div className="space-y-4">
                  {overview.revenue_by_plan.map((plan) => (
                    <div key={plan._id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-ink">{plan._id}</span>
                        <span className="text-slate">
                          {formatCurrency(plan.total_mrr)} · {plan.subscriber_count} subscriber{plan.subscriber_count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-paper-dim overflow-hidden">
                        <div
                          className="h-full bg-ember rounded-full"
                          style={{ width: `${(plan.total_mrr / maxMRR) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </Card>

            {/* SUBSCRIPTION STATUS BREAKDOWN */}
            <Card className="p-6">

              <h3 className="font-display text-base font-semibold text-ink mb-1">
                Subscription status breakdown
              </h3>
              <p className="text-xs text-slate mb-5">
                Across all restaurants on the platform
              </p>

              {!overview.subscription_breakdown?.length ? (
                <EmptyState title="No subscriptions yet" />
              ) : (
                <div className="flex flex-wrap gap-3">
                  {overview.subscription_breakdown.map((row) => (
                    <div
                      key={row._id}
                      className="flex-1 min-w-[120px] rounded-lg border border-line p-4"
                    >
                      <Badge tone={
                        row._id === "Active" ? "basil"
                          : row._id === "Trial" ? "saffron"
                          : row._id === "Suspended" || row._id === "Cancelled" ? "claret"
                          : "slate"
                      }>
                        {row._id}
                      </Badge>
                      <p className="font-tabular text-2xl font-semibold text-ink mt-3">
                        {row.count}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </Card>

          </div>
        </>
      )}

    </SuperAdminLayout>
  );

};

export default SuperAdminDashboard;