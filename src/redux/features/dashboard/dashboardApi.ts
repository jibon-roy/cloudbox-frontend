import { baseApi } from "../../api/baseApi";

type QueryParams = Record<string, string | number | boolean | undefined>;

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSummary: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "admin/summary",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic"],
    }),
    getWeeklyTraffic: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "admin/traffic/weekly",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic"],
    }),
    getAdminBillings: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "billing",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic"],
    }),
    getActiveSubscriptions: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "billing/subscriptions/active",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic"],
    }),
    getUsersAdmin: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "user",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic", "user"],
    }),
    getMyStorage: builder.query<unknown, void>({
      query: () => ({
        url: "storage/me",
        method: "GET",
      }),
      providesTags: ["generic"],
    }),
    getMySubscription: builder.query<unknown, void>({
      query: () => ({
        url: "subscription/me",
        method: "GET",
      }),
      providesTags: ["generic"],
    }),
    getMyBillings: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "billing/my",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic"],
    }),
    getMyFiles: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "files",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic"],
    }),
    getMyFolders: builder.query<unknown, QueryParams | void>({
      query: (params) => ({
        url: "folders",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["generic"],
    }),
  }),
});

export const {
  useGetAdminSummaryQuery,
  useGetWeeklyTrafficQuery,
  useGetAdminBillingsQuery,
  useGetActiveSubscriptionsQuery,
  useGetUsersAdminQuery,
  useGetMyStorageQuery,
  useGetMySubscriptionQuery,
  useGetMyBillingsQuery,
  useGetMyFilesQuery,
  useGetMyFoldersQuery,
} = dashboardApi;
