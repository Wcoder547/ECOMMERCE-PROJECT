import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlware.js";
import { newProductRequestBody } from "../types/types.js";
import { Prodcut } from "../models/product.model.js";
import ErrorHandler from "../utils/utility-class.js";
import {rm} from "fs"
import {isValidObjectId} from "mongoose"

export const newProduct = TryCatch(
  async (req: Request<{}, {}, newProductRequestBody>, res, next) => {
    const { name, category, price, stock } = req.body;
    // console.log(name, category, price, stock);
    const photo = req.file;
    if(!photo) return next(new ErrorHandler("Please Add photo",400))

    if(!name || !category || !price || !stock ){
      rm(photo.path,()=>{
        console.log("photo deleted")
      })
      return next(new ErrorHandler("All fields are required",400))
    }

    await Prodcut.create({
      name,
      category: category.toLowerCase().trim(),
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


export const getLatestProduct = TryCatch(
  async (req: Request, res, next) => {
   
   const latestProduct= await Prodcut.find({}).sort({createdAt:-1}).limit(5)
   return res.status(200).json({
    success: true,
    latestProduct
  });
   
  }
);
export const getCategories = TryCatch(
  async (req: Request, res, next) => {
   
   const categories = await Prodcut.distinct("category")
   return res.status(200).json({
    success: true,
    categories
  });
   
  }
);
export const adminProducts = TryCatch(
  async (req: Request, res, next) => {
   
   const adminProducts = await Prodcut.find({})
   return res.status(200).json({
    success: true,
    adminProducts
  });
   
  }
);
export const getSingleProduct = TryCatch(
  async (req: Request, res, next) => {
   const id = req.params.id
   if(!isValidObjectId(id)){
    return next(new ErrorHandler("No id found!!",400))
   }
   const singleProduct = await Prodcut.findById(id)
   return res.status(200).json({
    success: true,
    singleProduct
  });
   
  }
);

export const updateProduct = TryCatch(
  async (req, res, next) => {
    const {id}=req.params
    const { name, category, price, stock } = req.body;
    // console.log(name, category, price, stock);
    const photo = req.file;
    const product = await Prodcut.findById(id)
    if(!product){
      return next(new ErrorHandler("product not found!!",404))
    }
    

    if(photo){
      rm(product.photo!,()=>{
        console.log("old Photo deleted")
      })
    product.photo = photo.path
    }

   if(name) product.name = name

   if(price) product.price = price

   if(stock) product.stock = stock

   if(category) product.category = category

   await product.save()
    return res.status(201).json({
      success: true,
      message: "product updated successfully",
    });
  }
);
export const delteProduct = TryCatch(
  async (req: Request, res, next) => {
   const id = req.params.id
   if(!isValidObjectId(id)){
    return next(new ErrorHandler("No id found!!",400))
   }
    const product= await Prodcut.findById(id)
    if(!product){
        return next(new ErrorHandler("Product not existed",400))
    }
    rm(product.photo,()=>{
      console.log("Product photo deleted")
    })
    await product.deleteOne()
   return res.status(200).json({
    success: true,
    message:"Product deleted successfully"
  });
   
  }
);