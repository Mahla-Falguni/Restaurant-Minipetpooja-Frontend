import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuScrollText } from "react-icons/lu";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import { Card } from "../../components/cards/StatCard";
import EmptyState from "../../components/EmptyState";
import { formatRelativeTime } from "../../utils/formatters";
import { getActivityLog } from "../../redux/superAdmin/superAdminRestaurantSlice";

const ActivityLog = () => {

  const dispatch = useDispatch();
  const { activityLogs, loading } = useSelector((state) => state.superAdminRestaurants);

  useEffect(() => {
    dispatch(getActivityLog({ limit: 50 }));
  }, [dispatch]);

  return (
    <SuperAdminLayout title="Activity Log" subtitle="Audit trail of platform-level actions">

      {loading ? (
        <div className="text-sm text-slate">Loading activity…</div>
      ) : !activityLogs?.length ? (
        <Card>
          <EmptyState
            icon={LuScrollText}
            title="No activity yet"
            description="Platform-level actions (like plan changes) will show up here."
          />
        </Card>
      ) : (
        <Card className="divide-y divide-line">
          {activityLogs.map((log) => (
            <div key={log._id} className="flex items-start justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{log.action}</p>
                <p className="text-xs text-slate mt-0.5">
                  {log.target_restaurant_id?.restaurant_name || "Platform-wide"}
                  {log.details ? ` — ${log.details}` : ""}
                </p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs text-slate">{log.super_admin_id?.name}</p>
                <p className="text-xs text-slate/60">{formatRelativeTime(log.createdAt)}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

    </SuperAdminLayout>
  );

};

export default ActivityLog;