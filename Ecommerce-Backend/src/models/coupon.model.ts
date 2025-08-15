import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please Enter coupon code"],
      unique: true,
    },

    amount: {
      type: Number,
      required: [true, "Please Enter the discount amount"],
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
