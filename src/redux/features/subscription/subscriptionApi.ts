import { baseApi } from "../../api/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscription: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data?.queryObj) {
          data?.queryObj.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `subscription`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["subscription", "user"],
    }),
    getSingleSubscription: builder.query({
      query: (id) => ({
        url: `subscription/${id}`,
        method: "GET",
      }),
      providesTags: ["subscription", "user"],
    }),
    buySubscription: builder.mutation({
      query: (id) => {
        return {
          url: `subscription/buy/${id}`,
          method: "POST",
        };
      },
      invalidatesTags: ["subscription", "user"],
    }),
    getCurrentSubscription: builder.query({
      query: () => ({
        url: `subscription/current`,
        method: "GET",
      }),
      providesTags: ["subscription", "user"],
    }),
    confirmPayment: builder.mutation({
      query: (sessionId) => ({
        url: `subscription/confirm-payment`,
        method: "POST",
        body: { session_id: sessionId },
      }),
      invalidatesTags: ["subscription", "user"],
    }),
    getAllSubscriptionsAdmin: builder.query({
      query: () => ({
        url: `subscription/all`,
        method: "GET",
      }),
      providesTags: ["subscription"],
    }),
    createSubscription: builder.mutation({
      query: (data) => ({
        url: `subscription`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subscription"],
    }),
    updateSubscription: builder.mutation({
      query: ({ id, data }) => ({
        url: `subscription/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["subscription"],
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `subscription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subscription"],
    }),
  }),
});

export const {
  useGetAllSubscriptionQuery,
  useGetSingleSubscriptionQuery,
  useBuySubscriptionMutation,
  useGetCurrentSubscriptionQuery,
  useConfirmPaymentMutation,
  useGetAllSubscriptionsAdminQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi;
