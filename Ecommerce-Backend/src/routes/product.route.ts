import express from "express";
import { multipleUpload, singleUpload } from "../middlewares/multer.middleware.js";
import {
  delteProduct,
  getAdminProducts,
  getAllProducts,
  getCategories,
  getLatestProduct,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { AdminOnly } from "../middlewares/auth.middleware.js";
const app = express.Router();

//New-products - api/v1/product/new
app.post("/new", multipleUpload, newProduct);
//New-products - api/v1/product/new
app.get("/all/", getAllProducts);

//Latest-products - api/v1/product/latest
app.get("/latest", getLatestProduct);

//to get all categories - api/v1/product/categories
app.get("/categories", getCategories);

//to get all products/admin - api/v1/product/products
app.get("/admin-products", getAdminProducts);

app
  .route("/:id")
  .get(getSingleProduct)
  .put(AdminOnly, singleUpload, updateProduct)
  .delete(AdminOnly, delteProduct);

export default app;
