export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  dob: string;
  _id: string;
};
export type  product = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photos:{
    public_id: string;
    url: string;
  }[];  
  _id: string;
  ratings: number;
  description: string;
};

export type Review = {
  rating: number;
  comment: string;
  product: string;
  user: {
    name: string;
    photo: string;
    _id: string;
  };
  _id: string;
};

export type products = {
  name: string;
  price: number;
  stock: number;
  category: string;
  photos:{
    public_id: string;
    url: string;
  }[];
  _id: string;
}
export type shippingInfo = {
  address: string;
  city: string;
  province: string;
  country: string;
  pincode: string;
};
export type cartItem = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};
export type orderitems = Omit<cartItem, "stock"> & { _id: string };

export type Order = {
  orderitems: orderitems[];
  shippingInfo: shippingInfo;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  user: {
    name: string;
    _id: string;
  };
  _id: string;
};
export type CouponType = {
  code: string;
  amount: number;
  _id: string;
};