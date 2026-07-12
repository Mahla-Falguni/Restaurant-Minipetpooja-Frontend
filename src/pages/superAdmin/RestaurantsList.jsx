import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuSearch, LuBuilding2, LuEye } from "react-icons/lu";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import { Card } from "../../components/cards/StatCard";
import Badge from "../../components/kitchen/Badge";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/common/Button";
import { Input, Select } from "../../components/Input";
import { formatCurrency } from "../../utils/formatters";
import { getAllRestaurants } from "../../redux/superAdmin/superAdminRestaurantSlice";

/*
=========================================================
RESTAURANTS — VIEW ONLY
The super admin can monitor every restaurant on the platform,
but there are deliberately no suspend/edit/delete actions here.
Clicking a row opens a read-only detail + report view.
=========================================================
*/

const RestaurantsList = () => {

  const dispatch = useDispatch();
  const { restaurants, pagination, loading } = useSelector((state) => state.superAdminRestaurants);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllRestaurants({ search: search || undefined, status: status || undefined, page, limit: 20 }));
  }, [dispatch, search, status, page]);

  return (
    <SuperAdminLayout title="Restaurants" subtitle="Read-only view of every restaurant on the platform">

      <Card className="p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">

          <div className="relative flex-1">
            <Input
              placeholder="Search by name, owner, email, or phone…"
              value={search}
              onChange={(e) => { setPage(1); setSearch(e.target.value); }}
              className="pl-10"
            />
            <LuSearch size={16} className="absolute left-3 top-[13px] text-slate/50" />
          </div>

          <Select
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
            className="sm:w-48"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </Select>

        </div>
      </Card>

      {loading ? (
        <div className="text-sm text-slate">Loading restaurants…</div>
      ) : !restaurants?.length ? (
        <Card>
          <EmptyState
            icon={LuBuilding2}
            title="No restaurants found"
            description="Try adjusting your search or status filter."
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-dim/50 text-left">
                <th className="px-5 py-3 font-semibold text-slate">Restaurant</th>
                <th className="px-5 py-3 font-semibold text-slate">Owner</th>
                <th className="px-5 py-3 font-semibold text-slate">Status</th>
                <th className="px-5 py-3 font-semibold text-slate">Plan</th>
                <th className="px-5 py-3 font-semibold text-slate">Billing</th>
                <th className="px-5 py-3 font-semibold text-slate text-right">View</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r._id} className="border-b border-line last:border-0 hover:bg-paper-dim/30">
                  <td className="px-5 py-3">
                    <p className="font-medium text-ink">{r.restaurant_name}</p>
                    <p className="text-xs text-slate">{r.email}</p>
                  </td>
                  <td className="px-5 py-3 text-charcoal">{r.owner_name}</td>
                  <td className="px-5 py-3">
                    <Badge>{r.status || "Active"}</Badge>
                  </td>
                  <td className="px-5 py-3 text-charcoal">
                    {r.subscription?.plan_id?.plan_name || <span className="text-slate/60">No plan</span>}
                  </td>
                  <td className="px-5 py-3 text-charcoal">
                    {r.subscription?.plan_id?.price
                      ? `${formatCurrency(r.subscription.plan_id.price)} / ${r.subscription.plan_id.billing_cycle}`
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/super-admin/restaurants/${r._id}`}>
                      <Button variant="outline" size="sm" icon={LuEye}>View</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-line text-sm">
              <span className="text-slate">
                Page {pagination.page} of {pagination.pages} · {pagination.total} total
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

    </SuperAdminLayout>
  );

};

export default RestaurantsList;