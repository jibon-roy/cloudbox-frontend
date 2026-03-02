"use client";

import { motion } from "framer-motion";
import SubscriptionPlanCards, {
  type PricingPlanCardItem,
} from "../../marketing/pricing/SubscriptionPlanCards";
import { useGetAllSubscriptionQuery } from "@/src/redux/features/subscription/subscriptionApi";
import { useGetMySubscriptionQuery } from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";

interface Package {
  id: string;
  name: string;
  price: string;
  max_folders: number;
  max_file_size_mb: number;
  max_storage_mb: number;
  max_nesting_level: number | null;
  total_file_limit: number | null;
  files_per_folder: number | null;
  trial_days: number;
  is_active: boolean;
}

const extractObj = (value: unknown): Record<string, unknown> => {
  if (value && typeof value === "object") {
    const cast = value as Record<string, unknown>;
    if (
      cast.data &&
      typeof cast.data === "object" &&
      !Array.isArray(cast.data)
    ) {
      return cast.data as Record<string, unknown>;
    }
    return cast;
  }
  return {};
};

const MySubscriptionPage = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const { data: packagesData, isLoading: packagesLoading } =
    useGetAllSubscriptionQuery({});
  const { data: subscriptionRaw, isLoading: subscriptionLoading } =
    useGetMySubscriptionQuery(undefined, { skip });

  const currentSubscription = extractObj(subscriptionRaw);

console.log("data",subscriptionRaw);
  const currentPackageId = String(
    currentSubscription.packageId ?? currentSubscription.package_id ?? "",
  );

  // Transform API data to display format
  const transformedPackages = (
    packages: Package[] = [],
  ): PricingPlanCardItem[] => {
    return packages
      .filter((pkg) => pkg.is_active)
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: pkg.price,
        displayPrice:
          pkg.price === "0" ? "Free" : `$${parseFloat(pkg.price).toFixed(2)}`,
        desc:
          pkg.price === "0"
            ? "Best for trying the platform"
            : pkg.max_storage_mb > 1000
              ? "Enterprise scale and governance"
              : pkg.max_storage_mb > 512
                ? "For teams with heavy workflows"
                : "Great for individual professionals",
        features: [
          `${pkg.max_folders} folders`,
          `${pkg.max_file_size_mb}MB file size`,
          `${pkg.max_storage_mb}MB storage`,
          pkg.price === "0"
            ? "Unlimited trial"
            : `${pkg.trial_days} days trial`,
        ],
      }));
  };

  const packages = transformedPackages(packagesData?.data || []);

  if (packagesLoading || subscriptionLoading) {
    return (
      <div className="mx-auto w-full space-y-14">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-bg-primary rounded-3xl border border-border-subtle p-10 lg:p-14 text-center"
        >
          <div className="space-y-4">
            <div className="mx-auto h-6 w-48 animate-pulse rounded-lg bg-surface-soft"></div>
            <div className="mx-auto h-12 w-96 animate-pulse rounded-lg bg-surface-soft"></div>
            <div className="mx-auto mt-6 h-20 w-full max-w-2xl animate-pulse rounded-lg bg-surface-soft"></div>
          </div>
        </motion.section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-96 animate-pulse rounded-2xl border-2 border-border-subtle bg-surface-soft p-8"
            >
              <div className="h-6 w-24 rounded bg-surface/50"></div>
              <div className="mt-4 h-8 w-32 rounded bg-surface/50"></div>
              <div className="mt-4 h-32 w-full rounded bg-surface/50"></div>
            </motion.div>
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-bg-primary rounded-2xl border border-border-subtle p-6 lg:p-8"
      >
        <p className="text-sm font-semibold text-primary">SUBSCRIPTION</p>
        <h1 className="mt-2 text-2xl font-bold text-app-text lg:text-4xl">
          Manage Your Subscription
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted lg:text-base">
          View available plans and upgrade or change your subscription anytime.
        </p>
      </motion.div>

      {currentPackageId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border-subtle bg-surface p-5 lg:p-6"
        >
          <h2 className="text-lg font-semibold text-app-text">
            Current Subscription
          </h2>
          <p className="mt-2 text-sm text-muted">
            Package:{" "}
            <span className="font-medium text-primary">
              {String(
                (currentSubscription.packageName as string | undefined) ??
                  (currentSubscription.package_name as string | undefined) ??
                  "Active",
              )}
            </span>
          </p>
          {currentSubscription.ended_at ? (
            <p className="mt-1 text-sm text-muted">
              Expires:{" "}
              {new Date(
                String(currentSubscription.ended_at),
              ).toLocaleDateString()}
            </p>
          ) : null}
        </motion.div>
      )}

      <SubscriptionPlanCards
        plans={packages}
        mode="select"
        selectedPlanId={currentPackageId}
        sectionClassName="my-20"
        disabledId={currentPackageId}
      />
    </div>
  );
};

export default MySubscriptionPage;
