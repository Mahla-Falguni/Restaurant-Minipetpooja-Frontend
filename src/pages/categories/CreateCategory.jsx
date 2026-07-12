import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import { createCategory } from "../../redux/category/categorySlice";

const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: submitError } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({ category_name: "", description: "" });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.category_name.trim()) {
      setLocalError("Category name is required.");
      return;
    }

    const payload = new FormData();
    payload.append("category_name", formData.category_name);
    payload.append("description", formData.description);
    if (image) payload.append("image", image);

    setSubmitting(true);
    const result = await dispatch(createCategory(payload));
    setSubmitting(false);

    if (createCategory.fulfilled.match(result)) {
      navigate("/categories");
    }
  };

  return (
    <DashboardLayout title="Create Category" subtitle="Organize your menu into categories">
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-line p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {(localError || submitError) && (
              <div className="rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
                {localError || submitError}
              </div>
            )}

            <div>
              <label className="font-medium text-sm text-ink">Category Name</label>
              <input
                type="text"
                placeholder="Pizza"
                className="w-full border border-line p-3 rounded-lg mt-2"
                value={formData.category_name}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
              />
            </div>

            <div>
              <label className="font-medium text-sm text-ink">Description</label>
              <textarea
                rows="4"
                placeholder="Category description"
                className="w-full border border-line p-3 rounded-lg mt-2"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label className="font-medium text-sm text-ink">Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border border-line p-3 rounded-lg mt-2"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>

            <Button type="submit" loading={submitting}>Create Category</Button>

          </form>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCategory;