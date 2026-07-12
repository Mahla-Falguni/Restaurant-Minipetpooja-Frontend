import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LuMail, LuLock, LuEye, LuEyeOff, LuShieldCheck } from "react-icons/lu";
import toast from "react-hot-toast";

import { superAdminLogin } from "../../redux/superAdmin/superAdminAuthSlice";
import AuthLayout from "../../layouts/AuthLayout";
import { Input } from "../../components/Input";
import Button from "../../components/common/Button";

const SuperAdminLogin = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.superAdminAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
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

    const result = await dispatch(superAdminLogin(formData));

    if (superAdminLogin.fulfilled.match(result)) {
      toast.success("Welcome back.");
      navigate("/super-admin");
    } else {
      toast.error(result.payload || "Login failed.");
    }
  };

  return (
    <AuthLayout
      eyebrow="Platform Admin"
      title="Super Admin sign in"
      subtitle="Restricted to platform staff. Restaurant logins won't work here."
    >
      <form className="space-y-4" onSubmit={submitHandler} noValidate>

        <div className="relative">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="admin@petpooja-platform.com"
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

        <div className="flex justify-end -mt-1">
          <Link to="/super-admin/forgot-password" className="text-sm text-ember font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} icon={LuShieldCheck} className="mt-2">
          Sign In
        </Button>

      </form>
    </AuthLayout>
  );

};

export default SuperAdminLogin;