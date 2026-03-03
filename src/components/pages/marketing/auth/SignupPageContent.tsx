"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import MarketingButton from "../MarketingButton";
import MarketingInput from "../MarketingInput";
import OTPVerifyModal from "./modals/OTPVerifyModal";
import {
  useRegisterMutation,
  useOtpMutation,
} from "@/src/redux/features/auth/authApi";
import { setUser } from "@/src/redux/features/auth/authSlice";
import { colors } from "@/src/lib/colors";

const SignupPageContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [verifyOtp, { isLoading: otpLoading }] = useOtpMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (result?.success) {
        setRegisteredEmail(formData.email);
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Please verify your email with OTP to complete signup.",
          timer: 2000,
        });
        setShowOTPModal(true);
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err?.data?.message || "This email might already be registered",
        confirmButtonColor: colors.primary,
      });
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      const result = await verifyOtp({
        email: registeredEmail,
        otp,
      }).unwrap();

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
          title: "Email Verified!",
          text: "Your account is ready to use.",
          timer: 1500,
        }).then(() => router.push("/dashboard"));
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err?.data?.message || "Invalid or expired OTP",
        confirmButtonColor: colors.primary,
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
          <p className="text-xs font-semibold text-secondary">Create account</p>
          <h1 className="mt-2 text-3xl font-bold">Sign up for CloudBox</h1>
          <p className="mt-3 text-sm leading-7 text-muted">
            Register and start managing files in a package-controlled workspace.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <MarketingInput
                label="Full Name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

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

            <div>
              <MarketingInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <p className="text-xs text-muted">
              We'll send you an OTP to verify your email address.
            </p>

            <MarketingButton
              type="submit"
              disabled={registerLoading}
              className="w-full"
            >
              {registerLoading ? "Creating..." : "Create Account"}
            </MarketingButton>
          </form>

          <p className="mt-4 text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary hover:text-primary-strong"
            >
              Log in
            </Link>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="rounded-3xl border border-border-subtle bg-surface p-6 lg:p-8"
        >
          <h2 className="text-2xl font-bold">What you unlock</h2>
          <div className="mt-5 space-y-3">
            {[
              "Upload files by allowed MIME type policy",
              "Create nested folder structures within tier limits",
              "Track active subscription and upgrade history",
              "Use secure sharing and controlled access links",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border-subtle bg-surface-soft px-4 py-3 text-sm text-app-text"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 h-44 rounded-2xl border border-border-subtle brand-grid bg-surface-soft" />
          <p className="mt-3 text-xs text-muted">
            Onboarding visual placeholder
          </p>
        </motion.div>
      </div>

      <OTPVerifyModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        isLoading={otpLoading}
        email={registeredEmail}
      />
    </>
  );
};

export default SignupPageContent;
