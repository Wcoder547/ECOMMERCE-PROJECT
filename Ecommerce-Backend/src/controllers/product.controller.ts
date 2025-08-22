import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlware.js";
import {
  baseQuery,
  newProductRequestBody,
  searchRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.model.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { isValidObjectId } from "mongoose";
import { nodeCache, redis, redisTTL } from "../app.js";
import {
  deleteFromCloudinary,
  findAverageRatings,
  invalidateCache,
  uploadToCloudinary,
} from "../utils/features.js";
import { Review } from "../models/review.js";
import { User } from "../models/user.model.js";

export const getLatestProduct = TryCatch(async (req, res, next) => {
  let products;

  products = await redis.get("latest-products");

  if (products) products = JSON.parse(products);
  else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    await redis.setex("latest-products", redisTTL, JSON.stringify(products));
  }
  invalidateCache({ product: true });
  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, searchRequestQuery>, res, next) => {
    const { search, sort, price, category } = req.query;
    const page = Number(req.query.page) || 1;

    const key = `products-${search}-${sort}-${category}-${price}-${page}`;

    let products;
    let totalPage;

    const cachedData = await redis.get(key);
    if (cachedData) {
      const data = JSON.parse(cachedData);
      totalPage = data.totalPage;
      products = data.products;
    } else {
      const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

      const skip = Number(page - 1) * limit;

      const baseQuery: baseQuery = {};
      if (search)
        baseQuery.name = {
          $regex: search ?? "",
          $options: "i",
        };

      if (price)
        baseQuery.price = {
          $lt: Number(price),
        };

      if (category) baseQuery.category = category;

      const [productsFetched, filteredOnlyProduct] = await Promise.all([
        Product.find()
          .sort(sort && { price: sort === "asc" ? 1 : -1 })
          .limit(limit)
          .skip(skip),
        Product.find(baseQuery),
      ]);
      products = productsFetched;
      const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
      await redis.setex(key, 30, JSON.stringify({ products, totalPage }));
    }

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

export const getCategories = TryCatch(async (req: Request, res, next) => {
  let categories;

  categories = await redis.get("categories");

  if (categories) categories = JSON.parse(categories);
  else {
    categories = await Product.distinct("category");
    await redis.setex("categories", redisTTL, JSON.stringify(categories));
  }
  return res.status(200).json({
    success: true,
    categories,
  });
});
export const getAdminProducts = TryCatch(async (req: Request, res, next) => {
  let products;

  products = await redis.get("all-products");

  if (products) products = JSON.parse(products);
  else {
    products = await Product.find({});
    await redis.setex("all-products", redisTTL, JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});
export const getSingleProduct = TryCatch(async (req: Request, res, next) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("No id found!!", 400));
  }
  let product;
  const key = `product-${id}`;

  product = await redis.get(key);
  if (product) product = JSON.parse(product);
  else {
    product = await Product.findById(id);
    await redis.setex(key, redisTTL, JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    product,
  });
});
//Revalidate on new,update,delete product & new order
export const newProduct = TryCatch(
  async (req: Request<{}, {}, newProductRequestBody>, res, next) => {
    const { name, category, price, stock, description } = req.body;
    // console.log(name, category, price, stock);
    const photos = req.files as Express.Multer.File[] | undefined;
    if (!photos) return next(new ErrorHandler("Please Add photos", 400));

    if (photos.length < 1) {
      return next(new ErrorHandler("Please Add atleast one photo", 400));
    }
    if (photos.length > 5) {
      return next(new ErrorHandler("You can only upload five photos", 400));
    }
    if (!name || !category || !price || !stock || !description) {
      photos.forEach((photo) => {
        rm(photo.path, () => {
          console.log("photo deleted");
        });
      });
      return next(new ErrorHandler("All fields are required", 400));
    }
    const photosURL = await uploadToCloudinary(photos);

    await Product.create({
      name,
      category: category.toLowerCase().trim(),
      description,
      price,
      stock,
      photos: photosURL,
    });
    await invalidateCache({ product: true, admin: true });
    return res.status(201).json({
      success: true,
      message: "product added successfully",
    });
  }
);
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, price, stock, description } = req.body;
  // console.log(name, category, price, stock);
  const photos = req.files as Express.Multer.File[] | undefined;
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("product not found!!", 404));
  }

  if (photos && photos.length > 0) {
    const photosURL = await uploadToCloudinary(photos);

    const ids = product.photos.map((photo) => photo.public_id);

    await deleteFromCloudinary(ids);

    product.photos = photosURL;
  }
  if (!name && !category && !price && !stock && !photos && !description) {
    return next(
      new ErrorHandler("Please provide at least one field to update", 400)
    );
  }
  if (name) product.name = name;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;
  if (description) product.description = description;

  await product.save();
  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });
  return res.status(201).json({
    success: true,
    message: "product updated successfully",
  });
});
export const delteProduct = TryCatch(async (req: Request, res, next) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("No id found!!", 400));
  }
  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not existed", 400));
  }
  const ids = product.photos.map((photo) => photo.public_id);
  await deleteFromCloudinary(ids);

  await product.deleteOne();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

//Reviews controllers
export const allReviewsOfProduct = TryCatch(async (req, res, next) => {
  let reviews;
  const key = `reviews-${req.params.id}`;

  reviews = await redis.get(key);

  if (reviews) reviews = JSON.parse(reviews);
  else {
    reviews = await Review.find({
      product: req.params.id,
    })
      .populate("user", "name photo")
      .sort({ updatedAt: -1 });

    await redis.setex(key, redisTTL, JSON.stringify(reviews));
  }

  return res.status(200).json({
    success: true,
    reviews,
  });
});

export const newReview = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ErrorHandler("Not Logged In", 404));

  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  const { comment, rating } = req.body;

  const alreadyReviewed = await Review.findOne({
    user: user._id,
    product: product._id,
  });

  if (alreadyReviewed) {
    alreadyReviewed.comment = comment;
    alreadyReviewed.rating = rating;

    await alreadyReviewed.save();
  } else {
    await Review.create({
      comment,
      rating,
      user: user._id,
      product: product._id,
    });
  }

  const { ratings, numOfReviews } = await findAverageRatings(product._id);

  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
    review: true,
  });

  return res.status(alreadyReviewed ? 200 : 201).json({
    success: true,
    message: alreadyReviewed ? "Review Update" : "Review Added",
  });
});

export const deleteReview = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.query.id);

  if (!user) return next(new ErrorHandler("Not Logged In", 404));

  const review = await Review.findById(req.params.id);
  if (!review) return next(new ErrorHandler("Review Not Found", 404));

  const isAuthenticUser = review.user.toString() === user._id.toString();

  if (!isAuthenticUser) return next(new ErrorHandler("Not Authorized", 401));

  await review.deleteOne();

  const product = await Product.findById(review.product);

  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  const { ratings, numOfReviews } = await findAverageRatings(product._id);

  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save();

  await invalidateCache({
    product: true,
    productId: String(product._id),
    admin: true,
    review: true,
  });

  return res.status(200).json({
    success: true,
    message: "Review Deleted",
  });
});
