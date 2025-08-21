import { cartItem, CouponType, Order,product,products, shippingInfo, User } from "./types";

export type messageResponse = {
  success: boolean;
  message: string;
};
export type customError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type UserResponse = {
  success: boolean;
  user: User;
};
export type latestProduct = {
  success: boolean;
  latestProduct: product[];
};
export type categoriesResponse = {
  success: boolean;
  categories: string[];
};

export type searchProductResponse = latestProduct & {
  totalPage: number;
};
export type searchProductRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type newProductRequest = {
  id: string;
  formData: FormData;
};
export type updateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};
export type deleteProductRequest = {
  userId: string;
  productId: string;
};

export type productResponse = {
  success: boolean;
  products: products[];
};
export type oneProductResponse = {
  success: boolean;
  product: product;
};

export type NewOrderRequest = {
  shippingInfo: shippingInfo;
  orderitems: cartItem[];
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  user: string;
};
export type updateOrderRequest = {
  userId: string;
  orderId: string;
};

export type allOrdersResponse = {
  success: boolean;
  orders: Order[];
};
export type orderDetailsResponse = {
  success: boolean;
  order: Order;
};
export type AllDiscountResponse = {
  success: boolean;
  coupons: CouponType[];
};

export type SingleDiscountResponse = {
  success: boolean;
  coupon: CouponType;
};