"use client";

import { motion } from "framer-motion";
import { useGetMyBillingsQuery } from "@/src/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/src/redux/hooks";
import { selectCurrentToken } from "@/src/redux/features/auth/authSlice";
import { useState } from "react";

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
  if (
    value &&
    typeof value === "object" &&
    (value as { data?: unknown }).data &&
    typeof (value as { data?: unknown }).data === "object" &&
    Array.isArray(
      ((value as { data?: { items?: unknown } }).data as { items?: unknown })
        ?.items,
    )
  ) {
    return (
      (
        (value as { data?: { items?: Array<Record<string, unknown>> } })
          .data as {
          items?: Array<Record<string, unknown>>;
        }
      )?.items ?? []
    );
  }
  return [];
};

const extractTotal = (value: unknown, fallback = 0) => {
  if (value && typeof value === "object") {
    const cast = value as {
      total?: unknown;
      data?: { total?: unknown };
    };

    if (typeof cast.total === "number") return cast.total;
    if (cast.data && typeof cast.data.total === "number")
      return cast.data.total;
  }
  return fallback;
};

const numberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
};

const BillingHistoryPage = () => {
  const accessToken = useAppSelector(selectCurrentToken);
  const skip = !accessToken;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: billingsRaw, isLoading: billingsLoading } =
    useGetMyBillingsQuery({ page: currentPage, limit: itemsPerPage }, { skip });

  const billings = extractArray(billingsRaw);
  const totalItems = extractTotal(billingsRaw, billings.length);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-bg-primary rounded-2xl border border-border-subtle p-6 lg:p-8"
      >
        <p className="text-sm font-semibold text-primary">BILLING</p>
        <h1 className="mt-2 text-2xl font-bold text-app-text lg:text-4xl">
          Billing History
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted lg:text-base">
          View all your past transactions, invoices, and payment activities.
        </p>
      </motion.div>

      <div className={baseCardClass}>
        <h2 className="text-lg font-semibold text-app-text">
          Transaction History
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-muted">
                <th className="pb-2 pr-3">Reference</th>
                <th className="pb-2 pr-3">Amount</th>
                <th className="pb-2 pr-3">Status</th>
                <th className="pb-2 pr-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {billings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-muted">
                    {billingsLoading
                      ? "Loading billing history..."
                      : "No billing history found."}
                  </td>
                </tr>
              ) : (
                billings.map((item, index) => {
                  const reference = String(
                    item.reference ?? item.id ?? `BILL-${index + 1}`,
                  );
                  const amount = numberValue(item.amount ?? item.total ?? 0);
                  const status = String(item.status ?? "pending");
                  const normalizedStatus = status.toLowerCase();
                  const date =
                    item.paid_at ||
                    item.created_at ||
                    item.createdAt ||
                    item.date;
                  const formattedDate = date
                    ? new Date(String(date)).toLocaleDateString()
                    : "N/A";

                  return (
                    <tr
                      key={`${reference}-${index}`}
                      className="border-b border-border-subtle/60"
                    >
                      <td className="py-3 pr-3 text-app-text">{reference}</td>
                      <td className="py-3 pr-3 text-app-text">
                        ${amount.toLocaleString()}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            normalizedStatus === "completed" ||
                            normalizedStatus === "success"
                              ? "bg-success/10 text-success"
                              : normalizedStatus === "pending"
                                ? "bg-warning/10 text-warning"
                                : "bg-error/10 text-error"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-muted">{formattedDate}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-border-subtle bg-surface px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingHistoryPage;
