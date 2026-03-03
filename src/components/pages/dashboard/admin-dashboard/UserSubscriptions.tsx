"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useGetActiveSubscriptionsQuery } from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";
import { Package, Download } from "lucide-react";
import { toast } from "sonner";

interface UserSubscription {
  id: string;
  userId: string;
  packageId: string;
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  package?: {
    id: string;
    name: string;
    price: string | number;
  };
}

const UserSubscriptions = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const params = useMemo(() => {
    return {
      page,
      limit,
    };
  }, [page, limit]);

  const { data: subscriptionsRaw, isLoading } = useGetActiveSubscriptionsQuery(
    params,
    { skip },
  );

  const subscriptions: UserSubscription[] = useMemo(() => {
    const data = Array.isArray(
      (subscriptionsRaw as { data?: UserSubscription[] })?.data,
    )
      ? (subscriptionsRaw as { data: UserSubscription[] }).data
      : [];
    return data;
  }, [subscriptionsRaw]);

  const totalPages = useMemo(() => {
    const meta = (subscriptionsRaw as any)?.meta;
    const apiPages = Number(meta?.totalPage ?? meta?.totalPages ?? 0);
    if (apiPages > 0) return Math.ceil(apiPages);
    return Math.max(1, Math.ceil((subscriptions.length || 0) / limit));
  }, [subscriptionsRaw, subscriptions.length, limit]);

  const getSubscriptionStatus = (sub: UserSubscription) => {
    if (sub.is_active) return "ACTIVE";
    if (sub.ended_at) return "EXPIRED";
    return "INACTIVE";
  };

  const stats = useMemo(() => {
    const allSubscriptions: UserSubscription[] = Array.isArray(
      (subscriptionsRaw as { data?: UserSubscription[] })?.data,
    )
      ? (subscriptionsRaw as { data: UserSubscription[] }).data
      : [];
    return {
      total: allSubscriptions.length,
      active: allSubscriptions.filter((s) => s.is_active).length,
      expired: allSubscriptions.filter((s) => !s.is_active && !!s.ended_at)
        .length,
      cancelled: allSubscriptions.filter((s) => !s.is_active && !s.ended_at)
        .length,
    };
  }, [subscriptionsRaw]);

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "EXPIRED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      case "INACTIVE":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const exportToCSV = () => {
    try {
      const allSubscriptions: UserSubscription[] = Array.isArray(
        (subscriptionsRaw as { data?: UserSubscription[] })?.data,
      )
        ? (subscriptionsRaw as { data: UserSubscription[] }).data
        : [];

      if (allSubscriptions.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = [
        "User Name",
        "User Email",
        "Subscription",
        "Price",
        "Status",
        "Start Date",
        "End Date",
      ];

      const rows = allSubscriptions.map((sub) => [
        sub.user?.name || "Unknown",
        sub.user?.email || "N/A",
        sub.package?.name || "N/A",
        `$${Number(sub.package?.price || 0).toFixed(2)}`,
        getSubscriptionStatus(sub),
        formatDate(sub.started_at),
        formatDate(sub.ended_at || undefined),
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/\"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      const fileName = `user-subscriptions-${new Date().toISOString().split("T")[0]}.csv`;
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${allSubscriptions.length} subscriptions to CSV`);
    } catch (error) {
      toast.error("Failed to export report");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 lg:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-app-text lg:text-3xl">
              User Subscriptions
            </h1>
            <p className="mt-2 text-sm text-muted">
              View all active and inactive user subscriptions
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportToCSV}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Export Report
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Total Subscriptions</p>
          <p className="mt-2 text-2xl font-bold text-app-text">
            {stats.total.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-emerald-500 border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Active</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {stats.active.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-red-500 border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Expired</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {stats.expired.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-gray-500 border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Inactive</p>
          <p className="mt-2 text-2xl font-bold text-gray-600">
            {stats.cancelled.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Subscriptions Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-subtle border-t-primary"></div>
          </div>
          <p className="mt-4 text-sm text-muted">Loading subscriptions...</p>
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-semibold text-app-text">
            No user subscriptions found
          </h3>
          <p className="mt-2 text-sm text-muted">
            No active subscriptions at the moment
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Subscription
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-border-subtle transition-colors hover:bg-surface-soft"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-app-text">
                          {sub.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted">
                          {sub.user?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-app-text">
                        {sub.package?.name || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-app-text">
                        ${Number(sub.package?.price || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(getSubscriptionStatus(sub))}`}
                      >
                        {getSubscriptionStatus(sub)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">
                        {formatDate(sub.started_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">
                        {formatDate(sub.ended_at || undefined)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between rounded-2xl border border-border-subtle bg-surface p-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted">Items per page:</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                  setPage(1);
                }}
                className="rounded border border-border-subtle bg-surface-soft px-2 py-1 text-sm text-app-text"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border-subtle px-3 py-1 text-sm text-app-text transition-colors disabled:opacity-50 hover:bg-surface-soft"
              >
                Previous
              </button>
              <span className="text-sm text-muted">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-border-subtle px-3 py-1 text-sm text-app-text transition-colors disabled:opacity-50 hover:bg-surface-soft"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserSubscriptions;
