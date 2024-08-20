import mongoose from "mongoose";
import { invalidateCacheProps, orderitemsType } from "../types/types.js";
import { nodeCache } from "../app.js";
import { Prodcut } from "../models/product.model.js";
import { DB_NAME } from "./constant.js";

mongoose.set("strictQuery", true); //The warning is just a heads-up about the upcoming change in Mongoose 7. By setting strictQuery explicitly now, you can control whether you want to use the strict or non-strict query mode, avoiding any surprises when you eventually upgrade to Mongoose 7

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n MONGODB CONNECTD !! HOST DB:${connectionInstance.connection.host}`
    ),
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true };
  } catch (error) {
    console.log("MONGO DB CONNECTION Error:", error);
    process.exit(1);
  }
};

export default connectDb;

export const invalidateCache = async ({
  product,
  order,
  admin,
  userId,
  orderId,
  productId,
}: invalidateCacheProps) => {
  if (product) {
    const productKeys: string[] = [
      "latest-product",
      "categories",
      "admin-products",
    ];

    if (typeof productId === "string") {
      return productKeys.push(`product-${productId}`);
    }
    if (typeof productId === "object") {
      return productKeys.forEach((i) => productKeys.push(`product-${i}`));
      // console.log("hello this is in block");
    }
    //product-${id}

    nodeCache.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    nodeCache.del(orderKeys);
  }
};

export const reduceStock = async (orderitems: orderitemsType[]) => {
  for (let i = 0; i < orderitems.length; i++) {
    const order = orderitems[i];
    const product = await Prodcut.findById(order.productId);
    if (!product) {
      throw new Error("product not found!!");
    }
    product.stock -= order.quantiy;
    await product.save();
  }
};
