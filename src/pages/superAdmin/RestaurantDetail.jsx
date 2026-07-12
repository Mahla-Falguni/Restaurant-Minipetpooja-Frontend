import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { LuArrowLeft, LuUsersRound, LuReceipt, LuUser } from "react-icons/lu";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import { Card, StatCard } from "../../components/cards/StatCard";
import Badge from "../../components/kitchen/Badge";
import { formatCurrency, formatShortDate } from "../../utils/formatters";
import {
  getRestaurantDetail,
  getRestaurantReport,
  clearSelectedRestaurant,
} from "../../redux/superAdmin/superAdminRestaurantSlice";

/*
=========================================================
RESTAURANT DETAIL — READ ONLY
No suspend / reactivate / edit controls on purpose. This page
exists purely so the super admin can see what's happening
inside a restaurant: its plan, its staff, and its recent sales.
=========================================================
*/

const RestaurantDetail = () => {

  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedRestaurant, report, loading, reportLoading } = useSelector(
    (state) => state.superAdminRestaurants
  );

  useEffect(() => {
    dispatch(getRestaurantDetail(id));
    dispatch(getRestaurantReport({ id }));

    return () => dispatch(clearSelectedRestaurant());
  }, [dispatch, id]);

  if (loading && !selectedRestaurant) {
    return (
      <SuperAdminLayout title="Restaurant">
        <div className="text-sm text-slate">Loading restaurant…</div>
      </SuperAdminLayout>
    );
  }

  if (!selectedRestaurant) {
    return (
      <SuperAdminLayout title="Restaurant">
        <div className="text-sm text-slate">Restaurant not found.</div>
      </SuperAdminLayout>
    );
  }

  const { restaurant, subscription, staff_count, primary_admin } = selectedRestaurant;

  return (
    <SuperAdminLayout title={restaurant.restaurant_name} subtitle="Read-only overview">

      <Link
        to="/super-admin/restaurants"
        className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-ink mb-6"
      >
        <LuArrowLeft size={15} /> Back to restaurants
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — PROFILE + SUBSCRIPTION */}
        <div className="lg:col-span-1 space-y-6">

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-ink">Profile</h3>
              <Badge>{restaurant.status || "Active"}</Badge>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate">Owner</dt>
                <dd className="text-ink font-medium">{restaurant.owner_name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate">Email</dt>
                <dd className="text-ink">{restaurant.email || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate">Phone</dt>
                <dd className="text-ink">{restaurant.phone || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate">City / State</dt>
                <dd className="text-ink">{[restaurant.city, restaurant.state].filter(Boolean).join(", ") || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate">GST Number</dt>
                <dd className="text-ink">{restaurant.gst_number || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate">Joined</dt>
                <dd className="text-ink">{formatShortDate(restaurant.createdAt)}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-base font-semibold text-ink mb-4">Subscription</h3>

            {!subscription ? (
              <p className="text-sm text-slate">No plan selected yet — restaurant hasn't subscribed.</p>
            ) : (
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate">Plan</dt>
                  <dd className="text-ink font-medium">{subscription.plan_id?.plan_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate">Status</dt>
                  <dd><Badge>{subscription.status}</Badge></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate">Price</dt>
                  <dd className="text-ink">
                    {formatCurrency(subscription.plan_id?.price)} / {subscription.plan_id?.billing_cycle}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate">Current period ends</dt>
                  <dd className="text-ink">{formatShortDate(subscription.current_period_end)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate">Auto-renew</dt>
                  <dd className="text-ink">{subscription.auto_renew ? "On" : "Off"}</dd>
                </div>
              </dl>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-base font-semibold text-ink mb-4">Primary Admin</h3>
            {primary_admin ? (
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper-dim text-slate">
                  <LuUser size={18} />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{primary_admin.name}</p>
                  <p className="text-xs text-slate">{primary_admin.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate">No admin account found.</p>
            )}
          </Card>

        </div>

        {/* RIGHT — REPORT SNAPSHOT */}
        <div className="lg:col-span-2 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              index={0}
              label="Staff Accounts"
              value={staff_count}
              icon={LuUsersRound}
            />
            <StatCard
              index={1}
              label="Orders (30 days)"
              value={reportLoading ? "…" : report?.summary?.total_orders ?? 0}
              icon={LuReceipt}
            />
            <StatCard
              index={2}
              label="Sales (30 days)"
              value={reportLoading ? "…" : formatCurrency(report?.summary?.gross_sales)}
              icon={LuReceipt}
            />
          </div>

          <Card className="p-6">
            <h3 className="font-display text-base font-semibold text-ink mb-1">
              Daily sales trend
            </h3>
            <p className="text-xs text-slate mb-5">Last 30 days, read-only snapshot</p>

            {reportLoading ? (
              <div className="text-sm text-slate py-8 text-center">Loading report…</div>
            ) : !report?.daily_trend?.length ? (
              <div className="text-sm text-slate py-8 text-center">No orders recorded in this window yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-line">
                      <th className="py-2 font-semibold text-slate">Date</th>
                      <th className="py-2 font-semibold text-slate">Orders</th>
                      <th className="py-2 font-semibold text-slate">Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.daily_trend.map((row) => (
                      <tr key={row._id} className="border-b border-line last:border-0">
                        <td className="py-2 text-ink">{row._id}</td>
                        <td className="py-2 text-charcoal">{row.orders}</td>
                        <td className="py-2 text-charcoal">{formatCurrency(row.sales)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

        </div>

      </div>

    </SuperAdminLayout>
  );

};

export default RestaurantDetail;