// baseApi.ts
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react";

/* ----------------------------------------------
 * 🔐 Base Query (Adds Access Token Automatically)
 * ---------------------------------------------- */
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "", // fallback
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const access_token = (getState() as RootState)?.auth?.access_token ?? null;

    headers.set("accept", "application/json");

    if (access_token) {
      headers.set("authorization", `Bearer ${access_token}`);
    }

    return headers;
  },
});

/* ---------------------------------------------------------
 * 🔄 Refresh Token Handler (Auto Refresh + Retry Original)
 * --------------------------------------------------------- */
const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle Unauthorized
  if (result.error?.status === 401) {
    try {
      const state = api.getState() as RootState;
      const refreshToken = state?.auth?.refresh_token ?? null;

      // 🚫 No refresh token? Force logout safely
      if (!refreshToken) {
        api.dispatch(logout());
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again to continue",
        });
        signOut();
        return result;
      }

      // 🌐 Try refreshing token
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const data = await res.json().catch(() => null);

      if (data?.success) {
        const user = state?.auth?.user ?? {};

        // 🎯 Update Redux with new token but keep user intact
        api.dispatch(
          setUser({
            user,
            access_token: data?.data?.accessToken ?? "",
            refresh_token: data?.data?.refreshToken ?? "",
          }),
        );

        // 🔁 Retry original request with fresh token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // ❌ Refresh failed → logout with SweetAlert
        Swal.fire({
          icon: "error",
          title: "Session Expired",
          text: "Please login again to continue",
          showConfirmButton: false,
          showCancelButton: true,
          cancelButtonText: "Stay Logged Out",
        }).then((response) => {
          if (response.isConfirmed || response.isDismissed) {
            api.dispatch(logout());
            signOut();
          }
        });
      }
    } catch (error) {
      console.error("🔥 Error during token refresh:", error);
    }
  }

  return result;
};

/* ----------------------------------------------------
 * 🔧 Types – Completely Safe + Prevents Implicit "any"
 * ---------------------------------------------------- */

// export const apiTags: ApiTagTypes = ["user", "example", "generic"];
/* ----------------------------------------------
 * 🧩 Base API Slice (Dynamic Tag System)
 * ---------------------------------------------- */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["user", "example", "generic"], // typed + safe
  endpoints: () => ({}),
});

export type ApiTagTypes = typeof baseApi.reducerPath extends string
  ? (typeof baseApi)["reducerPath"] extends string
    ? "user" | "example" | "generic"
    : never
  : never;
