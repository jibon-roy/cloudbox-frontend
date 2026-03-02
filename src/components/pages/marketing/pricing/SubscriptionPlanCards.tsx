"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import MarketingButton from "../MarketingButton";

import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/src/redux/features/auth/authSlice";
import { useBuySubscriptionMutation } from "@/src/redux/features/subscription/subscriptionApi";
import { colors } from "@/src/lib/colors";

export type PricingPlanCardItem = {
  id: string;
  name: string;
  price: string;
  displayPrice: string;
  desc: string;
  features: string[];
};

type Props = {
  plans: PricingPlanCardItem[];
  mode: "pricing" | "select";
  hasUser?: boolean;
  selectedPlanId?: string | null;
  onSelectPlan?: (plan: PricingPlanCardItem) => void;
  sectionClassName?: string;
  disabledId?: string;
};

const planColors = [
  {
    border: "border-accent",
    text: "text-accent",
    ring: "ring-accent",
  },
  {
    border: "border-info",
    text: "text-info",
    ring: "ring-info",
  },
  {
    border: "border-primary",
    text: "text-primary",
    ring: "ring-primary",
  },
  {
    border: "border-purple",
    text: "text-purple",
    ring: "ring-purple",
  },
];

const SubscriptionPlanCards = ({
  plans,
  mode,
  hasUser,
  selectedPlanId,
  onSelectPlan,
  sectionClassName,
  disabledId,
}: Props) => {
  const router = useRouter();
  const accessToken = useAppSelector(selectCurrentToken);
  const currentUser = useAppSelector(selectCurrentUser);
  const isLoggedIn = Boolean(accessToken && currentUser);
  const [buySubscription, { isLoading: isBuying }] =
    useBuySubscriptionMutation();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (plan: PricingPlanCardItem) => {
    if (!isLoggedIn) {
      const result = await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to continue with subscription checkout.",
        confirmButtonText: "OK",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        router.push("/auth/login");
      }
      return;
    }

    try {
      onSelectPlan?.(plan);
      setProcessingPlanId(plan.id);

      const result = await buySubscription(plan.id).unwrap();

      // Handle free plan subscription
      if (result?.data?.is_free === true) {
        await Swal.fire({
          icon: "success",
          title: "Subscription Activated!",
          text: "Your free subscription has been activated successfully.",
          confirmButtonText: "Go to Dashboard",
        });
        window.location.href = "/dashboard";
        return;
      }

      // Handle paid plan checkout
      const checkoutUrl =
        result?.data?.url || result?.url || result?.data?.checkoutUrl;

      if (checkoutUrl && typeof checkoutUrl === "string") {
        window.location.href = checkoutUrl;
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Checkout Error",
        text: "Could not get checkout URL. Please try again.",
         confirmButtonColor: colors.primary
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Subscription Failed",
        text: error?.data?.message || "Unable to create checkout session",
         confirmButtonColor: colors.primary
      });
    } finally {
      setProcessingPlanId(null);
    }
  };

  return (
    <section
      className={`grid gap-6 md:grid-cols-2 lg:grid-cols-4 ${sectionClassName ?? "my-20"}`}
    >
      {plans.map((plan, index) => {
        const colorSet = planColors[index % planColors.length];
        const isPopular = index === 1;
        const isSelected = selectedPlanId === plan.id;

        return (
          <motion.article
            key={plan.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8, scale: 1.03 }}
            className={`rounded-2xl border-2 p-8 cursor-pointer transition-all ${
              isSelected
                ? `${colorSet.border} ${colorSet.ring} ring-2 bg-surface-soft`
                : isPopular
                  ? `${colorSet.border} ${colorSet.ring} bg-surface-soft border-x-2 border-y-8 lg:-my-8 ring-2`
                  : `${colorSet.border} bg-surface`
            }`}
          >
            {isPopular && (
              <div className="mb-3 inline-block rounded-full bg-primary px-3 py-2 text-xs font-semibold text-text-inverse">
                Most Popular
              </div>
            )}
            <h2 className="text-2xl font-bold text-app-text">{plan.name}</h2>
            <p className="mt-3 text-base text-muted">{plan.desc}</p>
            <p className={`mt-5 text-3xl font-bold ${colorSet.text}`}>
              {plan.displayPrice}
              {plan.price !== "Free" && (
                <span className="text-sm font-normal text-muted">/mo</span>
              )}
            </p>
            <ul className="mt-6 space-y-3 text-base text-app-text">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className={`${colorSet.text} font-bold`}>•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              {mode === "pricing" ? (
                <Link href={hasUser ? "/dashboard" : "/auth/register"}>
                  <MarketingButton className="w-full">
                    {hasUser ? "Manage Plan" : `Start with ${plan.name}`}
                  </MarketingButton>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={isBuying || disabledId === plan.id}
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-strong ${
                    isBuying
                      ? "cursor-not-allowed opacity-50"
                      : disabledId === plan.id
                        ? "cursor-not-allowed opacity-50"
                        : ""
                  }`}
                >
                  {disabledId === plan.id ? "Current Plan" : isBuying && processingPlanId === plan.id
                    ? "Redirecting..."
                    : isSelected
                      ? "Selected"
                      : `Select ${plan.name}`}
                </button>
              )}
            </div>
          </motion.article>
        );
      })}
    </section>
  );
};

export default SubscriptionPlanCards;
