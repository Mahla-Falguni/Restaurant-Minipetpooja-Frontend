import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LuLock, LuEye, LuEyeOff, LuArrowLeft, LuCircleAlert, LuCircleCheck } from "react-icons/lu";
import toast from "react-hot-toast";

import superAdminAxiosInstance from "../../api/superAdminAxiosInstance";
import AuthLayout from "../../layouts/AuthLayout";
import { Input } from "../../components/Input";
import Button from "../../components/common/Button";

/*
=========================================================
SUPER ADMIN — RESET PASSWORD
Route: /super-admin/reset-password/:token
Mirrors the restaurant-side ResetPassword.jsx, pointed at the
SuperAdmin collection instead.
=========================================================
*/

const SuperAdminResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("checking");
  const [invalidReason, setInvalidReason] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {

    if (!token) {
      setStatus("invalid");
      setInvalidReason("No reset token found.");
      return;
    }

    superAdminAxiosInstance
      .get(`/auth/verify-reset-token/${token}`)
      .then((res) => {
        if (res.data.valid) {
          setStatus("valid");
        } else {
          setInvalidReason(res.data.message || "This link is invalid or has expired.");
          setStatus("invalid");
        }
      })
      .catch(() => {
        setInvalidReason("This link is invalid or has expired.");
        setStatus("invalid");
      });

  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {

      await superAdminAxiosInstance.post(`/auth/reset-password/${token}`, {
        new_password: password,
        confirm_password: confirmPassword,
      });

      setStatus("done");
      toast.success("Password reset successfully.");

      setTimeout(() => navigate("/super-admin/login"), 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setSaving(false);
    }

  };

  const passwordsMatch = confirmPassword ? password === confirmPassword : null;

  return (
    <AuthLayout
      eyebrow="Platform Admin"
      title={
        status === "checking" ? "Verifying link…"
          : status === "invalid" ? "Link invalid"
          : status === "done" ? "Password updated"
          : "Set a new password"
      }
      subtitle={
        status === "valid" ? "Choose a strong password you haven't used before."
          : status === "done" ? "Redirecting you to sign in…"
          : undefined
      }
    >

      {status === "checking" && (
        <div className="flex flex-col items-center gap-3 py-10 text-slate text-sm">
          <div className="h-8 w-8 rounded-full border-2 border-line border-t-ember animate-spin" />
          Validating your reset link…
        </div>
      )}

      {status === "invalid" && (
        <div className="space-y-5">

          <div className="rounded-xl border border-claret/20 bg-claret/5 p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-claret/10 text-claret mx-auto mb-3">
              <LuCircleAlert size={22} />
            </span>
            <p className="text-sm font-medium text-ink mb-1">This link is invalid or expired</p>
            <p className="text-sm text-slate leading-relaxed">{invalidReason}</p>
          </div>

          <Link to="/super-admin/forgot-password">
            <Button fullWidth>Request a New Link</Button>
          </Link>

        </div>
      )}

      {status === "done" && (
        <div className="rounded-xl border border-basil/20 bg-basil/5 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-basil/10 text-basil mx-auto mb-3">
            <LuCircleCheck size={22} />
          </span>
          <p className="text-sm font-medium text-ink">Your password has been reset.</p>
          <p className="text-sm text-slate mt-1">Taking you to the sign-in page…</p>
        </div>
      )}

      {status === "valid" && (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>

          <div className="relative">
            <Input
              label="New password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="relative">
            <Input
              label="Confirm password"
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
            />
            <LuLock size={16} className="absolute left-3 top-[38px] text-slate/50 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-[36px] text-slate/50 hover:text-ink transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <LuEyeOff size={16} /> : <LuEye size={16} />}
            </button>

            {confirmPassword && (
              <p className={`mt-1.5 text-xs font-medium ${passwordsMatch ? "text-basil" : "text-claret"}`}>
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            loading={saving}
            disabled={!password || !confirmPassword || password !== confirmPassword}
            className="mt-2"
          >
            Reset Password
          </Button>

        </form>
      )}

      <div className="mt-8 flex justify-center">
        <Link to="/super-admin/login" className="flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors">
          <LuArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>

    </AuthLayout>
  );

};

export default SuperAdminResetPassword;