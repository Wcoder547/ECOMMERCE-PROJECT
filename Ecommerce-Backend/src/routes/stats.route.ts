import express from "express";
import {
  getBarStats,
  getDashboardStats,
  getLineStats,
  getPieStats
} from "../controllers/stats.controller.js";
const app = express.Router();

//Stats - /api/v1/dashboard/stats
app.get("/stats", getDashboardStats);
//Stats - /api/v1/dashboard/pie
app.get("/pie", getPieStats);
//Stats - /api/v1/dashboard/bar
app.get("/bar", getBarStats);
//Stats - /api/v1/dashboard/line
app.get("/line", getLineStats);

export default app;
