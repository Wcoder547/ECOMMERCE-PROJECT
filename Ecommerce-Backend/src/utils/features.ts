import mongoose from "mongoose";
import { Document } from "mongoose";
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

export const invalidateCache = ({
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
  if (admin) {
    nodeCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
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

export const calCulatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return percent.toFixed(0);
};

export const getInventeries = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromsie = categories.map((category) =>
    Prodcut.countDocuments({ category })
  );

  const categoriesCount = await Promise.all(categoriesCountPromsie);

  const categoryCount: Record<string, number>[] = [];
  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriesCount[i] / productsCount) * 100),
    });
  });
  return categoriesCount;
};
interface MyDocument extends Document {
  createdAt: Date;
  discount?: number;
  total?: number;
}

type funcProps = {
  length: number;
  docArr: MyDocument[];
  today: Date;
  property?: "discount" | "total";
};

export const getChartData = ({
  length,
  docArr,
  today,
  property,
}: funcProps): number[] => {
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      if (property) {
        data[length - monthDiff - 1] += i[property]!;
      } else {
        data[length - monthDiff - 1] += 1;
      }
    }
  });
  return data;
};
