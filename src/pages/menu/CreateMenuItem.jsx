import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import { createMenuItem } from "../../redux/menu/menuSlice";
import { getCategories } from "../../redux/category/categorySlice";

const CreateMenuItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);
  const { error: submitError } = useSelector((state) => state.menu);

  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    price: "",
    category_id: "",
    food_type: "Veg",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.item_name || !formData.price || !formData.category_id) {
      setLocalError("Item name, price, and category are required.");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append("image", image);

    setSubmitting(true);
    const result = await dispatch(createMenuItem(payload));
    setSubmitting(false);

    if (createMenuItem.fulfilled.match(result)) {
      navigate("/menu");
    }
  };

  return (
    <DashboardLayout title="Add Menu Item" subtitle="Create food and beverage items">
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl border border-line p-8">

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            {(localError || submitError) && (
              <div className="md:col-span-2 rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
                {localError || submitError}
              </div>
            )}

            <div>
              <label className="font-medium text-sm text-ink">Item Name</label>
              <input
                type="text"
                name="item_name"
                className="w-full border border-line p-3 rounded-lg mt-2"
                placeholder="Veg Burger"
                value={formData.item_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-medium text-sm text-ink">Category</label>
              <select
                name="category_id"
                className="w-full border border-line p-3 rounded-lg mt-2"
                value={formData.category_id}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.category_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-sm text-ink">Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                className="w-full border border-line p-3 rounded-lg mt-2"
                placeholder="199"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-medium text-sm text-ink">Food Type</label>
              <select
                name="food_type"
                className="w-full border border-line p-3 rounded-lg mt-2"
                value={formData.food_type}
                onChange={handleChange}
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Egg">Egg</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="font-medium text-sm text-ink">Food Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border border-line p-3 rounded-lg mt-2"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-medium text-sm text-ink">Description</label>
              <textarea
                name="description"
                rows="5"
                className="w-full border border-line p-3 rounded-lg mt-2"
                placeholder="Item description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" loading={submitting}>Create Menu Item</Button>
            </div>

          </form>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateMenuItem;