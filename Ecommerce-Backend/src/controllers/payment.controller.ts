import { TryCatch } from "../middlewares/error.middlware.js";
import { Coupon } from "../models/coupon.model.js";
import ErrorHandler from "../utils/utility-class.js";
import { isValidObjectId } from "mongoose";
export const newCoupon = TryCatch(async (req, res, next) => {
  const { coupon, amount } = req.body;
  if (!coupon || !amount) {
    return next(
      new ErrorHandler("Please Enter both Coupon and amount fields", 400)
    );
  }
  const existingCoupon = await Coupon.findOne({ code: coupon });
  if (existingCoupon) {
    return next(
      new ErrorHandler(
        "Coupon code already exists. Please use a different code.",
        400
      )
    );
  }
  await Coupon.create({
    code: coupon,
    amount,
  });

  return res.status(201).json({
    success: true,
    message: `Coupon ${coupon} created successfully`,
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
