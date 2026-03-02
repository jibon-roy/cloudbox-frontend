"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Swal from "sweetalert2";
import MarketingButton from "../../MarketingButton";
import MarketingInput from "../../MarketingInput";
import { useForgotPasswordMutation } from "@/src/redux/features/auth/authApi";
import OTPVerifyModal from "./OTPVerifyModal";
import ResetPasswordModal from "./ResetPasswordModal";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "request" | "otp" | "reset";

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    try {
      const result = await forgotPassword({ email }).unwrap();
      if (result?.success) {
        Swal.fire({
          icon: "success",
          title: "OTP Sent!",
          text: `Verification code sent to ${email}`,
          timer: 2000,
        });
        setShowOTPModal(true);
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.data?.message || "Failed to send OTP",
      });
    }
  };

  const handleClose = () => {
    setStep("request");
    setEmail("");
    setEmailError("");
    setShowOTPModal(false);
    setShowResetModal(false);
    onClose();
  };

  const handleOTPVerifyClose = () => {
    setShowOTPModal(false);
    handleClose();
  };

  const handleResetPasswordClose = () => {
    setShowResetModal(false);
    handleClose();
  };

  return (
    <>
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
                <h2 className="text-2xl font-bold">Reset Password</h2>
                <button
                  onClick={handleClose}
                  className="text-2xl font-bold text-muted hover:text-app-text"
                >
                  ×
                </button>
              </div>

              <p className="mt-2 text-sm text-muted">
                Enter your email address and we'll send you an OTP to reset your
                password.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <MarketingInput
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  {emailError && (
                    <p className="mt-1 text-xs text-red-500">{emailError}</p>
                  )}
                </div>

                <MarketingButton
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </MarketingButton>
              </form>

              <button
                onClick={handleClose}
                className="mt-4 w-full rounded-lg bg-surface-soft px-4 py-2 text-sm font-medium text-app-text hover:bg-surface-soft/80"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <OTPVerifyModal
        isOpen={showOTPModal}
        onClose={handleOTPVerifyClose}
        onVerify={() => {
          setShowOTPModal(false);
          setShowResetModal(true);
        }}
        email={email}
        isLoading={false}
      />

      {showResetModal && (
        <ResetPasswordModal
          isOpen={showResetModal}
          onClose={handleResetPasswordClose}
          email={email}
        />
      )}
    </>
  );
};

export default ForgotPasswordModal;
