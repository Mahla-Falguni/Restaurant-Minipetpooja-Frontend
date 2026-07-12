import { Link } from "react-router-dom";
import { LuLock, LuArrowUpRight } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";

/*
=========================================================
UPGRADE REQUIRED
Shown in place of a page whenever the restaurant's current
subscription plan doesn't include the feature that page needs.
=========================================================
*/

const UpgradeRequired = ({ feature }) => {

  return (
    <DashboardLayout title="Upgrade Required" subtitle="This feature isn't included in your current plan">

      <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center max-w-lg mx-auto">

        <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
          <LuLock size={24} />
        </div>

        <h2 className="font-display text-xl text-ink mb-2">
          {feature} isn't on your plan
        </h2>

        <p className="text-charcoal/50 mb-6">
          Upgrade your subscription to unlock {feature} and everything that comes with it.
        </p>

        <Link
          to="/billing"
          className="inline-flex items-center gap-2 rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-white hover:bg-ember-dark transition-colors"
        >
          View Plans <LuArrowUpRight size={16} />
        </Link>

      </div>

    </DashboardLayout>
  );

};

export default UpgradeRequired;