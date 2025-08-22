import { nodeCache, redis, redisTTL } from "../app.js";
import { TryCatch } from "../middlewares/error.middlware.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import {
  calCulatePercentage,
  getChartData,
  getInventories,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats;

  const key = "admin-stats";

  stats = await redis.get(key);

  if (stats) stats = JSON.parse(stats);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const thisMonth = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: today,
    };
    const lastMonth = {
      start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      end: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    // promises
    const thisMonthProductsPromise = Product.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
    });
    const lastMonthProductsPromise = Product.find({
      createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
    });
    const thisMonthUserPromise = User.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
    });
    const lastMonthUserPromise = User.find({
      createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
    });
    const thisMonthOrderPromise = Order.find({
      createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
    });
    const lastMonthOrderPromise = Order.find({
      createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
    });
    const lastSixMonthOrderPromise = Order.find({
      createdAt: { $gte: sixMonthsAgo, $lte: today },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderitems", "discount", "total", "status"])
      .limit(4);

    const [
      thisMonthProducts,
      lastMonthProducts,
      thisMonthUser,
      lastMonthUser,
      thisMonthOrder,
      lastMonthOrder,
      productsCount,
      usersCount,
      allOrders,
      lastSixMonthOrders,
      categories,
      userFemaleCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      lastMonthProductsPromise,
      thisMonthUserPromise,
      lastMonthUserPromise,
      thisMonthOrderPromise,
      lastMonthOrderPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);

    // revenue comparison
    const thisMonthOrderRevenue = thisMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthOrderRevenue = lastMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const changePercentage = {
      revenue: calCulatePercentage(
        thisMonthOrderRevenue,
        lastMonthOrderRevenue
      ),
      product: calCulatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calCulatePercentage(thisMonthUser.length, lastMonthUser.length),
      order: calCulatePercentage(thisMonthOrder.length, lastMonthOrder.length),
    };

    // overall count
    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const count = {
      revenue,
      user: usersCount,
      product: productsCount,
      order: allOrders.length,
    };

    // chart data
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt as Date;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthRevenue[6 - monthDiff - 1] += order.total || 0;
      }
    });

    // category counts
    const categoryCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ category });
        return { category, count };
      })
    );

    // user ratio
    const userRatio = {
      male: usersCount - userFemaleCount,
      female: userFemaleCount,
    };

    // latest transactions
    const modifiedLatestTransaction = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderitems?.length || 0,
      status: i.status,
    }));

    stats = {
      categoryCount,
      changePercentage,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthRevenue,
      },
      userRatio,
      latestTransactions: modifiedLatestTransaction,
    };

    await redis.setex(key, redisTTL, JSON.stringify(stats));
  }

  return res.status(200).json({ success: true, stats });
});

export const getPieStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-pie-charts";
  charts = await redis.get(key);
  if (charts) charts = JSON.parse(charts);
  else {
    // Fetch fresh data
    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);

    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      outOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customers,
    ] = await Promise.all([
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    // 📊 Order Status
    const orderFulfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    // 📊 Product Categories
    const productCategories = await getInventories({
      categories,
      productsCount,
    });

    // 📊 Stock Availability
    const stockAvailability = {
      inStock: productsCount - outOfStock,
      outOfStock,
    };

    // 📊 Revenue Distribution
    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * 0.3);
    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };

    // 📊 Users Age Group
    const userAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    // 📊 Admin vs Customers
    const adminCustomer = {
      admin: adminUsers,
      customers,
    };

    // ✅ Final Charts Object
    charts = {
      orderFulfillment,
      productCategories, // 🔑 FIXED: previously missing
      stockAvailability,
      revenueDistribution,
      userAgeGroup,
      adminCustomer,
    };

    await redis.setex(key, redisTTL, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts,
  });
});
export const getBarStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-bar-charts";

  charts = await redis.get(key);

  if (charts) charts = JSON.parse(charts);
  else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const [products, users, orders] = await Promise.all([
      Product.find({ createdAt: { $gte: sixMonthsAgo, $lte: today } }).select(
        "createdAt"
      ),
      User.find({ createdAt: { $gte: sixMonthsAgo, $lte: today } }).select(
        "createdAt"
      ),
      Order.find({ createdAt: { $gte: twelveMonthsAgo, $lte: today } }).select(
        "createdAt"
      ),
    ]);

    const productCounts = getChartData({ length: 6, docArr: products, today });
    const usersCounts = getChartData({ length: 6, docArr: users, today });
    const ordersCounts = getChartData({ length: 6, docArr: orders, today });

    charts = {
      users: usersCounts,
      product: productCounts,
      order: ordersCounts,
    };

    await redis.setex(key, redisTTL, JSON.stringify(charts));
  }

  return res.status(200).json({
    success: true,
    charts, // send object directly
  });
});
export const getLineStats = TryCatch(async (req, res, next) => {
  let charts;
  const key = "admin-line-charts";

  charts = await redis.get(key);

  if (charts) charts = JSON.parse(charts);
  else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select("createdAt"),
    ]);
    const productCounts = getChartData({ length: 12, docArr: products, today });
    const usersCounts = getChartData({ length: 12, docArr: users, today });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });
    charts = {
      users: usersCounts,
      product: productCounts,
      discount,
      revenue,
    };
    await redis.setex(key, redisTTL, JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts,
  });
});
