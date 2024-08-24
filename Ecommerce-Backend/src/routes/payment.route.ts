import express from "express";
import {
  allCoupon,
  applyDiscount,
  createPaymentIntent,
  deleteCoupon,
  newCoupon,
} from "../controllers/payment.controller.js";
const app = express.Router();

//route - /api/v1/payment/create
app.get("/create", createPaymentIntent);
//route - /api/v1/payment/coupon/new
app.post("/coupon/new", newCoupon);
//route - /api/v1/payment/coupon/discount
app.get("/discount", applyDiscount);
//route - /api/v1/payment/coupon/all
app.get("/coupon/all", allCoupon);
//route - /api/v1/payment/coupon/:id
app.delete("/coupon/:id", deleteCoupon);

export default app;
