import { motion } from "framer-motion";

/*
=========================================
CARD
Base ticket-edge card used throughout the dashboard.
=========================================
*/

export const Card = ({ children, className = "", hoverable = false, ...rest }) => {

  return (
    <div
      className={`
        ticket-edge bg-white rounded-[var(--radius-ticket)]
        border border-line shadow-[0_1px_2px_rgba(20,24,27,0.04)]
        ${hoverable ? "transition-shadow hover:shadow-[0_6px_20px_rgba(20,24,27,0.08)]" : ""}
        ${className} `} {...rest} >
      {children}
    </div>
  );

};

/*
=========================================
STAT CARD
Dashboard metric tile — eyebrow label, big tabular number,
optional trend delta and icon.
=========================================
*/

export const StatCard = ({ label, value, delta, deltaTone = "basil", icon: Icon, index = 0 }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
    >
      <Card className="p-5" hoverable>

        <div className="flex items-start justify-between">

          <span className="eyebrow">{label}</span>

          {Icon && (
            <span className="text-ember/70"> <Icon size={18} />
            </span>
          )}

        </div>

        <div className="mt-3 flex items-end gap-2">

          <h2 className="font-tabular text-3xl font-semibold text-ink leading-none">
            {value}
          </h2>

          {delta && (
            <span
              className={`text-xs font-semibold mb-0.5 ${deltaTone === "basil" ? "text-basil" : "text-claret"
                }`} >
              {delta}
            </span>
          )}

        </div>

      </Card>
    </motion.div>
  );

};

export default StatCard;