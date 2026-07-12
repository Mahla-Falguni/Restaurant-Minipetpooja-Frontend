import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuPlus, LuTrash2, LuUtensils } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import { getMenuItems, deleteMenuItem, toggleMenuAvailability } from "../../redux/menu/menuSlice";

const foodTypeTone = { Veg: "basil", "Non-Veg": "claret", Egg: "saffron" };

const MenuList = () => {
  const dispatch = useDispatch();
  const { menuItems, loading, error } = useSelector((state) => state.menu);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    dispatch(getMenuItems());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    setBusyId(id);
    await dispatch(deleteMenuItem(id));
    setBusyId(null);
  };

  const handleToggle = async (id) => {
    setBusyId(id);
    await dispatch(toggleMenuAvailability(id));
    setBusyId(null);
  };

  return (
    <DashboardLayout title="Menu" subtitle="Everything on your menu">

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-charcoal/60">
          {menuItems?.length || 0} item{menuItems?.length === 1 ? "" : "s"}
        </p>
        <Link to="/menu/create">
          <Button icon={LuPlus}>Add Item</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {loading && !menuItems?.length ? (
        <p className="text-charcoal/50">Loading menu…</p>
      ) : !menuItems?.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuUtensils size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No menu items yet</h2>
          <p className="text-charcoal/50 mb-5">Add your first dish to get started.</p>
          <Link to="/menu/create">
            <Button icon={LuPlus}>Add Item</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item._id} className="rounded-2xl border border-line bg-white p-5 flex flex-col gap-3">
              <div className="flex gap-3">
                {item.image ? (
                  <img src={item.image} alt={item.item_name} className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-paper-dim flex items-center justify-center text-charcoal/30">
                    <LuUtensils size={22} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base text-ink truncate">{item.item_name}</p>
                  <p className="font-mono text-sm text-charcoal/60">₹{Number(item.price).toFixed(2)}</p>
                  <Badge tone={foodTypeTone[item.food_type] || "slate"}>{item.food_type}</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={() => handleToggle(item._id)}
                  disabled={busyId === item._id}
                  className="text-xs disabled:opacity-50"
                >
                  <Badge tone={item.is_available ? "basil" : "slate"}>
                    {item.is_available ? "Available" : "Unavailable"} · tap to toggle
                  </Badge>
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  disabled={busyId === item._id}
                  className="text-claret hover:text-claret/70 disabled:opacity-50"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default MenuList;