"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import AdminOverview from "../dashboard/admin-dashboard/AdminOverview";
import UserOverview from "../dashboard/user-dashboard/UserOverview";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentToken,
  selectCurrentUser,
} from "@/src/redux/features/auth/authSlice";
import { decodeUserFromToken } from "@/src/lib/helpers/decodeToken";

const SwitchDashboardLayout = () => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const accessToken = useAppSelector(selectCurrentToken);

  const userRole = useMemo(() => {
    const roleFromUser =
      user?.role ?? user?.user?.role ?? user?.data?.role ?? null;

    if (roleFromUser === "ADMIN" || roleFromUser === "USER") {
      return roleFromUser;
    }

    const decoded = decodeUserFromToken<{ role?: string; roles?: string[] }>(
      accessToken,
    );

    const roleFromToken =
      decoded?.role ??
      (Array.isArray(decoded?.roles) && decoded.roles.length > 0
        ? decoded.roles[0]
        : null);

    if (roleFromToken === "ADMIN") {
      return "ADMIN" as const;
    }

    return "USER" as const;
  }, [accessToken, user]);

  useEffect(() => {
    if (!accessToken) {
      router.push("/auth/login");
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <div className="rounded-2xl border border-border-subtle bg-surface p-6 text-sm text-muted">
        Redirecting to login...
      </div>
    );
  }

  if (userRole === "USER") {
    return <UserOverview />;
  }

  return <AdminOverview />;
};

export default SwitchDashboardLayout;
