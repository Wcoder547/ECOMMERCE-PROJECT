import express from "express";
import {
  allCoupon,
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  newCoupon,
  updateCoupon,
  getCoupon
} from "../controllers/payment.controller.js";
import { AdminOnly } from "../middlewares/auth.middleware.js";
const app = express.Router();

//route - /api/v1/payment/create
app.post("/create", createPaymentIntent);
//route - /api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);
//route - /api/v1/payment/coupon/discount
app.get("/discount", applyDiscount);
//route - /api/v1/payment/coupon/all
app.get("/coupon/all", allCoupon);
//route - /api/v1/payment/coupon/:id
app.route("/coupon/:id").get(getCoupon).delete(deleteCoupon).put(updateCoupon);

export default app;
