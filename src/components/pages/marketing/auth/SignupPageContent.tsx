"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MarketingButton from "../MarketingButton";
import MarketingInput from "../MarketingInput";

const SignupPageContent = () => {
  return (
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

        <form className="mt-6 space-y-4">
          <MarketingInput label="Full Name" placeholder="John Doe" />
          <MarketingInput
            label="Email"
            type="email"
            placeholder="john@example.com"
          />
          <MarketingInput
            label="Password"
            type="password"
            placeholder="••••••••"
          />
          <MarketingInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
          />
          <p className="text-xs text-muted">
            Extra priority feature: Email verification + password reset via OTP.
          </p>
          <MarketingButton className="w-full">Create Account</MarketingButton>
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
        <p className="mt-3 text-xs text-muted">Onboarding visual placeholder</p>
      </motion.div>
    </div>
  );
};

export default SignupPageContent;
