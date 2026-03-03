"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  useGetAdminBillingsQuery,
  useChangeBillingStatusMutation,
} from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";
import { CreditCard, Download } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";

interface Billing {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: string | number;
  currency?: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  reference?: string;
  provider?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const BillingAndPayments = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const params = useMemo(() => {
    const queryParams: Record<string, any> = {
      page,
      limit,
    };

    if (dateRange.from) {
      queryParams.from = dateRange.from;
    }
    if (dateRange.to) {
      queryParams.to = dateRange.to;
    }

    return queryParams;
  }, [page, limit, dateRange]);

  const {
    data: billingsRaw,
    isLoading,
    refetch,
  } = useGetAdminBillingsQuery(params, { skip });

  const [changeBillingStatus, { isLoading: isUpdating }] =
    useChangeBillingStatusMutation();

  const billings = useMemo(() => {
    const data: Billing[] = Array.isArray(
      (billingsRaw as { data?: Billing[] })?.data,
    )
      ? (billingsRaw as { data: Billing[] }).data
      : [];
    if (statusFilter === "ALL") return data;
    return data.filter((b) => b.status === statusFilter);
  }, [billingsRaw, statusFilter]);

  const totalPages = useMemo(() => {
    const meta = (billingsRaw as any)?.meta;
    return meta?.totalPages || Math.ceil((billings.length || 0) / limit);
  }, [billingsRaw, billings.length, limit]);

  const stats = useMemo(() => {
    const allBillings: Billing[] = Array.isArray(
      (billingsRaw as { data?: Billing[] })?.data,
    )
      ? (billingsRaw as { data: Billing[] }).data
      : [];
    return {
      total: allBillings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
      paid: allBillings
        .filter((b) => b.status === "SUCCESS")
        .reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
      pending: allBillings
        .filter((b) => b.status === "PENDING")
        .reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
      count: allBillings.length,
    };
  }, [billingsRaw]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const result = await Swal.fire({
      title: "Change Billing Status?",
      text: `Are you sure you want to mark this billing as ${newStatus}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await changeBillingStatus({
        id,
        status: newStatus,
      }).unwrap();
      toast.success("Billing status updated successfully!");
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update billing status");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "FAILED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const exportToCSV = () => {
    try {
      const allBillings: Billing[] = Array.isArray(
        (billingsRaw as { data?: Billing[] })?.data,
      )
        ? (billingsRaw as { data: Billing[] }).data
        : [];

      if (allBillings.length === 0) {
        toast.error("No data to export");
        return;
      }

      // Prepare CSV headers
      const headers = [
        "User Name",
        "User Email",
        "Provider",
        "Amount",
        "Currency",
        "Status",
        "Reference",
        "Date",
      ];

      // Prepare CSV rows
      const rows = allBillings.map((billing) => [
        billing.user?.name || "Unknown",
        billing.user?.email || "N/A",
        billing.provider || "N/A",
        Number(billing.amount || 0).toFixed(2),
        billing.currency || "USD",
        billing.status,
        billing.reference || "N/A",
        formatDate(billing.created_at),
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      const fileName = `billing-report-${new Date().toISOString().split("T")[0]}.csv`;
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${allBillings.length} billing records to CSV`);
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
              Billing & Payments
            </h1>
            <p className="mt-2 text-sm text-muted">
              View and manage all user payments and billing records
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
          <p className="text-sm text-muted">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-app-text">
            ${stats.total.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-emerald-500 border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Paid</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            ${stats.paid.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-yellow-500 border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Pending</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            $
            {stats.pending.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-l-4 border-l-primary border-border-subtle bg-surface p-6"
        >
          <p className="text-sm text-muted">Total Records</p>
          <p className="mt-2 text-2xl font-bold text-primary">
            {stats.count.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-border-subtle bg-surface p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-app-text">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-app-text">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => {
                setDateRange({ ...dateRange, from: e.target.value });
                setPage(1);
              }}
              className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-app-text">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => {
                setDateRange({ ...dateRange, to: e.target.value });
                setPage(1);
              }}
              className="w-full rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-app-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => {
              setStatusFilter("ALL");
              setDateRange({ from: "", to: "" });
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-surface-soft px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-surface-soft/80"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Billings Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
          <div className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-subtle border-t-primary"></div>
          </div>
          <p className="mt-4 text-sm text-muted">Loading billing records...</p>
        </div>
      ) : billings.length === 0 ? (
        <div className="rounded-2xl border border-border-subtle bg-surface p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted" />
          <h3 className="mt-4 text-lg font-semibold text-app-text">
            No billing records found
          </h3>
          <p className="mt-2 text-sm text-muted">
            Try adjusting your filters or date range
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
                    Provider
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-app-text">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {billings?.map((billing) => (
                  <tr
                    key={billing.id}
                    className="border-b border-border-subtle transition-colors hover:bg-surface-soft"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-app-text">
                          {billing.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted">
                          {billing.user?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-app-text">
                        {billing.provider
                          ? billing.provider.charAt(0).toUpperCase() +
                            billing.provider.slice(1)
                          : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-app-text">
                        ${Number(billing.amount || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeColor(billing.status)}`}
                      >
                        {billing.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-muted">
                        {formatDate(billing.created_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={billing.status}
                        onChange={(e) =>
                          handleStatusChange(billing.id, e.target.value)
                        }
                        disabled={isUpdating}
                        className="rounded-lg border border-border-subtle bg-surface-soft px-3 py-1 text-sm text-app-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="FAILED">FAILED</option>
                      </select>
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

export default BillingAndPayments;
