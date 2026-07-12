/*
=========================================
BADGE
Maps common status strings across modules to a consistent
color language: Basil = good/available, Saffron = pending/waiting,
Ember = urgent/in-progress, Claret = negative/rejected, Slate = neutral.
=========================================
*/

const STATUS_MAP = {

  // Generic

  Available: "basil",
  Active: "basil",
  Completed: "basil",
  Paid: "basil",
  Confirmed: "basil",
  Present: "basil",
  Approved: "basil",

  Pending: "saffron",
  Requested: "saffron",
  "Half Day": "saffron",
  Draft: "saffron",

  Occupied: "ember",
  Preparing: "ember",
  "In Progress": "ember",
  Seated: "ember",
  Late: "ember",

  Reserved: "claret",
  Cancelled: "claret",
  Rejected: "claret",
  Absent: "claret",
  "No Show": "claret",
  Suspended: "claret",

  Cleaning: "slate",
  "Out of Service": "slate",
  "On Leave": "slate"

};

const COLOR_CLASSES = {
  basil: "bg-basil-light text-basil",
  saffron: "bg-saffron-light text-[#8a5c14]",
  ember: "bg-ember-light text-ember-dark",
  claret: "bg-claret-light text-claret",
  slate: "bg-paper-dim text-slate"
};

const Badge = ({ children, tone, pulse = false }) => {

  const resolvedTone = tone || STATUS_MAP[children] || "slate";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
        text-xs font-semibold
        ${COLOR_CLASSES[resolvedTone]}
      `}
    >

      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}

      {children}

    </span>
  );

};

export default Badge;