"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MarketingButton from "../MarketingButton";
import MarketingInput from "../MarketingInput";

const LoginPageContent = () => {
  return (
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

        <form className="mt-6 space-y-4">
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
          <div className="flex items-center justify-between text-xs text-muted">
            <p>Forgot password? Reset via OTP flow.</p>
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary-strong"
            >
              Create account
            </Link>
          </div>
          <MarketingButton className="w-full">Log In</MarketingButton>
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
  );
};

export default LoginPageContent;
