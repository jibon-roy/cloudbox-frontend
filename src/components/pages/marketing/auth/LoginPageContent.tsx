"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import MarketingButton from "../MarketingButton";
import MarketingInput from "../MarketingInput";
import ForgotPasswordModal from "./modals/ForgotPasswordModal";
import { useLoginMutation } from "@/src/redux/features/auth/authApi";
import { setUser } from "@/src/redux/features/auth/authSlice";

const LoginPageContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await login(formData).unwrap();
      if (result?.success && result?.data) {
        const { user, subscription, accessToken, refreshToken } = result.data;
        dispatch(
          setUser({
            user,
            subscription: subscription ?? null,
            access_token: accessToken,
            refresh_token: refreshToken,
          }),
        );

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${user?.name}!`,
          timer: 1500,
        }).then(() => router.push("/dashboard"));
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err?.data?.message || "Invalid email or password",
      });
    }
  };

  return (
    <>
      <div className="mx-auto grid w-full max-w-5xl gap-6 px-5 pb-10 pt-12 lg:grid-cols-2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border-subtle bg-surface p-6 lg:p-8"
        >
          <p className="text-xs font-semibold text-secondary">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold">
            Log in to your CloudBox workspace
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            Access your files, folders, and active subscription controls.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <MarketingInput
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <MarketingInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-primary hover:text-primary-strong hover:underline"
              >
                Forgot password?
              </button>
              <Link
                href="/auth/register"
                className="text-primary hover:text-primary-strong"
              >
                Create account
              </Link>
            </div>

            <MarketingButton
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </MarketingButton>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="brand-gradient rounded-3xl border border-border-subtle p-6 lg:p-8"
        >
          <h2 className="text-2xl font-bold">Policy-aware storage access</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            After sign in, users can upload and manage files only within package
            limits set by admin.
          </p>
          <div className="mt-6 space-y-3 rounded-2xl border border-border-subtle bg-surface p-4">
            <div className="h-10 rounded-xl bg-surface-soft" />
            <div className="h-10 rounded-xl bg-surface-soft" />
            <div className="h-24 rounded-xl bg-surface-soft" />
            <p className="text-xs text-muted">Workspace preview placeholder</p>
          </div>
        </motion.div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};

export default LoginPageContent;
