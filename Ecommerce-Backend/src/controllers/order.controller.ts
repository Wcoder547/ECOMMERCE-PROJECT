import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlware.js";
import { newOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.model.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache } from "../app.js";
import { isValidObjectId } from "mongoose";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, newOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderitems,
    } = req.body;
    if (
      !shippingInfo ||
      !user ||
      !subtotal ||
      !tax ||
      !shippingCharges ||
      !discount ||
      !total ||
      !orderitems
    ) {
      return res.status(400).json({
        success: true,
        message: "please input all fields",
      });
    }

    const order = await Order.create({
      shippingInfo,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
      orderitems,
    });

    await reduceStock(orderitems);
    await invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderitems.map((i) => String(i.productId)),
    });

    return res.status(201).json({
      success: true,
      message: "New order placed successfully",
    });
  }
);
export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  if (!user) {
    return next(new ErrorHandler("please provide ID", 400));
  }
  let orders = [];
  const key = `my-orders-${user}`;
  if (nodeCache.has(key)) orders = JSON.parse(nodeCache.get(key) as string);
  else {
    orders = await Order.find({ user });
    nodeCache.set(key, JSON.stringify(orders));
  }

  return res.status(201).json({
    success: true,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  let totalorders = [];
  const key = `all-orders`;
  if (nodeCache.has(key))
    totalorders = JSON.parse(nodeCache.get(key) as string);
  else {
    totalorders = await Order.find().populate("user", "name");
    nodeCache.set(key, JSON.stringify(totalorders));
  }

  return res.status(201).json({
    success: true,
    totalorders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid ID", 400));
  }
  let singleOrder;
  const key = `order-${id}`;
  if (nodeCache.has(key))
    singleOrder = JSON.parse(nodeCache.get(key) as string);
  else {
    singleOrder = await Order.findById(id).populate("user", "name");
    if (!singleOrder) return next(new ErrorHandler("order not found!!", 404));
    nodeCache.set(key, JSON.stringify(singleOrder));
  }

  return res.status(201).json({
    success: true,
    singleOrder,
  });
});

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("order not found!!", 404));
  }
  switch (order.status) {
    case "Processing":
      order.status = "Delivered";
      break;
    case "Delivered":
      order.status = "Shipped";
      break;
    default:
      order.status = "Delivered";
      break;
  }
  await order.save();
  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order Processed successfully",
  });
});
export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid ID", 400));
  }

  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("order not found!!", 404));
  }
  await order.deleteOne();
  await invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });

  return res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
