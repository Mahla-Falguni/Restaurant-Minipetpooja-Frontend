import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { superAdminLogout } from "../../redux/superAdmin/superAdminAuthSlice";

/*
=========================================================
SUPER ADMIN TOPBAR
Mirrors the restaurant Topbar's look, but reads from
superAdminAuth instead of auth, and logs out of the platform
panel only.
=========================================================
*/

const SuperAdminTopbar = ({ title, subtitle }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { superAdmin } = useSelector((state) => state.superAdminAuth);

  const handleLogout = () => {
    dispatch(superAdminLogout());
    navigate("/super-admin/login");
  };

  const initials = (superAdmin?.name || "SA")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

        <div className="flex items-center gap-2 pl-2">

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white text-xs font-semibold">
            {initials}
          </span>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-ink leading-none">
              {superAdmin?.name || "Super Admin"}
            </p>
            <p className="text-[11px] text-slate mt-0.5">{superAdmin?.role}</p>
          </div>

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

export default SuperAdminTopbar;