import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  allOrdersResponse,
  messageResponse,
  NewOrderRequest,
  orderDetailsResponse,
  updateOrderRequest,
} from "../../types/api-types";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`,
  }),
  tagTypes: ["orders"],
  endpoints: (builder) => ({
    newOrder: builder.mutation<messageResponse, NewOrderRequest>({
      query: (order) => ({
        url: "new",
        method: "POST",
        body: order,
      }),
      invalidatesTags: ["orders"],
    }),
    updateOrder: builder.mutation<messageResponse, updateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "PUT",
      }),
      invalidatesTags: ["orders"],
    }),
    deleteOrder: builder.mutation<messageResponse, updateOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["orders"],
    }),
    myorders: builder.query<allOrdersResponse, string>({
      query: (id) => `mymyorders?id=${id}`,
      providesTags: ["orders"],
    }),
    allorders: builder.query<allOrdersResponse, string>({
      query: (id) => `mymyorders?id=${id}`,
      providesTags: ["orders"],
    }),
    orderDetails: builder.query<orderDetailsResponse, string>({
      query: (id) => id,
      providesTags: ["orders"],
    }),
  }),
});

export const {
  useNewOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyordersQuery,
  useAllordersQuery,
  useOrderDetailsQuery,
} = orderApi;
