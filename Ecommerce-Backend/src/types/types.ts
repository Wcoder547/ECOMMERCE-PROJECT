import exp from "constants";
import { NextFunction, Request, Response } from "express";

export interface newRequestBody {
  name: string;
  email: string;
  gender: string;
  photo: string;
  dob: Date;
  _id: string;
}
export interface newProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export type controllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type searchRequestQuery = {
  sort?: string;
  price?: string;
  category?: string;
  search?: string;
  page?: string;
};

export interface baseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lt: number;
  };
  category?: string;
}

export type invalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
  productId?: string | string[];
};

export type shippingType = {
  address: string;
  city: string;
  province: string;
  countery: string;
  pincode: number;
};
export type orderitemsType = {
  name: string;
  photo: string;
  price: number;
  quantiy: number;
  productId: string;
};

export interface newOrderRequestBody {
  shippingInfo: shippingType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderitems: orderitemsType[];
}
