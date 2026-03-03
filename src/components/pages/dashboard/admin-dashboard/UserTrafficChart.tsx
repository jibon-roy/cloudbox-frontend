"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { useGetUserTrafficQuery } from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";

type TrafficPeriod = "weekly" | "monthly" | "yearly";

interface TrafficData {
  weekly: Array<{ date: string; registeredUsers: number }>;
  monthly: Array<{ week: string; registeredUsers: number }>;
  yearly: Array<{ month: string; registeredUsers: number }>;
}

const UserTrafficChart = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const [period, setPeriod] = useState<TrafficPeriod>("weekly");

  const { data: trafficRaw, isLoading } = useGetUserTrafficQuery(undefined, {
    skip,
  });

  const trafficData = (trafficRaw as { data?: TrafficData } | undefined)
    ?.data || {
    weekly: [],
    monthly: [],
    yearly: [],
  };

  const getChartData = () => {
    switch (period) {
      case "weekly":
        return trafficData.weekly.map((item) => ({
          name: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          registeredUsers: item.registeredUsers,
          fullDate: item.date,
        }));
      case "monthly":
        return trafficData.monthly.map((item, index) => ({
          name: `Week ${index + 1}`,
          registeredUsers: item.registeredUsers,
          range: item.week,
        }));
      case "yearly":
        return trafficData.yearly.map((item) => ({
          name: new Date(item.month + "-01").toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          registeredUsers: item.registeredUsers,
          month: item.month,
        }));
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map((d) => d.registeredUsers || 0), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border-subtle bg-surface p-6 lg:p-8"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-app-text">User Traffic</h2>
          <p className="mt-1 text-sm text-muted">Registered users over time</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(["weekly", "monthly", "yearly"] as const).map((p) => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                period === p
                  ? "bg-primary text-primary-foreground text-white"
                  : "bg-surface-soft text-muted hover:bg-surface-soft/80"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        key={period}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-muted">Loading chart data...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-muted">No data available for this period</p>
          </div>
        ) : (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {period === "yearly" ? (
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#8884d8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#8884d8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="registeredUsers"
                    fill="#3b82f6"
                    name="Registered Users"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff10"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#8884d8"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#8884d8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="registeredUsers"
                    stroke="#3b82f6"
                    name="Registered Users"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: chartData.reduce((acc, d) => acc + d.registeredUsers, 0),
          },
          {
            label: "Highest Peak",
            value: maxValue,
          },
          {
            label: "Average",
            value: Math.round(
              chartData.reduce((acc, d) => acc + d.registeredUsers, 0) /
                chartData.length,
            ),
          },
          {
            label: "Data Points",
            value: chartData.length,
          },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2 }}
            className="rounded-lg border border-border-subtle bg-surface-soft p-3"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-1 text-lg font-bold text-app-text">
              {stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default UserTrafficChart;
