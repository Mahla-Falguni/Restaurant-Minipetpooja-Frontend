import { useNavigate } from "react-router-dom";
import {
  LuTable2,
  LuClipboardList,
  LuBellRing,
  LuArrowRight,
} from "react-icons/lu";

import StatCard, { Card } from "../cards/StatCard";
import Badge from "../kitchen/Badge";
import EmptyState from "../EmptyState";
import RecentOrdersTable from "./RecentOrdersTable";

/*
=========================================
WAITER HOME
Landing view for the Waiter role — assigned tables at a
glance, what needs serving right now, and a shortcut into
the full floor view.
=========================================
*/

const WaiterHome = ({ overview }) => {

  const navigate = useNavigate();
  const kpis = overview.kpis || {};
  const myTables = overview.my_tables || [];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          index={0}
          label="Assigned Tables"
          value={myTables.length}
          icon={LuTable2}
        />

        <StatCard
          index={1}
          label="Active Orders"
          value={kpis.active_orders ?? 0}
          icon={LuClipboardList}
        />

        <StatCard
          index={2}
          label="Ready to Serve"
          value={kpis.ready_to_serve ?? 0}
          icon={LuBellRing}
        />

        <StatCard
          index={3}
          label="Tables Occupied"
          value={kpis.tables_needing_attention ?? 0}
          icon={LuTable2}
        />

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        <div className="xl:col-span-2">
          <Card className="p-6">
            <h3 className="font-display text-base font-semibold text-ink mb-4">
              My tables
            </h3>

            {myTables.length === 0 ? (
              <EmptyState
                icon={LuTable2}
                title="No tables assigned"
                description="Ask your manager to assign you a section for this shift."
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {myTables.map((table) => (
                  <div
                    key={table.table_number}
                    className="rounded-lg border border-line px-3 py-3 flex flex-col gap-1.5"
                  >
                    <span className="font-tabular font-semibold text-ink">
                      Table {table.table_number}
                    </span>
                    <span className="text-xs text-slate">{table.zone} · seats {table.seating_capacity}</span>
                    <Badge>{table.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          <RecentOrdersTable
            title="My recent orders"
            orders={overview.recent_orders}
            viewAllLink="/waiter/orders"
            emptyMessage="Orders you take will show up here."
          />
        </div>

      </div>

      <button
        onClick={() => navigate("/waiter")}
        className="flex items-center gap-2 rounded-lg bg-ink text-white px-5 py-3 text-sm font-semibold hover:bg-ink-soft"
      >
        Go to floor view
        <LuArrowRight size={16} />
      </button>

    </div>
  );

};

export default WaiterHome;