"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  useGetUsersAdminQuery,
  useDeactivateUserMutation,
} from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";
import { Users, Download, Search, Lock } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

const ManageUsers = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const params = useMemo(() => {
    return {
      page,
      limit,
      search,
      sortBy,
      sortOrder,
    };
  }, [page, limit, search, sortBy, sortOrder]);

  const {
    data: usersRaw,
    isLoading,
    refetch,
  } = useGetUsersAdminQuery(params, { skip });

  const [deactivateUser, { isLoading: isDeactivating }] =
    useDeactivateUserMutation();

  const users: User[] = useMemo(() => {
    const data = Array.isArray((usersRaw as { data?: User[] })?.data)
      ? (usersRaw as { data: User[] }).data
      : [];
    return data;
  }, [usersRaw]);

  const totalPages = useMemo(() => {
    const meta = (usersRaw as any)?.meta;
    return meta?.totalPages || Math.ceil((users.length || 0) / limit);
  }, [usersRaw, users.length, limit]);

  const stats = useMemo(() => {
    const allUsers: User[] = Array.isArray(
      (usersRaw as { data?: User[] })?.data,
    )
      ? (usersRaw as { data: User[] }).data
      : [];
    return {
      total: allUsers.length,
      admins: allUsers.filter((u) => u.role === "ADMIN").length,
      users: allUsers.filter((u) => u.role === "USER").length,
      active: allUsers.filter((u) => u.is_active !== false).length,
    };
  }, [usersRaw]);

  const handleDeactivateUser = async (userId: string, userName: string) => {
    const result = await Swal.fire({
      title: "Deactivate User?",
      text: `Are you sure you want to deactivate "${userName}"? They won't be able to access their account.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, deactivate!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await deactivateUser(userId).unwrap();
      toast.success("User deactivated successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to deactivate user");
    }
  };

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

  const getRoleBadgeColor = (role: string) => {
    return role === "ADMIN"
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
  };

  const getStatusBadgeColor = (isActive: boolean | undefined) => {
    const active = isActive !== false;
    return active
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  };

  const exportToCSV = () => {
    try {
      const allUsers: User[] = Array.isArray(
        (usersRaw as { data?: User[] })?.data,
      )
        ? (usersRaw as { data: User[] }).data
        : [];

      if (allUsers.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = ["Name", "Email", "Role", "Status", "Created Date"];

      const rows = allUsers.map((user) => [
        user.name || "Unknown",
        user.email || "N/A",
        user.role,
        user.is_active !== false ? "Active" : "Inactive",
        formatDate(user.created_at),
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

      const fileName = `users-report-${new Date().toISOString().split("T")[0]}.csv`;
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${allUsers.length} users to CSV`);
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
              Manage Users
            </h1>
            <p className="mt-2 text-sm text-muted">
              View and manage all platform users
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
          <p className="text-sm text-muted">Total Users</p>
          <p className="mt-2 text-2xl font-bold text-app-text">
            {stats.total.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-purple-500 border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Admins</p>
          <p className="mt-2 text-2xl font-bold text-purple-600">
            {stats.admins.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-blue-500 border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Regular Users</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {stats.users.toLocaleString()}
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
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-app-text">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-border-subtle bg-surface-soft pl-10 pr-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-app-text">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-app-text">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
          <button
            onClick={() => {
              setSearch("");
              setSortBy("createdAt");
              setSortOrder("desc");
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-surface-soft/80"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-subtle border-t-primary"></div>
          </div>
          <p className="mt-4 text-sm text-muted">Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-semibold text-app-text">
            No users found
          </h3>
          <p className="mt-2 text-sm text-muted">
            Try adjusting your search filters
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
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border-subtle transition-colors hover:bg-surface-soft"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-app-text">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(user.is_active)}`}
                      >
                        {user.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">
                        {formatDate(user.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active !== false && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleDeactivateUser(user.id, user.name)
                          }
                          disabled={isDeactivating || user?.role === "ADMIN"}
                          className="flex items-center gap-2 rounded-lg border border-red-500 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 disabled:opacity-50"
                        >
                          <Lock className="h-3 w-3" />
                          Deactivate
                        </motion.button>
                      )}
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

export default ManageUsers;
