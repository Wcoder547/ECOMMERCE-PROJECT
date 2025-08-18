import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  NewCouponResponse,
  AllCouponResponse,
  DiscountResponse,
  PaymentIntentResponse,
} from "../../types/api-types";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  endpoints: (builder) => ({
    // create payment intent
    createPaymentIntent: builder.mutation<PaymentIntentResponse, { amount: number }>({
      query: (body) => ({
        url: "create",
        method: "POST",
        body,
      }),
    }),

    // create new coupon
   newCoupon: builder.mutation<NewCouponResponse, { coupon: string; amount: number }>({
  query: (body) => ({
    url: "coupon/new",
    method: "POST",
    body,
  }),
}),

    // apply discount
    applyDiscount: builder.query<DiscountResponse, { code: string }>({
      query: ({ code }) => `discount?code=${code}`,
      keepUnusedDataFor: 0,
    }),

    // get all coupons
    allCoupon: builder.query<AllCouponResponse, void>({
      query: () => "coupon/all",
      keepUnusedDataFor: 0,
    }),

    // delete coupon
    deleteCoupon: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `coupon/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useNewCouponMutation,
  useApplyDiscountQuery,
  useAllCouponQuery,
  useDeleteCouponMutation,
} = paymentApi;
