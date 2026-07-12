import { useNavigate } from "react-router-dom";
import {
  LuClipboardList,
  LuFlame,
  LuUtensils,
  LuCheckCheck,
  LuArrowRight,
} from "react-icons/lu";

import StatCard, { Card } from "../cards/StatCard";
import Badge from "../kitchen/Badge";
import EmptyState from "../EmptyState";
import { formatRelativeTime } from "../../utils/formatters";

/*
=========================================
KITCHEN HOME
=========================================
*/

const KitchenHome = ({ overview }) => {

  const navigate = useNavigate();
  const kpis = overview.kpis || {};
  const queue = overview.queue || [];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">

        <StatCard
          index={0}
          label="Pending"
          value={kpis.pending ?? 0}
          icon={LuClipboardList}
        />

        <StatCard
          index={1}
          label="Accepted"
          value={kpis.accepted ?? 0}
          icon={LuClipboardList}
        />

        <StatCard
          index={2}
          label="Preparing"
          value={kpis.preparing ?? 0}
          icon={LuFlame}
        />

        <StatCard
          index={3}
          label="Ready"
          value={kpis.ready ?? 0}
          icon={LuUtensils}
        />

        <StatCard
          index={4}
          label="Completed Today"
          value={kpis.completed_today ?? 0}
          icon={LuCheckCheck}
        />

      </div>

      <Card className="p-6">
        <h3 className="font-display text-base font-semibold text-ink mb-4">
          Oldest tickets waiting
        </h3>

        {queue.length === 0 ? (
          <EmptyState
            icon={LuCheckCheck}
            title="Queue is clear"
            description="No pending or in-progress tickets right now."
          />
        ) : (
          <div className="space-y-2">
            {queue.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between rounded-lg border border-line px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-tabular font-semibold text-ink">
                    {order.order_number}
                  </span>
                  <span className="text-xs text-slate">
                    {order.order_type} · {order.total_items} items
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate">
                    {formatRelativeTime(order.createdAt)}
                  </span>
                  <Badge>{order.order_status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <button
        onClick={() => navigate("/kitchen")}
        className="flex items-center gap-2 rounded-lg bg-ink text-white px-5 py-3 text-sm font-semibold hover:bg-ink-soft"
      >
        Open kitchen display
        <LuArrowRight size={16} />
      </button>

    </div>
  );

};

export default KitchenHome;