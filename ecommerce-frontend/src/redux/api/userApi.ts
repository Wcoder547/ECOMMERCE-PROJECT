import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { messageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";

// Define missing types here (or import from api-types)
export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export type AllUsersResponse = {
  success: boolean;
  users: User[];
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    login: builder.mutation<messageResponse, User>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),

    deleteUser: builder.mutation<messageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),

    allUsers: builder.query<AllUsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string): Promise<UserResponse> => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching user:",
        error.response?.data || error.message,
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
    throw error;
  }
};

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } =
  userApi;
