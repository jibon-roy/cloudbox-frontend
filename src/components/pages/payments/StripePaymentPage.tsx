"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useConfirmPaymentMutation } from "@/src/redux/features/subscription/subscriptionApi";
import { CheckCircle2, XCircle, FileText, Package } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentUser,
  setUser,
} from "@/src/redux/features/auth/authSlice";

interface SubscriptionData {
  id: string;
  userId: string;
  packageId: string;
  package: {
    id: string;
    name: string;
    price: string;
    max_storage_mb: number;
  };
  started_at: string;
  ended_at: string;
  is_active: boolean;
}

const StripePaymentPage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const refreshToken = useAppSelector((state) => state.auth.refresh_token);

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [confirmPayment, { isLoading }] = useConfirmPaymentMutation();
  const [result, setResult] = useState<{
    status: "loading" | "success" | "error";
    data?: SubscriptionData;
    error?: string;
  }>({ status: "loading" });

  useEffect(() => {
    const handlePaymentConfirmation = async () => {
      if (!sessionId) {
        setResult({
          status: "error",
          error: "Invalid session. No session ID found.",
        });
        return;
      }

      try {
        const response = await confirmPayment(sessionId).unwrap();
        if (response?.data) {
          if (currentUser) {
            dispatch(
              setUser({
                user: currentUser,
                subscription: response.data,
                access_token: accessToken,
                refresh_token: refreshToken,
              }),
            );
          }

          setResult({
            status: "success",
            data: response.data,
          });
        } else {
          setResult({
            status: "error",
            error: response?.message || "Payment confirmation failed",
          });
        }
      } catch (error: any) {
        setResult({
          status: "error",
          error:
            error?.data?.message ||
            error?.message ||
            "Unable to confirm payment. Please try again.",
        });
      }
    };

    handlePaymentConfirmation();
  }, [
    sessionId,
    confirmPayment,
    currentUser,
    accessToken,
    refreshToken,
    dispatch,
  ]);

  if (result.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-surface via-surface-soft to-surface px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 text-center"
        >
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 rounded-full border-4 border-surface-soft border-t-primary"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-app-text">
              Confirming Payment
            </h1>
            <p className="mt-2 text-sm text-muted">
              Please wait while we verify your payment...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (result.status === "success" && result.data) {
    const subscription = result.data;
    const endDate = new Date(subscription.ended_at);
    const startDate = new Date(subscription.started_at);
    const daysRemaining = Math.ceil(
      (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );

    return (
      <div className="min-h-screen bg-linear-to-br from-surface via-surface-soft to-surface px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-bg-success rounded-3xl border border-border-subtle p-8 text-center lg:p-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
            >
              <CheckCircle2 className="h-12 w-12 text-success" />
            </motion.div>

            <h1 className="text-3xl font-bold text-app-text lg:text-4xl">
              Payment Successful!
            </h1>
            <p className="mt-3 text-base text-muted">
              Your subscription has been activated successfully.
            </p>
          </motion.div>

          {/* Subscription Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-app-text">
              Subscription Details
            </h2>

            {/* Plan Card */}
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-app-text">
                      {subscription.package.name}
                    </h3>
                    <p className="text-sm text-muted">Active Plan</p>
                  </div>
                </div>
                <div className="rounded-full bg-success/10 px-4 py-2">
                  <span className="text-sm font-semibold text-success">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Storage */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border-subtle bg-surface p-4"
              >
                <p className="text-xs font-semibold text-muted uppercase">
                  Storage Included
                </p>
                <p className="mt-2 text-2xl font-bold text-app-text">
                  {(subscription.package.max_storage_mb / 1024).toFixed(0)} GB
                </p>
              </motion.div>

              {/* Duration */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-border-subtle bg-surface p-4"
              >
                <p className="text-xs font-semibold text-muted uppercase">
                  Days Remaining
                </p>
                <p className="mt-2 text-2xl font-bold text-primary">
                  {Math.max(daysRemaining, 0)} days
                </p>
              </motion.div>

              {/* Start Date */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border border-border-subtle bg-surface p-4"
              >
                <p className="text-xs font-semibold text-muted uppercase">
                  Started
                </p>
                <p className="mt-2 text-base font-semibold text-app-text">
                  {startDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </motion.div>

              {/* End Date */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="rounded-xl border border-border-subtle bg-surface p-4"
              >
                <p className="text-xs font-semibold text-muted uppercase">
                  Expires
                </p>
                <p className="mt-2 text-base font-semibold text-app-text">
                  {endDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </motion.div>
            </div>

            {/* Invoice Section */}
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <FileText className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-app-text">Invoice</p>
                    <p className="text-sm text-muted">
                      Subscription ID: {subscription.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/billing-history"
                  className="rounded-lg bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  View Invoice
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/dashboard"
              className="flex-1 rounded-xl bg-primary px-6 py-3 text-center font-semibold text-text-inverse transition-colors hover:bg-primary-strong"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/dashboard/my-subscription"
              className="flex-1 rounded-xl border border-border-subtle bg-surface px-6 py-3 text-center font-semibold text-app-text transition-colors hover:bg-surface-soft"
            >
              Manage Subscription
            </Link>
          </motion.div>

          {/* Confirmation Message */}
          <div className="rounded-lg border border-surface-soft bg-surface-soft/50 p-4 text-center">
            <p className="text-sm text-muted">
              A confirmation email has been sent to your registered email
              address.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  return (
    <div className="min-h-screen bg-linear-to-br from-surface via-surface-soft to-surface px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Error Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-bg-error rounded-3xl border border-border-subtle p-8 text-center lg:p-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-error/10"
          >
            <XCircle className="h-12 w-12 text-error" />
          </motion.div>

          <h1 className="text-3xl font-bold text-app-text lg:text-4xl">
            Payment Failed
          </h1>
          <p className="mt-3 text-base text-muted">{result.error}</p>
        </motion.div>

        {/* Error Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border-subtle bg-surface p-6"
        >
          <h2 className="mb-4 font-semibold text-app-text">What can you do?</h2>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted"></span>
              <span>Check your internet connection and try again</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted"></span>
              <span>Verify your payment card details are correct</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted"></span>
              <span>Try a different payment method</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-muted"></span>
              <span>Contact support if the problem persists</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <button
            onClick={() => window.location.reload()}
            disabled={isLoading}
            className="flex-1 rounded-xl bg-primary px-6 py-3 text-center font-semibold text-text-inverse transition-colors hover:bg-primary-strong disabled:opacity-50"
          >
            {isLoading ? "Retrying..." : "Retry Payment"}
          </button>
          <Link
            href="/dashboard/my-subscription"
            className="flex-1 rounded-xl border border-border-subtle bg-surface px-6 py-3 text-center font-semibold text-app-text transition-colors hover:bg-surface-soft"
          >
            Back to Subscription
          </Link>
          <Link
            href="/"
            className="flex-1 rounded-xl border border-border-subtle bg-surface px-6 py-3 text-center font-semibold text-app-text transition-colors hover:bg-surface-soft"
          >
            Go Home
          </Link>
        </motion.div>

        {/* Support Message */}
        <div className="rounded-lg border border-surface-soft bg-surface-soft/50 p-4 text-center">
          <p className="text-sm text-muted">
            Need help?{" "}
            <a
              href="mailto:support@cloudbox.com"
              className="font-semibold text-primary hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentPage;
