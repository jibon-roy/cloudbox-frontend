import { baseApi } from "../../api/baseApi";

const fileSystemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyRecentFileSystem: builder.query({
      query: (data) => {
        const params = new URLSearchParams();
        if (data?.queryObj) {
          data?.queryObj.forEach((item: any) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: `filesystem/recent`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["fileSystem", "user"],
    }),
  }),
});

export const { useGetMyRecentFileSystemQuery } = fileSystemApi;
