import apminsight from "apminsight";
import express from "express";
import connectDb, { connectRedis } from "./utils/features.js";
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
import { v2 as cloudinary } from "cloudinary";

config({
  path: "./.env",
});
const port = process.env.PORT || 4000;
const stripeKey = process.env.STRIPE_KEY || "";

const app = express();
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json());
export const stripe = new Stripe(stripeKey);
export const nodeCache = new NodeCache();
app.get("/", (req, res) => {
  res.send("API working with/api/v1");
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/uploads", express.static("uploads"));
export const redisTTL = process.env.REDIS_TTL || 60 * 60 * 4;
const redisURI = process.env.REDIS_URL || "redis://localhost:6379";
export const redis = connectRedis(redisURI);
connectDb()
  .then(() => {
    app.on("Error", (err) => {
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
