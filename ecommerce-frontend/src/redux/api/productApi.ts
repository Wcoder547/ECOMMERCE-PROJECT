import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AllReviewsResponse,
  categoriesResponse,
  deleteProductRequest,
  DeleteReviewRequest,
  MessageResponse,
  messageResponse,
  newProductRequest,
  NewReviewRequest,
  oneProductResponse,
  productResponse,
  searchProductRequest,
  searchProductResponse,
  updateProductRequest,
} from "../../types/api-types";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`,
  }),
  tagTypes: ["product"],
  endpoints: (builder) => ({
    latestProducts: builder.query<productResponse, string>({
      query: () => "latest",
      providesTags: ["product"],
    }),
    allProducts: builder.query<productResponse, string>({
      query: () => `admin-products`,
      providesTags: ["product"],
    }),
    categories: builder.query<categoriesResponse, string>({
      query: () => `categories`,
      providesTags: ["product"],
    }),
    searchProducts: builder.query<searchProductResponse, searchProductRequest>({
      query: ({ price, search, category, page, sort }) => {
        let base = `all?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (sort) base += `&sort=${sort}`;
        if (category) base += `&category=${category}`;
        return base;
      },
      providesTags: ["product"],
    }),
    ProductDetails: builder.query<oneProductResponse, string>({
      query: (id) => id,
      providesTags: ["product"],
    }),

    allReviewsOfProducts: builder.query<AllReviewsResponse, string>({
      query: (productId) => `reviews/${productId}`,
      providesTags: ["product"],
    }),

    newReview: builder.mutation<MessageResponse, NewReviewRequest>({
      query: ({ comment, rating, productId, userId }) => ({
        url: `review/new/${productId}?id=${userId}`,
        method: "POST",
        body: { comment, rating },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["product"],
    }),

    deleteReview: builder.mutation<MessageResponse, DeleteReviewRequest>({
      query: ({ reviewId, userId }) => ({
        url: `/review/${reviewId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),

    newProduct: builder.mutation<messageResponse, newProductRequest>({
      query: ({ id, formData }) => ({
        url: `new?id=${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    updateProduct: builder.mutation<messageResponse, updateProductRequest>({
      query: ({ userId, productId, formData }) => ({
        url: `${productId}?id=${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["product"],
    }),
    deleteProduct: builder.mutation<messageResponse, deleteProductRequest>({
      query: ({ userId, productId }) => ({
        url: `${productId}?id=${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useLatestProductsQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useNewReviewMutation,
  useAllReviewsOfProductsQuery,
  useDeleteReviewMutation,
} = productApi;
