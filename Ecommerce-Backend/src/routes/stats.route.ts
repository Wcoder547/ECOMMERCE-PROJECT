import express from "express";
import {
  getBarStats,
  getDashboardStats,
  getLineStats,
} from "../controllers/stats.controller";
const app = express.Router();

//Stats - /api/v1/dashboard/stats
app.post("/stats", getDashboardStats);
//Stats - /api/v1/dashboard/pie
app.post("/pie", getLineStats);
//Stats - /api/v1/dashboard/bar
app.post("/bar", getBarStats);
//Stats - /api/v1/dashboard/line
app.post("/line", getLineStats);

export default app;
