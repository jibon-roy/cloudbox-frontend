"use client";

import { motion } from "framer-motion";
import {
  useGetAdminBillingsQuery,
  useGetAdminSummaryQuery,
  useGetUsersAdminQuery,
} from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";
import UserTrafficChart from "./UserTrafficChart";

const cardClasses =
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

const extractNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const AdminOverview = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const { data: summaryRaw, isLoading: summaryLoading } =
    useGetAdminSummaryQuery(undefined, { skip });
  const { data: usersRaw, isLoading: usersLoading } = useGetUsersAdminQuery(
    { page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc", search: "" },
    { skip },
  );
  const { data: billingsRaw, isLoading: billingsLoading } =
    useGetAdminBillingsQuery({ page: 1, limit: 6 }, { skip });

  const summary =
    (summaryRaw as { data?: Record<string, unknown> } | undefined)?.data ??
    (summaryRaw as Record<string, unknown> | undefined) ??
    {};

  const totalUsers = extractNumber(
    summary.totalUsers ?? summary.users ?? summary.userCount,
    extractArray(usersRaw).length,
  );
  const totalTransactions = extractNumber(
    summary.totalTransactions ??
      summary.transactions ??
      summary.transactionCount,
    0,
  );
  const totalSubscribers = extractNumber(
    summary.totalSubscribers ??
      summary.activeSubscriptions ??
      summary.subscriptionCount,
    0,
  );
  const totalIncome = extractNumber(
    summary.totalIncome ??
      summary.totalRevenue ??
      summary.revenue ??
      summary.totalAmount,
    0,
  );

  const recentUsers = extractArray(usersRaw).slice(0, 5);
  const recentBillings = extractArray(billingsRaw).slice(0, 6);

  const isLoading = summaryLoading || usersLoading || billingsLoading;

  return (
    <div className="space-y-6">
      <div className="section-bg-primary rounded-2xl border border-border-subtle p-6 lg:p-8">
        <p className="text-sm font-semibold text-primary">ADMIN DASHBOARD</p>
        <h1 className="mt-2 text-2xl font-bold text-app-text lg:text-4xl">
          CloudBox Platform Overview
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted lg:text-base">
          Monitor users, subscriptions, billing and traffic in one place. All
          data comes from your backend endpoints defined in the Postman
          collection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Income",
            value: `$${totalIncome.toLocaleString()}`,
            accent: "border-l-success",
          },
          {
            label: "Total Users",
            value: totalUsers.toLocaleString(),
            accent: "border-l-primary",
          },
          {
            label: "Total Transactions",
            value: totalTransactions.toLocaleString(),
            accent: "border-l-info",
          },
          {
            label: "Total Subscribers",
            value: totalSubscribers.toLocaleString(),
            accent: "border-l-purple",
          },
        ].map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -4 }}
            className={`${cardClasses} border-l-4 ${item.accent}`}
          >
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-app-text">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <UserTrafficChart />

      {/* <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className={`${cardClasses} xl:col-span-1`}>
          <h2 className="text-lg font-semibold text-app-text">Recent Users</h2>
          <div className="mt-4 space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted">
                {isLoading ? "Loading users..." : "No users found."}
              </p>
            ) : (
              recentUsers.map((item, index) => {
                const name =
                  String(
                    item.name ?? item.fullName ?? item.email ?? "Unknown User",
                  ) || "Unknown User";
                const role = String(item.role ?? "USER");
                return (
                  <div
                    key={`${name}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-soft px-3 py-2"
                  >
                    <p className="truncate text-sm text-app-text">{name}</p>
                    <span className="rounded-full bg-surface px-2 py-1 text-xs text-muted">
                      {role}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className={cardClasses}>
        <h2 className="text-lg font-semibold text-app-text">Recent Billings</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-muted">
                <th className="pb-2 pr-3">Reference</th>
                <th className="pb-2 pr-3">User</th>
                <th className="pb-2 pr-3">Amount</th>
                <th className="pb-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBillings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-muted">
                    {isLoading
                      ? "Loading billings..."
                      : "No billing records found."}
                  </td>
                </tr>
              ) : (
                recentBillings.map((item, index) => {
                  const ref = String(
                    item.reference ?? item.id ?? `INV-${index + 1}`,
                  );
                  const userName = String(
                    item.userEmail ?? item.userName ?? item.email ?? "Unknown",
                  );
                  const amount = extractNumber(item.amount ?? item.total ?? 0);
                  const status = String(item.status ?? "pending");

                  return (
                    <tr
                      key={`${ref}-${index}`}
                      className="border-b border-border-subtle/60"
                    >
                      <td className="py-3 pr-3 text-app-text">{ref}</td>
                      <td className="py-3 pr-3 text-muted">{userName}</td>
                      <td className="py-3 pr-3 text-app-text">
                        ${amount.toLocaleString()}
                      </td>
                      <td className="py-3 pr-3">
                        <span className="rounded-full bg-surface-soft px-2 py-1 text-xs text-app-text">
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default AdminOverview;
