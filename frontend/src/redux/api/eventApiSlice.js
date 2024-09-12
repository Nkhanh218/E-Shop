import { DELETEIMG_URL, EVENT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => `${EVENT_URL}`, // Đảm bảo URL đúng
    }),
    getEventById: builder.query({
      query: (id) => `${EVENT_URL}/${id}`,
    }),
    uploadEventImage: builder.mutation({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
    }),
    createEvent: builder.mutation({
      query: (newEvent) => ({
        url: `${EVENT_URL}`,
        method: "POST",
        body: newEvent,
      }),
    }),
    updateEvent: builder.mutation({
      query: ({ id, updatedEvent }) => ({
        url: `${EVENT_URL}/${id}`,
        method: "PUT",
        body: updatedEvent,
      }),
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `${EVENT_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    deleteimageclould: builder.mutation({
      query: (current_url) => ({
        url: `${DELETEIMG_URL}`,
        method: "POST",
        body: { current_url },
      }),
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useUploadEventImageMutation,
  useDeleteimageclouldMutation,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApiSlice;
