import { Card } from "../cards/StatCard";
import EmptyState from "../EmptyState";
import { LuUtensilsCrossed } from "react-icons/lu";
import { formatCurrency, formatCompactNumber } from "../../utils/formatters";

/*
=========================================
TOP ITEMS LIST
Today's best sellers by quantity — ranked, with a lightweight
progress bar relative to the top item.
=========================================
*/

const TopItemsList = ({ items = [] }) => {

  const maxQty = Math.max(...items.map((i) => i.quantity), 1);

  return (
    <Card className="p-6">

      <h3 className="font-display text-base font-semibold text-ink mb-4">
        Top sellers today
      </h3>

      {items.length === 0 ? (
        <EmptyState
          icon={LuUtensilsCrossed}
          title="No items sold yet"
          description="Your best-selling dishes today will appear here."
        />
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={item.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-ink truncate pr-2">
                  {i + 1}. {item.name}
                </span>
                <span className="font-tabular text-slate shrink-0">
                  {formatCompactNumber(item.quantity)} sold · {formatCurrency(item.revenue)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-paper-dim overflow-hidden">
                <div
                  className="h-full rounded-full bg-ember"
                  style={{ width: `${(item.quantity / maxQty) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </Card>
  );

};

export default TopItemsList;