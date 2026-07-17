import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LuBuilding2, LuUser, LuMail, LuPhone, LuLock, LuEye, LuEyeOff, } from "react-icons/lu";
import toast from "react-hot-toast";

import { registerUser } from "../../redux/auth/authSlice";
import AuthLayout from "../../layouts/AuthLayout";
import { Input, Select } from "../../components/Input";
import Button from "../../components/common/Button";

const SectionLabel = ({ index, children }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="w-5 h-5 rounded-full bg-ember/10 text-ember text-[11px] font-bold flex items-center justify-center font-mono">
      {index}
    </span>
    <span className="eyebrow text-slate">{children}</span>
  </div>
);

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    role: "Admin",
    restaurant_name: "",
    owner_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (formData.role === "Admin") {
      if (!formData.restaurant_name.trim()) nextErrors.restaurant_name = "Required.";
      if (!formData.owner_name.trim()) nextErrors.owner_name = "Required.";
    }
    if (!formData.first_name.trim()) nextErrors.first_name = "Required.";
    if (!formData.last_name.trim()) nextErrors.last_name = "Required.";
    if (!formData.email.trim()) nextErrors.email = "Required.";
    if (!formData.phone.trim()) nextErrors.phone = "Required.";
    if (!formData.password || formData.password.length < 6)
      nextErrors.password = "Minimum 6 characters.";

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await dispatch(registerUser(formData));

    if (result.payload?.token) {
      toast.success("Account created — welcome aboard!");
      navigate("/dashboard");
    } else if (result.payload) {
      toast.error(result.payload);
    }
  };

  return (
    <AuthLayout
      eyebrow="Get Started"
      title="Set up your restaurant"
      subtitle="Takes about a minute — you can fine-tune everything later."
    >
      <form className="space-y-6" onSubmit={submitHandler} noValidate>
        {/* Role Selection */}
        <div>
          <Select
            label="Register As"
            name="role"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
          >
            <option value="Admin">Admin (Restaurant Owner)</option>
            <option value="Manager">Manager</option>
            <option value="Waiter">Waiter</option>
            <option value="Cashier">Cashier</option>
            <option value="Kitchen">Kitchen Staff</option>
          </Select>
        </div>

        {/* Restaurant */}
        {formData.role === "Admin" && (
          <div>
            <SectionLabel index={1}>Restaurant</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative sm:col-span-2">
                <Input
                  label="Restaurant Name"
                  name="restaurant_name"
                  placeholder="The Spice House"
                  value={formData.restaurant_name}
                  onChange={handleChange}
                  error={errors.restaurant_name}
                  className="pl-10"
                />
                <LuBuilding2
                  size={16}
                  className="absolute left-3 top-[38px] text-slate/50 pointer-events-none"
                />
              </div>

              <Input
                label="Owner Name"
                name="owner_name"
                placeholder="Full name"
                value={formData.owner_name}
                onChange={handleChange}
                error={errors.owner_name}
              />
            </div>
          </div>
        )}

        {/* Your details */}
        <div>
          <SectionLabel index={formData.role === "Admin" ? 2 : 1}>Your Account</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              name="first_name"
              placeholder="Jane"
              value={formData.first_name}
              onChange={handleChange}
              error={errors.first_name}
            />
            <Input
              label="Last Name"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              error={errors.last_name}
            />

            <div className="relative col-span-2 sm:col-span-1">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@restaurant.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="pl-10"
              />
              <LuMail
                size={16}
                className="absolute left-3 top-[38px] text-slate/50 pointer-events-none"
              />
            </div>

            <div className="relative col-span-2 sm:col-span-1">
              <Input
                label="Phone"
                name="phone"
                type="tel"
                placeholder="98765 43210"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                className="pl-10"
              />
              <LuPhone
                size={16}
                className="absolute left-3 top-[38px] text-slate/50 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div>
          <SectionLabel index={formData.role === "Admin" ? 3 : 2}>Security</SectionLabel>
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              className="pl-10 pr-10"
            />
            <LuLock
              size={16}
              className="absolute left-3 top-[38px] text-slate/50 pointer-events-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-[36px] text-slate/50 hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
            </button>
          </div>
        </div>

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate mt-8">
        Already have an account?{" "}
        <Link to="/login" className="text-ember font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;