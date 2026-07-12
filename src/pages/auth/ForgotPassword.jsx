import { useState } from "react";
import { Link } from "react-router-dom";
import { LuMail, LuArrowLeft, LuMailCheck } from "react-icons/lu";
import toast from "react-hot-toast";

import axiosInstance from "../../api/axiosInstance";
import AuthLayout from "../../layouts/AuthLayout";
import { Input } from "../../components/Input";
import Button from "../../components/common/Button";

/*
=========================================================
FORGOT PASSWORD — shared across every role
Admin, Manager, Waiter, Cashier, Kitchen all log in through the
same User model and the same /login page, so they all use this
same forgot-password flow too — no per-role duplication needed.
=========================================================
*/

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/auth/forgot-password", { email: email.trim() });
      // Backend always responds the same way whether or not the email exists —
      // this is intentional, so we never reveal which emails are registered.
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  return (
    <AuthLayout
      eyebrow="Account Recovery"
      title={sent ? "Check your email" : "Forgot password?"}
      subtitle={
        sent
          ? "If an account exists for that address, a reset link is on its way."
          : "Enter the email tied to your account and we'll send you a reset link."
      }
    >

      {!sent ? (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>

          <div className="relative">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@restaurant.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
            <LuMail size={16} className="absolute left-3 top-[38px] text-slate/50 pointer-events-none" />
          </div>

          <Button type="submit" fullWidth loading={loading} className="mt-2">
            Send Reset Link
          </Button>

        </form>
      ) : (
        <div className="rounded-xl border border-line bg-paper-dim/40 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-basil/10 text-basil mx-auto mb-4">
            <LuMailCheck size={22} />
          </span>
          <p className="text-sm text-charcoal leading-relaxed">
            The link is valid for <strong className="text-ink">15 minutes</strong>. If it doesn't arrive shortly, check your spam folder.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link to="/login" className="flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors">
          <LuArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>

    </AuthLayout>
  );

};

export default ForgotPassword;