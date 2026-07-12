import { motion } from "framer-motion";

import { Card } from "../cards/StatCard";
import { formatCurrency, formatShortDate } from "../../utils/formatters";

/*
=========================================
REVENUE TREND CHART
Lightweight SVG bar chart — no charting library needed.
Shows the last 7 days of sales so Admin/Manager can spot
the trend at a glance.
=========================================
*/

const RevenueTrendChart = ({ data = [] }) => {

  const hasData = data.length > 0;

  const maxSales = Math.max(...data.map((d) => d.sales), 1);

  const chartHeight = 160;
  const barGap = 14;
  const barWidth = 32;

  return (
    <Card className="p-6">

      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">
            Revenue — last 7 days
          </h3>
          <p className="text-xs text-slate mt-0.5">
            Daily sales, excluding cancelled orders
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex items-center justify-center h-40 text-sm text-slate">
          No sales recorded in this window yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${data.length * (barWidth + barGap)} ${chartHeight + 40}`}
            width="100%"
            height={chartHeight + 40}
            className="min-w-[420px]"
          >
            {data.map((point, i) => {

              const barHeight = (point.sales / maxSales) * chartHeight;
              const x = i * (barWidth + barGap) + barGap / 2;
              const y = chartHeight - barHeight;

              return (
                <g key={point.date}>

                  <motion.rect
                    x={x}
                    y={chartHeight}
                    width={barWidth}
                    rx={6}
                    fill="var(--color-ember)"
                    initial={{ height: 0, y: chartHeight }}
                    animate={{ height: barHeight, y }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
                  />

                  <text
                    x={x + barWidth / 2}
                    y={chartHeight + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--color-slate)"
                    fontFamily="var(--font-sans)"
                  >
                    {formatShortDate(point.date)}
                  </text>

                  <text
                    x={x + barWidth / 2}
                    y={Math.max(y - 6, 12)}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--color-ink)"
                    fontFamily="var(--font-mono)"
                  >
                    {formatCurrency(point.sales).replace("₹", "")}
                  </text>

                </g>
              );

            })}
          </svg>
        </div>
      )}

    </Card>
  );

};

export default RevenueTrendChart;