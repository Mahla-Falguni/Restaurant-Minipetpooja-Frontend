import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LuPlus, LuPencil, LuLayers } from "react-icons/lu";
import toast from "react-hot-toast";

import SuperAdminLayout from "../../layouts/SuperAdminLayout";
import { Card } from "../../components/cards/StatCard";
import Badge from "../../components/kitchen/Badge";
import EmptyState from "../../components/EmptyState";
import Button from "../../components/common/Button";
import { Input, Select, TextArea } from "../../components/Input";
import { formatCurrency } from "../../utils/formatters";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  togglePlanStatus,
} from "../../redux/superAdmin/superAdminPlanSlice";

const emptyForm = {
  plan_name: "",
  billing_cycle: "Monthly",
  price: "",
  max_branches: 1,
  max_staff_accounts: 10,
  features_included: "",
};

const PlanFormModal = ({ open, onClose, initialData, onSubmit, saving }) => {

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        plan_name: initialData.plan_name || "",
        billing_cycle: initialData.billing_cycle || "Monthly",
        price: initialData.price ?? "",
        max_branches: initialData.max_branches ?? 1,
        max_staff_accounts: initialData.max_staff_accounts ?? 10,
        features_included: (initialData.features_included || []).join(", "),
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.plan_name.trim() || form.price === "") {
      toast.error("Plan name and price are required.");
      return;
    }

    onSubmit({
      plan_name: form.plan_name.trim(),
      billing_cycle: form.billing_cycle,
      price: Number(form.price),
      max_branches: Number(form.max_branches) || 1,
      max_staff_accounts: Number(form.max_staff_accounts) || 10,
      features_included: form.features_included
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

        <h2 className="font-display text-xl font-semibold text-ink mb-5">
          {initialData ? "Edit Plan" : "Create Plan"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            label="Plan name"
            name="plan_name"
            placeholder="e.g. Growth"
            value={form.plan_name}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Billing cycle"
              name="billing_cycle"
              value={form.billing_cycle}
              onChange={handleChange}
            >
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </Select>

            <Input
              label="Price (₹)"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max branches"
              name="max_branches"
              type="number"
              min="1"
              value={form.max_branches}
              onChange={handleChange}
            />

            <Input
              label="Max staff accounts"
              name="max_staff_accounts"
              type="number"
              min="1"
              value={form.max_staff_accounts}
              onChange={handleChange}
            />
          </div>

          <TextArea
            label="Features (comma-separated)"
            name="features_included"
            placeholder="POS, KDS, CRM, Reservations, Payroll"
            value={form.features_included}
            onChange={handleChange}
            rows={2}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {initialData ? "Save Changes" : "Create Plan"}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );

};

const PlansList = () => {

  const dispatch = useDispatch();
  const { plans, loading, saving } = useSelector((state) => state.superAdminPlans);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    dispatch(getAllPlans());
  }, [dispatch]);

  const handleCreate = () => {
    setEditingPlan(null);
    setModalOpen(true);
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    const action = editingPlan
      ? updatePlan({ id: editingPlan._id, data })
      : createPlan(data);

    const result = await dispatch(action);

    if (createPlan.fulfilled.match(result) || updatePlan.fulfilled.match(result)) {
      toast.success(editingPlan ? "Plan updated." : "Plan created.");
      setModalOpen(false);
    } else {
      toast.error(result.payload || "Something went wrong.");
    }
  };

  const handleToggle = async (plan) => {
    const result = await dispatch(togglePlanStatus(plan._id));
    if (togglePlanStatus.fulfilled.match(result)) {
      toast.success(`Plan ${result.payload.is_active ? "activated" : "deactivated"}.`);
    } else {
      toast.error(result.payload || "Failed to update plan status.");
    }
  };

  return (
    <SuperAdminLayout title="Subscription Plans" subtitle="Create and manage the plans restaurants can subscribe to">

      <div className="flex justify-end mb-6">
        <Button icon={LuPlus} onClick={handleCreate}>
          New Plan
        </Button>
      </div>

      {loading ? (
        <div className="text-sm text-slate">Loading plans…</div>
      ) : !plans?.length ? (
        <Card>
          <EmptyState
            icon={LuLayers}
            title="No plans yet"
            description="Create your first subscription plan for restaurants to choose from."
            action={<Button icon={LuPlus} onClick={handleCreate}>New Plan</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <Card key={plan._id} className="p-6" hoverable>

              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {plan.plan_name}
                </h3>
                <Badge tone={plan.is_active ? "basil" : "slate"}>
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <p className="font-tabular text-2xl font-semibold text-ink mb-1">
                {formatCurrency(plan.price)}
                <span className="text-sm font-normal text-slate"> / {plan.billing_cycle}</span>
              </p>

              <p className="text-xs text-slate mb-4">
                {plan.subscriber_count} restaurant{plan.subscriber_count === 1 ? "" : "s"} subscribed
              </p>

              <dl className="text-sm space-y-1.5 mb-4">
                <div className="flex justify-between">
                  <dt className="text-slate">Max branches</dt>
                  <dd className="text-ink">{plan.max_branches}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate">Max staff accounts</dt>
                  <dd className="text-ink">{plan.max_staff_accounts}</dd>
                </div>
              </dl>

              {plan.features_included?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {plan.features_included.map((f) => (
                    <span key={f} className="text-xs bg-paper-dim text-slate px-2 py-1 rounded-md">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={LuPencil} onClick={() => handleEdit(plan)} fullWidth>
                  Edit
                </Button>
                <Button
                  variant={plan.is_active ? "danger" : "success"}
                  size="sm"
                  onClick={() => handleToggle(plan)}
                  fullWidth
                >
                  {plan.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>

            </Card>
          ))}
        </div>
      )}

      <PlanFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingPlan}
        onSubmit={handleSubmit}
        saving={saving}
      />

    </SuperAdminLayout>
  );

};

export default PlansList;