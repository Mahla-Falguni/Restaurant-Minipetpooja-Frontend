import { NavLink } from "react-router-dom";
import {
  LuLayoutGrid as LayoutGrid,
  LuBuilding2 as Building2,
  LuLayers as Layers,
  LuScrollText as ScrollText,
  LuShieldCheck as ShieldCheck,
} from "react-icons/lu";

/*
=========================================================
SUPER ADMIN SIDEBAR
Platform-level navigation — deliberately small. There is no
"actions" section here: restaurant pages are view-only, so the
only things that need a create/edit flow are Plans.
=========================================================
*/

const NAV_ITEMS = [
  { to: "/super-admin", label: "Overview", icon: LayoutGrid, end: true },
  { to: "/super-admin/restaurants", label: "Restaurants", icon: Building2 },
  { to: "/super-admin/plans", label: "Subscription Plans", icon: Layers },
  { to: "/super-admin/activity-log", label: "Activity Log", icon: ScrollText },
];

const SuperAdminSidebar = () => {

  return (
    <aside className="w-64 shrink-0 bg-ink text-white min-h-screen flex flex-col">

      <div className="px-6 py-6 border-b border-white/10">

        <div className="flex items-center gap-2.5">

          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ember text-white">
            <ShieldCheck size={16} />
          </span>

          <div>
            <h1 className="font-display text-lg font-semibold leading-none">
              Petpooja
            </h1>
            <p className="text-[11px] text-white/40 mt-1">Platform Admin</p>
          </div>

        </div>

      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-1">

        {NAV_ITEMS.map((item) => (

          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium
              transition-colors
              ${isActive
                ? "bg-ember text-white"
                : "text-white/70 hover:bg-white/5 hover:text-white"}
            `}
          >
            <item.icon size={17} strokeWidth={2} />
            {item.label}
          </NavLink>

        ))}

      </nav>

      <div className="px-6 py-4 border-t border-white/10">
        <p className="text-[11px] text-white/30 leading-relaxed">
          Restaurant pages are read-only here.
          Manage plans on the left.
        </p>
      </div>

    </aside>
  );

};

export default SuperAdminSidebar;