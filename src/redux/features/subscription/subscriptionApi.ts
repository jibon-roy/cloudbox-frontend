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
  }),
});

export const { useGetAllSubscriptionQuery, useGetSingleSubscriptionQuery } =
  subscriptionApi;
