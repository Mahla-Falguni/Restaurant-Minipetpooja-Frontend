/*
=========================================
EMPTY STATE
An empty screen is an invitation to act — always paired with
a clear next step, never just "no data found."
=========================================
*/

const EmptyState = ({ icon: Icon, title, description, action }) => {

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">

      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-paper-dim text-slate">
          <Icon size={26} />
        </div>
      )}

      <h3 className="font-display text-lg font-semibold text-ink">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-slate">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}

    </div>
  );

};

export default EmptyState;