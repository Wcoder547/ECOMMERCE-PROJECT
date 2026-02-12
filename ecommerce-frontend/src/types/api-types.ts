import {
  cartItem,
  CouponType,
  Order,
  product,
  products,
  Review,
  shippingInfo,
  User,
} from "./types";

// Basic Response Types
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

// User Types
export type UserResponse = {
  success: boolean;
  user: User;
};

// Product Types
export type latestProduct = {
  success: boolean;
  products: product[];
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

// Review Types
export type NewReviewRequest = {
  rating: number;
  comment: string;
  userId?: string;
  productId: string;
};

export type DeleteReviewRequest = {
  userId?: string;
  reviewId: string;
};

export type productResponse = {
  success: boolean;
  products: products[];
};

export type oneProductResponse = {
  success: boolean;
  product: product;
};

// Order Types
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

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type updateOrderRequest = {
  userId: string;
  orderId: string;
};

export type allOrdersResponse = {
  success: boolean;
  orders: Order[];
};

export type AllReviewsResponse = {
  success: boolean;
  reviews: Review[];
};

export type orderDetailsResponse = {
  success: boolean;
  order: Order;
};

// Discount/Coupon Types
export type AllDiscountResponse = {
  success: boolean;
  coupons: CouponType[];
};

export type SingleDiscountResponse = {
  success: boolean;
  coupon: CouponType;
};

// Dashboard/Stats Types (ADD THESE TO THE BOTTOM)
export type Stats = {
  categoryCount: Array<{ category: string; count: number }>;
  changePercentage: {
    revenue: number;
    product: number;
    user: number;
    order: number;
  };
  count: {
    revenue: number;
    product: number;
    user: number;
    order: number;
  };
  chart: {
    order: number[];
    revenue: number[];
  };
  userRatio: {
    male: number;
    female: number;
  };
  latestTransactions: Array<{
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
  }>;
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};

export type PieResponse = {
  success: boolean;
  charts: {
    orderFullfillment: {
      processing: number;
      shipped: number;
      delivered: number;
    };
    productCategories: Array<{ category: string; count: number }>;
    stockAvailability: {
      inStock: number;
      outOfStock: number;
    };
    revenueDistribution: {
      netMargin: number;
      discount: number;
      productionCost: number;
      burnt: number;
      marketingCost: number;
    };
    usersAgeGroup: {
      teen: number;
      adult: number;
      old: number;
    };
    adminCustomer: {
      admin: number;
      customer: number;
    };
  };
};

export type BarResponse = {
  success: boolean;
  charts: {
    users: number[];
    products: number[];
    orders: number[];
  };
};

export type LineResponse = {
  success: boolean;
  charts: {
    users: number[];
    products: number[];
    discount: number[];
    revenue: number[];
  };
};
