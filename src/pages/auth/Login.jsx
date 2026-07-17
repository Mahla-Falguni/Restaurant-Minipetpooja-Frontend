import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LuMail, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import toast from "react-hot-toast";

import { loginUser } from "../../redux/auth/authSlice";
import AuthLayout from "../../layouts/AuthLayout";
import { Input, Select } from "../../components/Input";
import Button from "../../components/common/Button";

// After login, redirect each role to the correct dashboard
const roleRedirect = {
  Admin: "/dashboard",
  Manager: "/dashboard",
  Waiter: "/waiter",
  Kitchen: "/kitchen",
  Cashier: "/cashier",
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const queryParams = new URLSearchParams(window.location.search);
  const initialRole = queryParams.get("role") || "Admin";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", role: initialRole });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validate = () => {
    const next = {};
    if (!formData.email.trim()) next.email = "Email is required.";
    if (!formData.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      const role = result.payload.user?.role;
      toast.success("Welcome back!");
      // Redirect to role-specific dashboard
      navigate(roleRedirect[role] || "/");
    } else {
      toast.error(result.payload || "Login failed.");
    }
  };

  return (
    <AuthLayout
      eyebrow="Sign In"
      title="Welcome back"
      subtitle="Log in to pick up right where you left off."
    >
      <form className="space-y-4" onSubmit={submitHandler} noValidate>

        <div>
          <Select
            label="Login As"
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

        <div className="relative">
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
          <LuMail size={16} className="absolute left-3 top-[38px] text-slate/50 pointer-events-none" />
        </div>

        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            className="pl-10 pr-10"
          />
          <LuLock size={16} className="absolute left-3 top-[38px] text-slate/50 pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[36px] text-slate/50 hover:text-ink transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 text-slate cursor-pointer select-none">
            <input type="checkbox" className="accent-ember rounded" />
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-ember font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} className="mt-2">
          Log In
        </Button>

      </form>

      <p className="text-center text-sm text-slate mt-8">
        Don't have a restaurant account yet?{" "}
        <Link to="/register" className="text-ember font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
