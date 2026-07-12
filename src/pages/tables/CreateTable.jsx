import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayouts";
import Button from "../../components/common/Button";
import { createTable } from "../../redux/table/tableSlice";

const CreateTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: submitError } = useSelector((state) => state.tables);

  const [formData, setFormData] = useState({
    table_number: "",
    seating_capacity: "",
    zone: "Main",
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.table_number || !formData.seating_capacity) {
      setLocalError("Table number and seating capacity are required.");
      return;
    }

    setSubmitting(true);
    const result = await dispatch(createTable(formData));
    setSubmitting(false);

    if (createTable.fulfilled.match(result)) {
      navigate("/tables");
    }
  };

  return (
    <DashboardLayout title="Create Table" subtitle="Add a new dining table for POS and QR ordering">
      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl border border-line p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {(localError || submitError) && (
              <div className="rounded-lg border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
                {localError || submitError}
              </div>
            )}

            <div>
              <label className="font-medium text-sm text-ink">Table Number</label>
              <input
                type="text"
                name="table_number"
                placeholder="T-01"
                className="w-full border border-line p-3 rounded-lg mt-2"
                value={formData.table_number}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-medium text-sm text-ink">Seating Capacity</label>
              <input
                type="number"
                name="seating_capacity"
                min="1"
                placeholder="4"
                className="w-full border border-line p-3 rounded-lg mt-2"
                value={formData.seating_capacity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-medium text-sm text-ink">Zone</label>
              <input
                type="text"
                name="zone"
                placeholder="Main"
                className="w-full border border-line p-3 rounded-lg mt-2"
                value={formData.zone}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" loading={submitting}>
              Create Table
            </Button>

          </form>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateTable;