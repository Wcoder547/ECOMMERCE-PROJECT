import mongoose from "mongoose";
import { Document } from "mongoose";
import { invalidateCacheProps, orderitemsType } from "../types/types.js";
import { nodeCache, redis } from "../app.js";
import { Product } from "../models/product.model.js";
import { DB_NAME } from "./constant.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Review } from "../models/review.js";
import Redis from "ioredis";

export const findAverageRatings = async (
  productId: mongoose.Types.ObjectId
) => {
  let totalRating = 0;

  const reviews = await Review.find({ product: productId });
  reviews.forEach((review) => {
    totalRating += review.rating;
  });

  const averateRating = Math.floor(totalRating / reviews.length) || 0;

  return {
    numOfReviews: reviews.length,
    ratings: averateRating,
  };
};

const getBase64 = (file: Express.Multer.File) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export const uploadToCloudinary = async (files: Express.Multer.File[]) => {
  const promises = files.map(async (file) => {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload(getBase64(file), (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result!);
      });
    });
  });
  const result = await Promise.all(promises);
  return result.map((res) => ({
    public_id: res.public_id,
    url: res.secure_url,
  }));
};

export const deleteFromCloudinary = async (publicIds: string[]) => {
  const promises = publicIds.map((publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
  });
  return Promise.all(promises);
};
//connect-the db
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

//connect-the-redis
export const connectRedis = (redisURI: string) => {
  const redis = new Redis(redisURI);

  redis.on("connect", () => console.log("Redis Connected"));
  redis.on("error", (e) => console.log(e));

  return redis;
};

export const invalidateCache = async ({
  product,
  order,
  admin,
  review,
  userId,
  orderId,
  productId,
}: invalidateCacheProps) => {
  console.log(review);
  if (review) {
    await redis.del([`reviews-${productId}`]);
  }
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

    await redis.del(productKeys);
  }
  if (order) {
    const orderKeys: string[] = [
      "all-orders",
      `my-orders-${userId}`,
      `order-${orderId}`,
    ];

    await redis.del(orderKeys);
  }
  if (admin) {
    await redis.del([
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

    // Ensure the quantity is a valid number and greater than 0
    if (isNaN(order.quantity) || order.quantity <= 0) {
      throw new Error(`Invalid quantity for product ${order.productId}`);
    }

    const product = await Product.findById(order.productId);
    if (!product) {
      throw new Error(`Product with ID ${order.productId} not found!`);
    }

    // Ensure stock is sufficient
    if (product.stock < order.quantity) {
      throw new Error(`Not enough stock for product ${order.productId}`);
    }

    // Reduce the stock
    product.stock -= order.quantity;

    // Ensure that the stock doesn't go negative
    if (product.stock < 0) {
      throw new Error(
        `Stock for product ${order.productId} cannot be negative`
      );
    }

    // Save the updated product
    await product.save();
  }
};

export const calCulatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const percent = ((thisMonth - lastMonth) / lastMonth) * 100;
  return percent.toFixed(0);
};

export const getInventories = async ({
  categories,
  productsCount,
}: {
  categories: string[];
  productsCount: number;
}) => {
  const categoriesCountPromsie = categories.map((category) =>
    Product.countDocuments({ category })
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
