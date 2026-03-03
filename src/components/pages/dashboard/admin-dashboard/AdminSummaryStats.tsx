"use client";

import { motion } from "framer-motion";
import { useGetAdminSummaryQuery } from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";
import { TrendingUp, Users, CreditCard, DollarSign } from "lucide-react";

interface SummaryStats {
  totalUsers: number;
  totalTransactions: number;
  totalSubscribers: number;
  totalIncome: number;
}

const AdminSummaryStats = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const { data: summaryRaw, isLoading } = useGetAdminSummaryQuery(
    undefined,
    { skip }
  );

  const stats = (summaryRaw as { data?: SummaryStats } | undefined)?.data || {
    totalUsers: 0,
    totalTransactions: 0,
    totalSubscribers: 0,
    totalIncome: 0,
  };

  const statItems = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Total Transactions",
      value: stats.totalTransactions,
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      label: "Total Subscribers",
      value: stats.totalSubscribers,
      icon: CreditCard,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Total Income",
      value: `$${stats.totalIncome.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: DollarSign,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl bg-surface-soft"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted">{item.label}</p>
                <p className="mt-3 text-2xl font-bold text-app-text">
                  {typeof item.value === "string"
                    ? item.value
                    : item.value.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-lg ${item.bgColor} p-3`}>
                <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            <div className="mt-4 h-1 w-full rounded-full bg-surface-soft">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: index * 0.1 }}
                 className={`h-1 rounded-full ${item.color}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AdminSummaryStats;
