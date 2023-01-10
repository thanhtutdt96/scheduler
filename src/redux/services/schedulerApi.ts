import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TimeItem } from 'types/Calendar';
import { SchedulerApiTagType } from 'types/Common';

const API_PATH = import.meta.env.VITE_API_PATH;

export const schedulerApi = createApi({
  reducerPath: 'schedulerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_PATH,
  }),
  tagTypes: [
    SchedulerApiTagType.WORKING,
    SchedulerApiTagType.SCHEDULED,
    SchedulerApiTagType.AVAILABLE,
  ],
  endpoints: (builder) => ({
    getWorkingTimes: builder.query<Record<string, TimeItem>, void>({
      query: () => '/working',
      providesTags: [SchedulerApiTagType.WORKING],
    }),
    getScheduledItems: builder.query<Record<string, TimeItem[]>, void>({
      query: () => '/scheduled',
      providesTags: [SchedulerApiTagType.SCHEDULED],
    }),
    getAvailableItems: builder.query<Record<string, TimeItem[]>, void>({
      query: () => '/available',
      providesTags: [SchedulerApiTagType.AVAILABLE],
    }),
    createAvailableItem: builder.mutation<Record<string, TimeItem[]>, Record<string, TimeItem[]>>({
      query(item) {
        return {
          url: '/available',
          method: 'POST',
          body: item,
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
      invalidatesTags: [SchedulerApiTagType.AVAILABLE],
    }),
  }),
});

export const {
  useGetWorkingTimesQuery,
  useGetAvailableItemsQuery,
  useGetScheduledItemsQuery,
  useCreateAvailableItemMutation,
} = schedulerApi;
