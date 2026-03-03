"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";
import {
  selectCurrentUser,
  selectCurrentToken,
} from "@/src/redux/features/auth/authSlice";

interface AuthWrapperProps {
  role?: string | string[];
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthWrapper = ({
  role,
  children,
  redirectTo = "/not-found",
}: AuthWrapperProps) => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const token = useAppSelector(selectCurrentToken);

  useEffect(() => {
    // Check if user is authenticated
    if (!user || !token) {
      router.push("/auth/login");
      return;
    }

    // If role is specified, check authorization
    if (role) {
      const userRole = user?.role?.toLowerCase();
      const allowedRoles = Array.isArray(role)
        ? role.map((r) => r.toLowerCase())
        : [role.toLowerCase()];

      // If user's role doesn't match any allowed role, redirect
      if (!allowedRoles.includes(userRole)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, token, role, router, redirectTo]);

  // Don't render children if not authenticated or not authorized
  if (!user || !token) {
    return null;
  }

  if (role) {
    const userRole = user?.role?.toLowerCase();
    const allowedRoles = Array.isArray(role)
      ? role.map((r) => r.toLowerCase())
      : [role.toLowerCase()];

    if (!allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
};

export default AuthWrapper;
