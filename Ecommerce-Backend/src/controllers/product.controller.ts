import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlware.js";
import { newProductRequestBody } from "../types/types.js";
import { Prodcut } from "../models/product.model.js";

export const newProduct = TryCatch(
  async (req: Request<{}, {}, newProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;

    await Prodcut.create({
      name,
      category: category.toLowerCase(),
      price,
      stock,
      photo: photo?.path,
    });

    return res.status(201).json({
      success: true,
      message: "product added successfully",
    });
  }
);
