import express from "express";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.controller.js";
import { AdminOnly } from "../middlewares/auth.middleware.js";

const app = express.Router();

//route - /api/v1/orde/new
app.post("/new", newOrder);
//route - api/v1/order/myorders
app.get("/myorders", myOrders);
//route - api/v1/order/All
app.get("/All", AdminOnly, allOrders);
//route - api/v1/order/78364dh
app.route("/:id").get(getSingleOrder).put(processOrder).delete(deleteOrder);

export default app;
