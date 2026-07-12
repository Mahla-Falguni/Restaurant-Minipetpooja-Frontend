import DashboardLayout from "../../layouts/DashboardLayouts";
import { LuHammer } from "react-icons/lu";

/*
=========================================
COMING SOON
=========================================
*/

const ComingSoon = ({ title, subtitle }) => {
  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
          <LuHammer size={24} />
        </div>
        <h2 className="font-display text-xl text-ink mb-2">{title}</h2>
        <p className="text-charcoal/50 max-w-sm mx-auto">
          This module's backend is ready — the page UI is still being built.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default ComingSoon;