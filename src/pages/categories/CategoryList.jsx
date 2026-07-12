import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LuPlus, LuTrash2, LuLayoutGrid } from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import Badge from "../../components/kitchen/Badge";
import { getCategories, deleteCategory } from "../../redux/category/categorySlice";

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Menu items inside it won't be deleted.")) return;
    setDeletingId(id);
    await dispatch(deleteCategory(id));
    setDeletingId(null);
  };

  return (
    <DashboardLayout title="Categories" subtitle="Organize your menu">

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-charcoal/60">
          {categories?.length || 0} categor{categories?.length === 1 ? "y" : "ies"}
        </p>
        <Link to="/categories/create">
          <Button icon={LuPlus}>Add Category</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
          {error}
        </div>
      )}

      {loading && !categories?.length ? (
        <p className="text-charcoal/50">Loading categories…</p>
      ) : !categories?.length ? (
        <div className="rounded-2xl border border-dashed border-line bg-white p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-ember/10 text-ember flex items-center justify-center mx-auto mb-5">
            <LuLayoutGrid size={24} />
          </div>
          <h2 className="font-display text-xl text-ink mb-2">No categories yet</h2>
          <p className="text-charcoal/50 mb-5">Create a category before adding menu items.</p>
          <Link to="/categories/create">
            <Button icon={LuPlus}>Add Category</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id} className="rounded-2xl border border-line bg-white p-5 flex gap-4">
              {cat.image ? (
                <img src={cat.image} alt={cat.category_name} className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-paper-dim flex items-center justify-center text-charcoal/30">
                  <LuLayoutGrid size={22} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-lg text-ink truncate">{cat.category_name}</p>
                  <Badge tone={cat.status ? "basil" : "slate"}>{cat.status ? "Active" : "Hidden"}</Badge>
                </div>
                <p className="text-xs text-charcoal/50 line-clamp-2 mt-1">{cat.description || "No description"}</p>

                <button
                  onClick={() => handleDelete(cat._id)}
                  disabled={deletingId === cat._id}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-claret hover:underline disabled:opacity-50"
                >
                  <LuTrash2 size={14} />
                  {deletingId === cat._id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </DashboardLayout>
  );
};

export default CategoryList;