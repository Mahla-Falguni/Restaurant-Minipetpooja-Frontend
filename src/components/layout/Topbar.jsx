import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuBell, LuLogOut, LuSearch } from "react-icons/lu";
import { logout } from "../../redux/auth/authSlice";

/*
=========================================
TOPBAR
Page title (passed as prop) + quick search + notifications + logout.
Sits above every dashboard page inside DashboardLayouts.
=========================================
*/

const Topbar = ({ title, subtitle }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.trim().toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/90 backdrop-blur px-8 py-4">

      <div>
        <h2 className="font-display text-xl font-semibold text-ink">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-slate mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden md:flex items-center gap-2 rounded-lg border border-line bg-white px-3 h-9 text-sm text-slate w-56">
          <LuSearch size={15} />
          <input
            placeholder="Quick search…"
            className="w-full bg-transparent outline-none placeholder:text-slate/60"
          />
        </div>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-slate hover:text-ink">
          <LuBell size={16} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-ember" />
        </button>

        <div className="flex items-center gap-2 pl-2">

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white text-xs font-semibold">
            {initials}
          </span>

          <button
            onClick={handleLogout}
            title="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate hover:bg-paper-dim hover:text-claret"
          >
            <LuLogOut size={16} />
          </button>

        </div>

      </div>

    </header>
  );

};

export default Topbar;