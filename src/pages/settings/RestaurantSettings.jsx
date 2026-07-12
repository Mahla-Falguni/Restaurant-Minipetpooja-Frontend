import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  LuBuilding2 as Building2,
  LuUpload as Upload,
  LuSettings2 as Settings2,
  LuSave as Save,
} from "react-icons/lu";

import DashboardLayout from "../../layouts/DashboardLayouts";
import { Card } from "../../components/cards/StatCard";
import { Input, Select } from "../../components/Input";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";

import {
  getRestaurantProfile,
  createRestaurant,
  updateRestaurant,
  uploadRestaurantLogo,
  getRestaurantSettings,
  updateRestaurantSettings,
} from "../../redux/restaurant/restaurantSlice";

const EMPTY_PROFILE = {
  restaurant_name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  gst_number: "",
};

const EMPTY_SETTINGS = {
  gst_percentage: 5,
  service_charge_percentage: 0,
  currency: "INR",
  allow_cash: true,
  allow_upi: true,
  allow_card: true,
  allow_online: true,
  auto_accept_orders: false,
  estimated_preparation_time: 20,
};

const RestaurantSettings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const {
    profile,
    settings,
    loading,
    settingsLoading,
    actionLoading,
    checked,
  } = useSelector((state) => state.restaurant);

  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE);
  const [settingsForm, setSettingsForm] = useState(EMPTY_SETTINGS);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    dispatch(getRestaurantProfile());
    dispatch(getRestaurantSettings());
  }, [dispatch]);

  // Populate forms once real data arrives — never overwrite while typing.
  useEffect(() => {
    if (profile) {
      setProfileForm({
        restaurant_name: profile.restaurant_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        gst_number: profile.gst_number || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        gst_percentage: settings.gst_percentage ?? 5,
        service_charge_percentage: settings.service_charge_percentage ?? 0,
        currency: settings.currency || "INR",
        allow_cash: settings.allow_cash ?? true,
        allow_upi: settings.allow_upi ?? true,
        allow_card: settings.allow_card ?? true,
        allow_online: settings.allow_online ?? true,
        auto_accept_orders: settings.auto_accept_orders ?? false,
        estimated_preparation_time: settings.estimated_preparation_time ?? 20,
      });
    }
  }, [settings]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (e) => {
    const { name, type, checked: isChecked, value } = e.target;
    setSettingsForm({
      ...settingsForm,
      [name]: type === "checkbox" ? isChecked : value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!profileForm.restaurant_name.trim()) {
      toast.error("Restaurant name is required.");
      return;
    }

    const action = profile
      ? updateRestaurant(profileForm)
      : createRestaurant(profileForm);

    const result = await dispatch(action);

    if (action.type.endsWith("/fulfilled") || result.meta.requestStatus === "fulfilled") {
      toast.success(profile ? "Restaurant updated." : "Restaurant created — you're all set!");
      dispatch(getRestaurantSettings());
    } else {
      toast.error(result.payload || "Something went wrong.");
    }
  };

  const handleLogoPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoPreview(URL.createObjectURL(file));

    dispatch(uploadRestaurantLogo(file)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Logo uploaded.");
      } else {
        toast.error(result.payload || "Failed to upload logo.");
      }
    });
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      updateRestaurantSettings({
        ...settingsForm,
        gst_percentage: Number(settingsForm.gst_percentage),
        service_charge_percentage: Number(settingsForm.service_charge_percentage),
        estimated_preparation_time: Number(settingsForm.estimated_preparation_time),
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Settings saved.");
    } else {
      toast.error(result.payload || "Failed to save settings.");
    }
  };

  if (loading && !checked) {
    return (
      <DashboardLayout title="Restaurant" subtitle="Profile & operations">
        <div className="py-24"><Loader /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Restaurant" subtitle="Profile & operations">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* PROFILE */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Building2 size={18} className="text-ember" />
            <h3 className="font-display text-lg font-semibold text-ink">
              Restaurant profile
            </h3>
          </div>
          <p className="text-sm text-slate mb-5">
            {profile
              ? "Your restaurant's public details."
              : "This hasn't been created yet — fill this in first, everything else depends on it."}
          </p>

          {/* Logo */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-xl bg-paper-dim border border-line flex items-center justify-center overflow-hidden shrink-0">
              {logoPreview || profile?.logo ? (
                <img
                  src={logoPreview || profile.logo}
                  alt="Restaurant logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 size={22} className="text-slate/50" />
              )}
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleLogoPick}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Upload}
                disabled={!profile}
                onClick={() => fileInputRef.current?.click()}
              >
                {profile?.logo ? "Change logo" : "Upload logo"}
              </Button>
              {!profile && (
                <p className="text-xs text-slate mt-1.5">Save your profile first, then add a logo.</p>
              )}
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Restaurant name"
              name="restaurant_name"
              placeholder="e.g. Petpooja Kitchen"
              value={profileForm.restaurant_name}
              onChange={handleProfileChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="contact@restaurant.com"
                value={profileForm.email}
                onChange={handleProfileChange}
              />
              <Input
                label="Phone"
                name="phone"
                placeholder="+91 98765 43210"
                value={profileForm.phone}
                onChange={handleProfileChange}
              />
            </div>

            <Input
              label="Address"
              name="address"
              placeholder="Street, area"
              value={profileForm.address}
              onChange={handleProfileChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                placeholder="City"
                value={profileForm.city}
                onChange={handleProfileChange}
              />
              <Input
                label="State"
                name="state"
                placeholder="State"
                value={profileForm.state}
                onChange={handleProfileChange}
              />
            </div>

            <Input
              label="GST number"
              name="gst_number"
              placeholder="22AAAAA0000A1Z5"
              value={profileForm.gst_number}
              onChange={handleProfileChange}
            />

            <Button type="submit" loading={actionLoading} icon={Save} fullWidth>
              {profile ? "Save changes" : "Create restaurant"}
            </Button>
          </form>
        </Card>

        {/* OPERATIONS */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Settings2 size={18} className="text-ember" />
            <h3 className="font-display text-lg font-semibold text-ink">
              Ordering & tax
            </h3>
          </div>
          <p className="text-sm text-slate mb-5">
            These drive every order's tax, service charge, and payment options in real time.
          </p>

          {!profile ? (
            <p className="text-sm text-slate py-8 text-center">
              Create your restaurant profile first to configure these.
            </p>
          ) : settingsLoading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="GST %"
                  name="gst_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settingsForm.gst_percentage}
                  onChange={handleSettingsChange}
                />
                <Input
                  label="Service charge %"
                  name="service_charge_percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settingsForm.service_charge_percentage}
                  onChange={handleSettingsChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Currency"
                  name="currency"
                  value={settingsForm.currency}
                  onChange={handleSettingsChange}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </Select>
                <Input
                  label="Est. prep time (min)"
                  name="estimated_preparation_time"
                  type="number"
                  min="1"
                  value={settingsForm.estimated_preparation_time}
                  onChange={handleSettingsChange}
                />
              </div>

              <div>
                <span className="mb-2 block text-sm font-medium text-charcoal">
                  Accepted payment methods
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "allow_cash", label: "Cash" },
                    { key: "allow_upi", label: "UPI" },
                    { key: "allow_card", label: "Card" },
                    { key: "allow_online", label: "Online" },
                  ].map((method) => (
                    <label
                      key={method.key}
                      className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-ink cursor-pointer hover:bg-paper-dim"
                    >
                      <input
                        type="checkbox"
                        name={method.key}
                        checked={settingsForm[method.key]}
                        onChange={handleSettingsChange}
                        className="accent-ember"
                      />
                      {method.label}
                    </label>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-sm text-ink cursor-pointer hover:bg-paper-dim">
                <input
                  type="checkbox"
                  name="auto_accept_orders"
                  checked={settingsForm.auto_accept_orders}
                  onChange={handleSettingsChange}
                  className="accent-ember"
                />
                <span>
                  Auto-accept new orders
                  <span className="block text-xs text-slate">
                    Skip manual confirmation — orders go straight to the kitchen.
                  </span>
                </span>
              </label>

              <Button type="submit" loading={actionLoading} icon={Save} fullWidth>
                Save settings
              </Button>
            </form>
          )}
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default RestaurantSettings;