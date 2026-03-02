"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import MarketingButton from "../../MarketingButton";
import MarketingInput from "../../MarketingInput";
import { useResetPasswordMutation } from "@/src/redux/features/auth/authApi";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

const ResetPasswordModal = ({
  isOpen,
  onClose,
  email,
}: ResetPasswordModalProps) => {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = {
      otp: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    if (!formData.password) {
      newErrors.password = "New password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await resetPassword({
        email,
        otp: formData.otp,
        password: formData.password,
      }).unwrap();

      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "Password Reset Successful!",
          text: "You can now log in with your new password.",
          timer: 2000,
        }).then(() => {
          onClose();
          router.push("/auth/login");
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text: err?.data?.message || "Invalid OTP or password reset failed",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Create New Password</h2>
              <button
                onClick={onClose}
                className="text-2xl font-bold text-muted hover:text-app-text"
              >
                ×
              </button>
            </div>

            <p className="mt-2 text-sm text-muted">
              Enter the OTP and set a new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <MarketingInput
                  label="OTP Code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setFormData({ ...formData, otp: e.target.value });
                      setErrors({ ...errors, otp: "" });
                    }
                  }}
                />
                {errors.otp && (
                  <p className="mt-1 text-xs text-red-500">{errors.otp}</p>
                )}
              </div>

              <div>
                <MarketingInput
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <MarketingInput
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    setErrors({ ...errors, confirmPassword: "" });
                  }}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2">
                <MarketingButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </MarketingButton>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-lg bg-surface-soft px-4 py-2 text-sm font-medium text-app-text hover:bg-surface-soft/80"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResetPasswordModal;
