import express from "express";
import connectDb from "./utils/features.js";
import userRouter from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/order.route.js";
import paymentRouter from "./routes/payment.route.js";
import dashboardRouter from "./routes/stats.route.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";

config({
  path: "./.env",
});
const port = process.env.PORT || 4000;
const stripeKey = process.env.STRIPE_KEY || "";
const app = express();
app.use(morgan("dev"));
app.use(cors());
export const stripe = new Stripe(stripeKey);
export const nodeCache = new NodeCache();
app.get("/", (req, res) => {
  res.send("API working with/api/v1");
});
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDb()
  .then(() => {
    app.on("Erorr", (err) => {
      console.error("Error:", err);
      throw err;
    });

    app.listen(port, () => {
      console.log(`Server is running on PORT:${port}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB CONNECTION FAILED !! ", err);
  });

//using Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
