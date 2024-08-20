import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlware.js";
import {
  baseQuery,
  newProductRequestBody,
  searchRequestQuery,
} from "../types/types.js";
import { Prodcut } from "../models/product.model.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { isValidObjectId } from "mongoose";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

export const getLatestProduct = TryCatch(async (req, res, next) => {
  let products;
  if (nodeCache.has("latest-product"))
    products = JSON.parse(nodeCache.get("latest-product") as string);
  else {
    products = await Prodcut.find({}).sort({ createdAt: -1 }).limit(5);
    nodeCache.set("latest-product", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, searchRequestQuery>, res, next) => {
    const { search, sort, price, category } = req.query;
    //  console.log(search,sort,price,category)
    const page = Number(req.query.page) || 1;
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

    const [latestProduct, filteredOnlyProduct] = await Promise.all([
      Prodcut.find()
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip),
      Prodcut.find(baseQuery),
    ]);
    const totalPage = Math.ceil(Prodcut.length / limit);

    return res.status(200).json({
      success: true,
      latestProduct,
      filteredOnlyProduct,
      totalPage,
    });
  }
);

export const getCategories = TryCatch(async (req: Request, res, next) => {
  let categories;
  if (nodeCache.has("categories"))
    categories = JSON.parse(nodeCache.get("categories") as string);
  else {
    categories = await Prodcut.distinct("category");
    nodeCache.set("categories", JSON.stringify(categories));
  }
  return res.status(200).json({
    success: true,
    categories,
  });
});
export const getAdminProducts = TryCatch(async (req: Request, res, next) => {
  let adminProducts;
  if (nodeCache.has("admin-products"))
    adminProducts = JSON.parse(nodeCache.get("admin-products") as string);
  else {
    adminProducts = await Prodcut.find({});
    nodeCache.set("admin-products", JSON.stringify(adminProducts));
  }

  return res.status(200).json({
    success: true,
    adminProducts,
  });
});
export const getSingleProduct = TryCatch(async (req: Request, res, next) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("No id found!!", 400));
  }
  let singleProduct;
  if (nodeCache.has(`product-${id}`))
    singleProduct = JSON.parse(nodeCache.get(`product-${id}`) as string);
  else {
    singleProduct = await Prodcut.findById(id);
    nodeCache.set(`product-${id}`, JSON.stringify(singleProduct));
  }

  return res.status(200).json({
    success: true,
    singleProduct,
  });
});
//Revalidate on new,update,delete product & new order
export const newProduct = TryCatch(
  async (req: Request<{}, {}, newProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;
    // console.log(name, category, price, stock);
    const photo = req.file;
    if (!photo) return next(new ErrorHandler("Please Add photo", 400));

    if (!name || !category || !price || !stock) {
      rm(photo.path, () => {
        console.log("photo deleted");
      });
      return next(new ErrorHandler("All fields are required", 400));
    }

    await Prodcut.create({
      name,
      category: category.toLowerCase().trim(),
      price,
      stock,
      photo: photo?.path,
    });
    await invalidateCache({ product: true });
    return res.status(201).json({
      success: true,
      message: "product added successfully",
    });
  }
);
export const updateProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;
  // console.log(name, category, price, stock);
  const photo = req.file;
  const product = await Prodcut.findById(id);
  if (!product) {
    return next(new ErrorHandler("product not found!!", 404));
  }

  if (photo) {
    rm(product.photo!, () => {
      console.log("old Photo deleted");
    });
    product.photo = photo.path;
  }

  if (name) product.name = name;

  if (price) product.price = price;

  if (stock) product.stock = stock;

  if (category) product.category = category;

  await product.save();
  await invalidateCache({ product: true, productId: String(product._id) });
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
  const product = await Prodcut.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not existed", 400));
  }
  rm(product.photo, () => {
    console.log("Product photo deleted");
  });
  await product.deleteOne();

  await invalidateCache({ product: true, productId: String(product._id) });

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
