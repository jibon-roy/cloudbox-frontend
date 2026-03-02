"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import MarketingButton from "../../MarketingButton";

interface OTPVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
  email: string;
  isLoading: boolean;
}

const OTPVerifyModal = ({
  isOpen,
  onClose,
  onVerify,
  email,
  isLoading,
}: OTPVerifyModalProps) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`,
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`,
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length === 6) {
      onVerify(fullOtp);
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
            <h2 className="text-2xl font-bold">Verify Your Email</h2>
            <p className="mt-2 text-sm text-muted">
              We have sent a 6-digit OTP to{" "}
              <span className="font-semibold text-app-text">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div>
                <label className="text-xs font-semibold text-secondary">
                  Enter OTP
                </label>
                <div className="mt-3 flex gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="h-12 w-12 border border-border-subtle bg-surface-soft text-center text-lg font-bold text-app-text placeholder-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <MarketingButton
                  type="submit"
                  disabled={isLoading || otpDigits.join("").length !== 6}
                  className="w-full"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </MarketingButton>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-lg bg-surface-soft px-4 py-2 text-sm font-medium text-app-text hover:bg-surface-soft/80"
                >
                  Cancel
                </button>
              </div>

              <p className="text-center text-xs text-muted">
                Did not receive the code?{" "}
                <button
                  type="button"
                  className="text-primary hover:text-primary-strong hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OTPVerifyModal;
