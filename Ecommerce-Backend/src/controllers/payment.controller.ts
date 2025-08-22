import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.middlware.js";
import { Coupon } from "../models/coupon.model.js";
import ErrorHandler from "../utils/utility-class.js";
import { isValidObjectId } from "mongoose";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    return res
      .status(400)
      .json({ success: false, message: "Please enter amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: "usd",
    });

    return res.status(201).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const newCoupon = TryCatch(async (req, res, next) => {
  const { code, amount } = req.body;
  if (!code || !amount) {
    return next(
      new ErrorHandler("Please Enter both Coupon and amount fields", 400)
    );
  }
  const existingCoupon = await Coupon.findOne({ code });
  if (existingCoupon) {
    return next(
      new ErrorHandler(
        "Coupon code already exists. Please use a different code.",
        400
      )
    );
  }
  await Coupon.create({
    code,
    amount,
  });

  return res.status(201).json({
    success: true,
    message: `Coupon ${code} created successfully`,
  });
});

export const updateCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params; // coupon id
  const { code, amount } = req.body;

  if (!code || !amount) {
    return next(
      new ErrorHandler("Please provide atleast Coupon code or amount", 400)
    );
  }

  const coupon = await Coupon.findById(id);

  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }

  const existingCoupon = await Coupon.findOne({ code, _id: { $ne: id } });
  if (existingCoupon) {
    return next(
      new ErrorHandler("Coupon code already exists. Use a different code.", 400)
    );
  }

  coupon.code = code;
  coupon.amount = amount;

  await coupon.save();

  return res.status(200).json({
    success: true,
    message: `Coupon ${code} updated successfully`,
  });
});

export const getCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return next(new ErrorHandler("Coupon not found", 404));
  }
  return res.status(200).json({
    success: true,
    coupon,
  });
});
export const applyDiscount = TryCatch(async (req, res, next) => {
  const { coupon } = req.query;
  console.log(coupon);
  const discount = await Coupon.findOne({ code: coupon });
  if (!discount) {
    return next(new ErrorHandler("invalid coupon code", 400));
  }

  return res.status(200).json({
    success: true,
    discount: discount.amount,
  });
});
export const allCoupon = TryCatch(async (req, res, next) => {
  const coupons = await Coupon.find({});

  return res.status(200).json({
    success: true,
    coupons,
  });
});
export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("invalid coupon ID ", 404));
  }
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    return next(new ErrorHandler("invalid coupon ID ", 404));
  }
  return res.status(200).json({
    success: true,
    message: `Coupon ${coupon.code} deleted successfully`,
  });
});
