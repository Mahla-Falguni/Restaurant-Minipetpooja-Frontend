import { Card } from "../cards/StatCard";
import Badge from "../kitchen/Badge";

/*
=========================================
ORDER PIPELINE
Today's orders broken down by status — a quick read on
where the floor's bottlenecks are right now.
=========================================
*/

const PIPELINE_ORDER = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Served",
  "Completed",
  "Cancelled",
  "Rejected",
];

const OrderPipeline = ({ breakdown = [] }) => {

  const countMap = breakdown.reduce((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {});

  const totalToday = breakdown.reduce((sum, row) => sum + row.count, 0);

  return (
    <Card className="p-6">

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-base font-semibold text-ink">
          Today's order pipeline
        </h3>
        <span className="text-xs font-semibold text-slate">
          {totalToday} total
        </span>
      </div>

      {totalToday === 0 ? (
        <div className="flex items-center justify-center h-24 text-sm text-slate">
          No orders placed yet today.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PIPELINE_ORDER.filter((status) => countMap[status]).map((status) => (
            <div
              key={status}
              className="rounded-lg border border-line px-3 py-3 flex flex-col gap-2"
            >
              <Badge>{status}</Badge>
              <span className="font-tabular text-2xl font-semibold text-ink">
                {countMap[status]}
              </span>
            </div>
          ))}
        </div>
      )}

    </Card>
  );

};

export default OrderPipeline;