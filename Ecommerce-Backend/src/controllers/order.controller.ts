import { Request } from "express";
import { TryCatch } from "../middlewares/error.middlware.js";
import { newOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.model.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache, redis, redisTTL } from "../app.js";
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
      subtotal === undefined ||
      tax === undefined ||
      shippingCharges === undefined ||
      discount === undefined ||
      total === undefined ||
      !orderitems
    ) {
      return res.status(400).json({
        success: false,
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
  console.log(user);
  if (!user) {
    return next(new ErrorHandler("please provide ID", 400));
  }
  const key = `my-orders-${user}`;
  let orders;
  orders = await redis.get(key);

  if (orders) {
    orders = JSON.parse(orders);
  } else {
    orders = await Order.find({ user });
    console.log(orders);

    await redis.setex(key, redisTTL, JSON.stringify(orders));
  }

  return res.status(200).json({
    success: true,
    orders,
  });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = `all-orders`;

  let orders;
  orders = await redis.get(key);
  if (orders) {
    orders = JSON.parse(orders);
  } else {
    orders = await Order.find().populate("user", "name");
    await redis.setex(key, redisTTL, JSON.stringify(orders));
  }

  return res.status(201).json({
    success: true,
    orders,
  });
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid ID", 400));
  }
  const key = `order-${id}`;
  let order;
  order = await redis.get(key);
  if (order) {
    order = JSON.parse(order);
  } else {
    order = await Order.findById(id).populate("user", "name");

    if (!order) return next(new ErrorHandler("Order Not Found", 404));
    await redis.setex(key, redisTTL, JSON.stringify(order));
  }

  return res.status(201).json({
    success: true,
    order,
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
