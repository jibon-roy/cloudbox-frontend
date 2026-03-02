import { baseApi } from "../../api/baseApi";

const fileSystemApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Files
    uploadFiles: builder.mutation({
      query: (formData) => ({
        url: "files",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["fileSystem", "files"],
    }),
    getFiles: builder.query({
      query: (params) => ({
        url: "files",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["fileSystem", "files"],
    }),
    getFile: builder.query({
      query: (id) => ({
        url: `files/${id}`,
        method: "GET",
      }),
      providesTags: ["fileSystem", "files"],
    }),
    deleteFile: builder.mutation({
      query: (id) => ({
        url: `files/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["fileSystem", "files"],
    }),
    moveFile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `files/${id}/move`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["fileSystem", "files"],
    }),
    copyFile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `files/${id}/copy`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["fileSystem", "files"],
    }),
    replaceFile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `files/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["fileSystem", "files"],
    }),

    // Folders
    createFolder: builder.mutation({
      query: (body) => ({
        url: "folders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["fileSystem", "folders"],
    }),
    getFolders: builder.query({
      query: (params) => ({
        url: "folders",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["fileSystem", "folders"],
    }),
    getFolder: builder.query({
      query: (id) => ({
        url: `folders/${id}`,
        method: "GET",
      }),
      providesTags: ["fileSystem", "folders"],
    }),
    deleteFolder: builder.mutation({
      query: (id) => ({
        url: `folders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["fileSystem", "folders"],
    }),
    moveFolder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `folders/${id}/move`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["fileSystem", "folders"],
    }),
    copyFolder: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `folders/${id}/copy`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["fileSystem", "folders"],
    }),

    // File System
    getFileSystemTree: builder.query({
      query: (params) => ({
        url: "filesystem",
        method: "GET",
        params: params ?? undefined,
      }),
      providesTags: ["fileSystem"],
    }),
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

export const {
  useUploadFilesMutation,
  useGetFilesQuery,
  useGetFileQuery,
  useDeleteFileMutation,
  useMoveFileMutation,
  useCopyFileMutation,
  useReplaceFileMutation,
  useCreateFolderMutation,
  useGetFoldersQuery,
  useGetFolderQuery,
  useDeleteFolderMutation,
  useMoveFolderMutation,
  useCopyFolderMutation,
  useGetFileSystemTreeQuery,
  useGetMyRecentFileSystemQuery,
} = fileSystemApi;
