"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  useGetMyFilesQuery,
  useGetMyFoldersQuery,
  useGetMyStorageQuery,
  useGetMySubscriptionQuery,
} from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentSubscription,
  selectCurrentToken,
} from "@/src/redux/features/auth/authSlice";
import { useState } from "react";
import { X } from "lucide-react";

const baseCardClass =
  "rounded-2xl border border-border-subtle bg-surface p-5 lg:p-6";

const extractArray = (value: unknown): Array<Record<string, unknown>> => {
  if (Array.isArray(value)) return value as Array<Record<string, unknown>>;
  if (
    value &&
    typeof value === "object" &&
    Array.isArray((value as { data?: unknown }).data)
  ) {
    return (value as { data: Array<Record<string, unknown>> }).data;
  }
  return [];
};

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

const numberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const UserOverview = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const persistedSubscription = useAppSelector(selectCurrentSubscription);
  const skip = !accessToken;

  const { data: storageRaw, isLoading: storageLoading } = useGetMyStorageQuery(
    undefined,
    {
      skip,
    },
  );
  const { data: subscriptionRaw, isLoading: subscriptionLoading } =
    useGetMySubscriptionQuery(undefined, { skip });
  const { data: filesRaw, isLoading: filesLoading } = useGetMyFilesQuery(
    {
      page: 1,
      limit: 6,
      sortBy: "createdAt",
      sortOrder: "desc",
      includeShare: true,
      search: "",
      folderId: "",
    },
    { skip },
  );
  const { data: foldersRaw, isLoading: foldersLoading } = useGetMyFoldersQuery(
    {
      page: 1,
      limit: 6,
      sortBy: "createdAt",
      sortOrder: "desc",
      includeShare: true,
      search: "",
      parentId: "",
    },
    { skip },
  );

  const storage = extractObj(storageRaw);
  const subscription = extractObj(subscriptionRaw);
  const files = extractArray(filesRaw).slice(0, 6);
  const folders = extractArray(foldersRaw).slice(0, 6);

  const storageSubscription =
    storage.subscription &&
    typeof storage.subscription === "object" &&
    !Array.isArray(storage.subscription)
      ? (storage.subscription as Record<string, unknown>)
      : {};

  const used = numberValue(
    storageSubscription.used_storage_mb ??
      storage.used_storage_mb ??
      storage.usedStorage ??
      storage.used ??
      0,
  );
  const total = numberValue(
    storageSubscription.max_storage_mb ??
      storage.total_storage_mb ??
      storage.totalStorage ??
      storage.limit ??
      0,
  );
  const filesCount = numberValue(storage.total_files, files.length);
  const foldersCount = numberValue(storage.total_folders, folders.length);

  const usedPercent =
    numberValue(storageSubscription.used_percentage, -1) >= 0
      ? Math.min(100, numberValue(storageSubscription.used_percentage, 0))
      : total > 0
        ? Math.min(100, Math.round((used / total) * 100))
        : 0;

  const subscriptionPayload =
    subscriptionRaw && typeof subscriptionRaw === "object"
      ? ((subscriptionRaw as { data?: unknown }).data ?? subscriptionRaw)
      : null;

  const hasApiSubscription =
    (!!subscriptionPayload &&
      typeof subscriptionPayload === "object" &&
      !Array.isArray(subscriptionPayload) &&
      Object.keys(subscriptionPayload as Record<string, unknown>).length > 0) ||
    Object.keys(storageSubscription).length > 0;
  const hasPersistedSubscription =
    !!persistedSubscription &&
    typeof persistedSubscription === "object" &&
    Object.keys(persistedSubscription as Record<string, unknown>).length > 0;
  const shouldShowSubscriptionStep =
    !subscriptionLoading && !hasApiSubscription && !hasPersistedSubscription;

  const isLoading =
    storageLoading || subscriptionLoading || filesLoading || foldersLoading;

  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
  };

  if (shouldShowSubscriptionStep) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 lg:p-8">
        <p className="text-sm font-semibold text-primary">STEP 1 OF 1</p>
        <h1 className="mt-2 text-2xl font-bold text-app-text lg:text-3xl">
          Select Subscription
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted lg:text-base">
          You don&apos;t have an active subscription yet. Choose a package from
          pricing to continue to your dashboard.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/pricing"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-text-inverse transition-colors hover:bg-primary-strong"
          >
            Next
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-app-text transition-colors hover:bg-surface-soft"
          >
            Cancel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showWelcome && (
        <div className="section-bg-accent relative rounded-2xl border border-border-subtle p-6 lg:p-8">
          <p className="text-sm font-semibold text-accent">USER DASHBOARD</p>
          <h1 className="mt-2 text-2xl font-bold text-app-text lg:text-4xl">
            Welcome to Your CloudBox Workspace
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted lg:text-base">
            Track storage usage, active subscription, recent files, folders, and
            billing activities with a responsive dashboard experience.
          </p>
          <button
            onClick={handleWelcomeClose}
            className="absolute top-4 right-4 cursor-pointer rounded-full border border-border-subtle bg-surface p-2 hover:bg-surface-soft"
          >
            <X className="h-5 w-5 text-app-text" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <motion.div
          whileHover={{ y: -4 }}
          className={`${baseCardClass} border-l-4 border-l-primary`}
        >
          <p className="text-sm text-muted">Storage Used</p>
          <p className="mt-2 text-2xl font-bold text-app-text">
            {used.toLocaleString()} MB
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className={`${baseCardClass} border-l-4 border-l-info`}
        >
          <p className="text-sm text-muted">Storage Limit</p>
          <p className="mt-2 text-2xl font-bold text-app-text">
            {total.toLocaleString()} MB
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className={`${baseCardClass} border-l-4 border-l-purple`}
        >
          <p className="text-sm text-muted">Subscription</p>
          <p className="mt-2 text-2xl font-bold text-app-text">
            {String(
              storageSubscription.packageName ??
                subscription.packageName ??
                subscription.planName ??
                "Free",
            )}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className={`${baseCardClass} border-l-4 border-l-success`}
        >
          <p className="text-sm text-muted">Files / Folders</p>
          <p className="mt-2 text-2xl font-bold text-app-text">
            {filesCount} / {foldersCount}
          </p>
        </motion.div>
      </div>

      <div className={baseCardClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-app-text">
            Storage Capacity
          </h2>
          <span className="text-sm text-muted">{usedPercent}% used</span>
        </div>
        <div className="mt-4 h-3 rounded-full bg-surface-soft">
          <div
            className="h-3 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${usedPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className={baseCardClass}>
          <h2 className="text-lg font-semibold text-app-text">Recent Files</h2>
          <div className="mt-4 space-y-3">
            {files.length === 0 ? (
              <p className="text-sm text-muted">
                {isLoading ? "Loading files..." : "No files found."}
              </p>
            ) : (
              files.map((item, index) => {
                const fileName = String(
                  item.originalName ?? item.name ?? `File ${index + 1}`,
                );
                const fileType = String(
                  item.mimeType ?? item.type ?? "Unknown",
                );

                return (
                  <div
                    key={`${fileName}-${index}`}
                    className="rounded-xl border border-border-subtle bg-surface-soft px-3 py-2"
                  >
                    <p className="truncate text-sm font-medium text-app-text">
                      {fileName}
                    </p>
                    <p className="text-xs text-muted">{fileType}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={baseCardClass}>
          <h2 className="text-lg font-semibold text-app-text">
            Recent Folders
          </h2>
          <div className="mt-4 space-y-3">
            {folders.length === 0 ? (
              <p className="text-sm text-muted">
                {isLoading ? "Loading folders..." : "No folders found."}
              </p>
            ) : (
              folders.map((item, index) => {
                const folderName = String(item.name ?? `Folder ${index + 1}`);
                return (
                  <div
                    key={`${folderName}-${index}`}
                    className="rounded-xl border border-border-subtle bg-surface-soft px-3 py-2"
                  >
                    <p className="truncate text-sm font-medium text-app-text">
                      {folderName}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
