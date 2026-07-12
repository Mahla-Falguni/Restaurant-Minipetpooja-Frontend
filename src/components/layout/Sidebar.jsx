import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMyPlanFeatures } from "../../redux/subscription/subscriptionSlice";
import {
  LuLayoutGrid as LayoutGrid,
  LuUtensilsCrossed as UtensilsCrossed,
  LuTags as Tags,
  LuTable2 as Table2,
  LuQrCode as QrCode,
  LuChefHat as ChefHat,
  LuClipboardList as ClipboardList,
  LuUsersRound as Users2,
  LuWallet as Wallet,
  LuChartLine as LineChart,
  LuCalendarClock as CalendarClock,
  LuUserRoundCog as UserSquare2,
  LuSettings as Settings,
  LuBuilding2 as Building2,
  LuCreditCard as CreditCard,
  LuCalendarCheck as CalendarCheck
} from "react-icons/lu";

/*
=========================================
SIDEBAR
Grouped, role-aware navigation. Sections only render if the
logged-in user's role has access — avoids showing dead links.
=========================================
*/

const NAV_SECTIONS = [

  {
    label: "Overview",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutGrid, roles: ["Admin", "Manager"] }
    ]
  },
  {
    label: "Floor",
    items: [
      { to: "/tables", label: "Tables", icon: Table2, roles: ["Admin", "Manager"] },
      { to: "/reservations", label: "Reservations", icon: CalendarClock, roles: ["Admin", "Manager", "Cashier"], feature: "Reservations" },
      { to: "/waiter", label: "Waiter Floor", icon: ClipboardList, roles: ["Waiter", "Admin", "Manager"] },
      { to: "/kitchen", label: "Kitchen", icon: ChefHat, roles: ["Kitchen", "Admin", "Manager"], feature: "KDS" }
    ]
  },
  {
    label: "Sales",
    items: [
      { to: "/orders", label: "Orders", icon: ClipboardList, roles: ["Admin", "Manager", "Cashier"] },
      { to: "/cashier", label: "Cashier", icon: Wallet, roles: ["Cashier", "Admin", "Manager"] },
      { to: "/qr", label: "QR Menu", icon: QrCode, roles: ["Admin", "Manager"], feature: "QR Menu" }
    ]
  },
  {
    label: "Catalog",
    items: [
      { to: "/menu", label: "Menu Items", icon: UtensilsCrossed, roles: ["Admin", "Manager"] },
      { to: "/categories", label: "Categories", icon: Tags, roles: ["Admin", "Manager"] }
    ]
  },
  {
    label: "People",
    items: [
      { to: "/customers", label: "Customers (CRM)", icon: Users2, roles: ["Admin", "Manager", "Cashier"], feature: "Customer CRM" },
      { to: "/staff", label: "Staff & Payroll", icon: UserSquare2, roles: ["Admin", "Manager"], feature: "Staff & Payroll" },
      { to: "/attendance", label: "Attendance", icon: CalendarCheck, roles: ["Admin", "Manager", "Waiter", "Cashier", "Kitchen"], feature: "Staff & Payroll" }
    ]
  },
  {
    label: "Insights",
    items: [
      { to: "/reports", label: "Reports", icon: LineChart, roles: ["Admin", "Manager"] },
      { to: "/branches", label: "Branches", icon: Building2, roles: ["Admin"] }
    ]
  },
  {
    label: "System",
    items: [
      { to: "/settings", label: "Settings", icon: Settings, roles: ["Admin", "Manager"] },
      { to: "/billing", label: "Subscription & Billing", icon: CreditCard, roles: ["Admin"] }
    ]
  }

];

const Sidebar = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myFeatures, myPlanName, featuresLoaded } = useSelector((state) => state.subscription);

  const role = user?.role || "Admin";

  useEffect(() => {
    if (!featuresLoaded) dispatch(getMyPlanFeatures());
  }, [dispatch, featuresLoaded]);

  return (
    <aside className="w-64 shrink-0 bg-ink text-white h-screen overflow-hidden flex flex-col">

      <div className="px-6 py-6 border-b border-white/10">

        <div className="flex items-center gap-2.5">

          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ember text-white font-display font-semibold">
            P
          </span>

          <div>
            <h1 className="font-display text-lg font-semibold leading-none">
              Petpooja
            </h1>
            <p className="text-[11px] text-white/40 mt-1">Restaurant POS</p>
          </div>

        </div>

      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-5 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:hidden">

        {NAV_SECTIONS.map((section) => {

          const visibleItems = section.items.filter((item) => {
            const roleOk = item.roles.includes(role);
            const featureOk = !item.feature || (featuresLoaded && myFeatures.includes(item.feature));
            return roleOk && featureOk;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label}>

              <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">
                {section.label}
              </p>

              <div className="space-y-1">

                {visibleItems.map((item) => (

                  <NavLink
                    key={item.to}
                    to={item.to}
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

              </div>

            </div>
          );

        })}

      </nav>

      <div className="px-6 py-4 border-t border-white/10">

        <p className="text-[11px] text-white/30">
          Signed in as
        </p>

        <p className="text-sm font-medium truncate">
          {user ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Guest" : "Guest"} · <span className="text-white/50">{role}</span>
        </p>

        {myPlanName && (
          <p className="text-[11px] text-white/30 mt-1">{myPlanName} plan</p>
        )}

      </div>

    </aside>
  );

};

export default Sidebar;