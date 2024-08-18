
import express from "express"
import { singleUpload } from "../middlewares/multer.middleware.js";
import { newProduct } from "../controllers/product.controller.js";
const app = express.Router();


//route - api/v1/user/product
app.post("/new",singleUpload,newProduct)





export default app;