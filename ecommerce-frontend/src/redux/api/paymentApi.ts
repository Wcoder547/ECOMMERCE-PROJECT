import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  endpoints: (builder) => ({
    // create payment intent
    createPaymentIntent: builder.mutation({
      query: (body) => ({
        url: "create",
        method: "POST",
        body,
      }),
    }),

    // create new coupon
   newCoupon: builder.mutation({
  query: ({id,body}) => ({
    url: `coupon/new?id=${id}`,
    method: "POST",
    body,
  }),
}),

    // apply discount
    applyDiscount: builder.query({
      query: ({ code }) => `discount?code=${code}`,
      keepUnusedDataFor: 0,
    }),

    // get all coupons
    allCoupon: builder.query({
      query: (id) => `coupon/all?id=${id}`,
      keepUnusedDataFor: 0,
    }),
    //get-coupon
    getCoupon: builder.query({
      query: (id) => `coupon/${id}`,
      keepUnusedDataFor: 0,
    }),

    //update coupon
    updateCoupon: builder.mutation<{
      success: boolean;
      message: string;
    }, { couponId: string; body: any }>({
      query: ({ couponId, body }) => ({
        url: `coupon/${couponId}`,
        method: "PUT",
        body,
      }),
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
  useGetCouponQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = paymentApi;
