import express from "express";
import {
  allOrders,
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.controller.js";

const app = express.Router();

//route - api/v1/user/order/new
app.post("/new", newOrder);
//route - api/v1/user/order/myorders
app.get("/myorders", myOrders);
//route - api/v1/user/order/All
app.get("/All", allOrders);
//route - api/v1/user/order/78364dh
app.route("/:id").get(getSingleOrder).put(processOrder).delete(deleteOrder);

export default app;
