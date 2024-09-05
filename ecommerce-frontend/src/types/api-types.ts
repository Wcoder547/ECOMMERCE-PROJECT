import { cartItem, Order, Product, shippingInfo, User } from "./types";

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
export type productResponse = {
  success: boolean;
  products: Product[];
};
export type categoriesResponse = {
  success: boolean;
  categories: string[];
};

export type searchProductResponse = productResponse & {
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

export type oneProductResponse = {
  success: boolean;
  product: Product;
};

export type NewOrderRequest = {
  shippingInfo: shippingInfo;
  orderItems: cartItem[];
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
