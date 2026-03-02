"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MarketingButton from "../MarketingButton";
import SubscriptionPlanCards from "./SubscriptionPlanCards";
import { useGetAllSubscriptionQuery } from "@/src/redux/features/subscription/subscriptionApi";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

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

const PricingPageContent = () => {
  const { data, isLoading, error } = useGetAllSubscriptionQuery({});
  const user = useSelector((state: RootState) => state.auth.user);

  // Transform API data to display format
  const transformedPackages = (packages: Package[] = []) => {
    return packages
      .filter((pkg) => pkg.is_active)
      .sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      .map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price: `$${parseFloat(pkg.price).toFixed(2)}/mo`,
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
        specs: pkg,
      }));
  };

  const packages = transformedPackages(data?.data || []);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-14 px-5 pb-10 pt-12 lg:px-10">
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
              className="rounded-2xl border-2 border-border-subtle bg-surface p-8"
            >
              <div className="space-y-4">
                {/* Title skeleton */}
                <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-soft"></div>

                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded-lg bg-surface-soft"></div>
                  <div className="h-4 w-28 animate-pulse rounded-lg bg-surface-soft"></div>
                </div>

                {/* Price skeleton */}
                <div className="h-10 w-20 animate-pulse rounded-lg bg-surface-soft"></div>

                {/* Features skeleton */}
                <div className="mt-6 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-full animate-pulse rounded-lg bg-surface-soft"
                    ></div>
                  ))}
                </div>

                {/* Button skeleton */}
                <div className="mt-7 h-10 w-full animate-pulse rounded-lg bg-surface-soft"></div>
              </div>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="section-bg-info rounded-3xl border border-border-subtle p-10 lg:p-12"
        >
          <div className="mb-8 space-y-4">
            <div className="h-6 w-32 animate-pulse rounded-lg bg-surface-soft"></div>
            <div className="h-12 w-64 animate-pulse rounded-lg bg-surface-soft"></div>
            <div className="h-20 w-full max-w-2xl animate-pulse rounded-lg bg-surface-soft"></div>
          </div>

          <div className="mt-8 h-64 w-full animate-pulse rounded-2xl bg-surface-soft"></div>
        </motion.section>
      </div>
    );
  }

  if (error || !packages.length) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-14 px-5 pb-10 pt-12 lg:px-10">
        <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
          <p className="text-muted">Failed to load pricing packages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-14 px-5 pb-10 pt-12 lg:px-10">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-bg-primary rounded-3xl border border-border-subtle p-10 lg:p-14 text-center"
      >
        <p className="text-sm font-semibold text-primary">FLEXIBLE PRICING</p>
        <h1 className="mt-4 text-4xl font-bold lg:text-5xl">
          Choose the Package that Fits
          <br />
          Your Storage Policy
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-md leading-8 text-muted">
          Admin can create and edit all package restrictions dynamically. These
          tiers are live from your backend and fully customizable from your
          admin dashboard with instant updates.
        </p>
      </motion.section>

      <SubscriptionPlanCards plans={packages} mode="pricing" hasUser={!!user} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="section-bg-info rounded-3xl border border-border-subtle p-10 lg:p-12"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-info">COMPARISON TABLE</p>
            <h3 className="mt-3 text-4xl font-bold lg:text-5xl">
              Detailed Policy
              <br />
              Comparison Matrix
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Compare all the key limits and features across subscription tiers
              to find the perfect fit for your organization&apos;s needs.
            </p>
          </div>
          <Link href="/contact">
            <motion.div whileHover={{ scale: 1.05 }}>
              <MarketingButton variant="outline">
                Need custom plan?
              </MarketingButton>
            </motion.div>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto rounded-2xl border border-border-subtle"
        >
          <table className="w-full border-collapse text-left text-base">
            <thead className="bg-surface-strong text-app-text">
              <tr>
                <th className="px-6 py-4 font-bold">Limit</th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="px-6 py-4 font-bold">
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-surface text-app-text">
              <tr className="border-t border-border-subtle">
                <td className="px-6 py-4 font-semibold">Max Folders</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="px-6 py-4">
                    {pkg.specs.max_folders}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border-subtle">
                <td className="px-6 py-4 font-semibold">Max File Size</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="px-6 py-4">
                    {pkg.specs.max_file_size_mb}MB
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border-subtle">
                <td className="px-6 py-4 font-semibold">Storage Limit</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="px-6 py-4">
                    {pkg.specs.max_storage_mb}MB
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border-subtle">
                <td className="px-6 py-4 font-semibold">Trial Days</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="px-6 py-4">
                    {pkg.price === "0"
                      ? "Unlimited"
                      : `${pkg.specs.trial_days} days`}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border-subtle">
                <td className="px-6 py-4 font-semibold">Monthly Price</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="px-6 py-4 font-semibold">
                    {pkg.displayPrice}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default PricingPageContent;
