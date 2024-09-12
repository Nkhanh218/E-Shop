import { apiSlice } from "./apiSlice";
import { BANNER_URL } from "../constants";

export const bannerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => BANNER_URL,
      providesTags: ["Banner"],
    }),
    createBanner: builder.mutation({
      query: (newBanner) => ({
        url: BANNER_URL,
        method: "POST",
        body: newBanner,
      }),
      invalidatesTags: ["Banner"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, ...updatedBanner }) => ({
        url: `${BANNER_URL}/${id}`,
        method: "PUT",
        body: updatedBanner,
      }),
      invalidatesTags: ["Banner"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `${BANNER_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = apiSlice;
