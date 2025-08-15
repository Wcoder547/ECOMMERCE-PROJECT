import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { messageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";

type ResType =
  | {
      data: messageResponse;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string
) => {
  if ("data" in res) {
    toast.success(res.data?.message!);
    if (navigate) navigate(url);
  } else {
    const err = res.error as FetchBaseQueryError;
    const message = err.data as messageResponse;
    toast.error(message.message);
  }
};
