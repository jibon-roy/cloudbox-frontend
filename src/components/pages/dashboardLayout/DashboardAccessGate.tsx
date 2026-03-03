"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGetMySubscriptionQuery } from "@/src/redux/features/dashboard/dashboardApi";
import {
  useGetAllSubscriptionQuery,
  useGetCurrentSubscriptionQuery,
} from "@/src/redux/features/subscription/subscriptionApi";
import SubscriptionPlanCards, {
  PricingPlanCardItem,
} from "../marketing/pricing/SubscriptionPlanCards";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentSubscription,
  selectCurrentToken,
  selectCurrentUser,
} from "@/src/redux/features/auth/authSlice";

type Props = {
  children: React.ReactNode;
};

const GateShell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen items-center justify-center bg-app-bg p-3 sm:p-4 lg:p-6">
    <div className="w-full max-w-7xl rounded-2xl border border-border-subtle bg-surface p-6 lg:p-8">
      {children}
    </div>
  </div>
);

const isNonEmptyObject = (value: unknown) => {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as Record<string, unknown>).length > 0
  );
};

export default function DashboardAccessGate({ children }: Props) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const accessToken = useAppSelector(selectCurrentToken);
  const user = useAppSelector(selectCurrentUser);
  const persistedSubscription = useAppSelector(selectCurrentSubscription);
  const userRole =
    user && typeof user === "object"
      ? String((user as { role?: unknown }).role ?? "")
      : "";
  const isUserRole = userRole.toUpperCase() === "USER";
  const isLoggedIn = Boolean(accessToken && user);

  const { data: mySubscriptionRaw, isLoading: subscriptionLoading } =
    useGetMySubscriptionQuery(undefined, {
      skip: !accessToken || !isUserRole,
    });

  const { data: allSubscriptionsRaw, isLoading: plansLoading } =
    useGetAllSubscriptionQuery({}, { skip: !isLoggedIn || !isUserRole });

  // const { data: allSubscriptionsRaw, isLoading: plansLoading } =
  //   useGetCurrentSubscriptionQuery({}, { skip: !isLoggedIn || !isUserRole });

  const apiSubscription =
    mySubscriptionRaw && typeof mySubscriptionRaw === "object"
      ? (mySubscriptionRaw as { data?: unknown }).data
      : null;

  const plans = useMemo<PricingPlanCardItem[]>(() => {
    const rawPlans = Array.isArray(
      (allSubscriptionsRaw as { data?: unknown })?.data,
    )
      ? ((allSubscriptionsRaw as { data: Array<Record<string, unknown>> })
          .data ?? [])
      : [];

    return rawPlans
      .filter((plan) => Boolean(plan?.is_active))
      .sort((a, b) => Number(a?.price ?? 0) - Number(b?.price ?? 0))
      .map((plan) => {
        const priceNum = Number(plan?.price ?? 0);

        return {
          id: String(plan?.id ?? ""),
          name: String(plan?.name ?? "Plan"),
          price: priceNum === 0 ? "Free" : `$${priceNum.toFixed(2)}/mo`,
          displayPrice: priceNum === 0 ? "Free" : `$${priceNum.toFixed(2)}`,
          desc:
            priceNum === 0
              ? "Best for trying the platform"
              : Number(plan?.max_storage_mb ?? 0) > 1000
                ? "Enterprise scale and governance"
                : Number(plan?.max_storage_mb ?? 0) > 512
                  ? "For teams with heavy workflows"
                  : "Great for individual professionals",
          features: [
            `${Number(plan?.max_folders ?? 0)} folders`,
            `${Number(plan?.max_file_size_mb ?? 0)}MB file size`,
            `${Number(plan?.max_storage_mb ?? 0)}MB storage`,
            priceNum === 0
              ? "Unlimited trial"
              : `${Number(plan?.trial_days ?? 0)} days trial`,
          ],
        };
      });
  }, [allSubscriptionsRaw]);

  const hasPersistedSubscription = isNonEmptyObject(persistedSubscription);
  const hasApiSubscription = isNonEmptyObject(apiSubscription);
  const hasSubscription = hasPersistedSubscription || hasApiSubscription;

  if (!isLoggedIn) {
    return (
      <GateShell>
        <p className="text-sm font-semibold text-primary">AUTH REQUIRED</p>
        <h1 className="mt-2 text-2xl font-bold text-app-text lg:text-3xl">
          Please Login First
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted lg:text-base">
          You need to login to access dashboard features.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/auth/login"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-strong"
          >
            Go to Login
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-app-text transition-colors hover:bg-surface-soft"
          >
            Go to Home
          </Link>
        </div>
      </GateShell>
    );
  }

  if (!isUserRole) {
    return <>{children}</>;
  }

  if (subscriptionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-app-bg p-3 sm:p-4 lg:p-6">
        <div className="flex min-h-[55vh] w-full items-center justify-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-border-subtle" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary border-r-primary" />
            <div className="absolute inset-2.5 animate-pulse rounded-full bg-surface-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <GateShell>
        <p className="text-sm font-semibold text-primary">STEP 1 OF 1</p>
        <h1 className="mt-2 text-2xl font-bold text-app-text lg:text-3xl">
          Select Subscription
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted lg:text-base">
          Please select a subscription plan to access your secure file manager.
        </p>

        <div className="mt-16">
          {plansLoading ? (
            <p className="text-sm text-muted">Loading plans...</p>
          ) : plans.length === 0 ? (
            <p className="text-sm text-muted">No active plans available.</p>
          ) : (
            <SubscriptionPlanCards
              plans={plans}
              mode="select"
              selectedPlanId={selectedPlanId}
              onSelectPlan={(plan) => setSelectedPlanId(plan.id)}
              sectionClassName="my-0"
            />
          )}
        </div>

        <div className="mt-20 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-app-text transition-colors hover:bg-surface-soft"
          >
            Cancel
          </Link>
        </div>
      </GateShell>
    );
  }

  return <>{children}</>;
}
