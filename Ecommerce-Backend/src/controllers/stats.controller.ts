import { nodeCache } from "../app.js";
import { TryCatch } from "../middlewares/error.middlware.js";
import { Prodcut } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Order } from "../models/order.model.js";
import {
  calCulatePercentage,
  getChartData,
  getInventeries,
} from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats;
  if (nodeCache.has("admin-stats")) {
    stats = JSON.parse(nodeCache.get("admin-stats") as string);
  } else {
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

    const thisMonthProductsPromise = Prodcut.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthProductsPromise = Prodcut.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthUserPromise = User.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthUserPromise = User.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const thisMonthOrderPromise = Order.find({
      createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
      },
    });
    const lastMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
      },
    });
    const lastsixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
      .select(["orderItems", "discount", "total", "status"])
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
      userfemailCount,
      latestTransactions,
    ] = await Promise.all([
      thisMonthProductsPromise,
      lastMonthProductsPromise,
      thisMonthUserPromise,
      lastMonthUserPromise,
      thisMonthOrderPromise,
      lastMonthOrderPromise,
      Prodcut.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
      lastsixMonthOrderPromise,
      Prodcut.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
    ]);
    const thisMonthorderRevenue = thisMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );
    const lastMonthorderRevenue = lastMonthOrder.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

    const chnagePercentage = {
      revenue: calCulatePercentage(
        thisMonthorderRevenue,
        lastMonthorderRevenue
      ),
      product: calCulatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      user: calCulatePercentage(thisMonthUser.length, lastMonthUser.length),
      order: calCulatePercentage(thisMonthOrder.length, lastMonthOrder.length),
    };

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
    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthRevenue = new Array(6).fill(0);
    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthRevenue[6 - monthDiff - 1] += order.total;
      }
    });
    const categoriesCountPromsie = categories.map((category) =>
      Prodcut.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromsie);

    const categoryCount: Record<string, number>[] = [];
    getInventeries({ categories, productsCount });
    const userRatio = {
      male: usersCount - userfemailCount,
      female: userfemailCount,
    };
    const modifiedLatestTransaction = latestTransactions.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderitems.length,
      status: i.status,
    }));
    stats = {
      categoryCount,
      categoriesCount,
      chnagePercentage,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthRevenue,
      },
      userRatio,
      latestTransactions: modifiedLatestTransaction,
    };
    nodeCache.set("admin-stats", JSON.stringify(stats));
  }
  return res.status(200).json({
    success: true,
    stats,
  });
});
export const getPieStats = TryCatch(async (req, res, next) => {
  let charts;
  if (nodeCache.has("admin-pie-charts")) {
    charts = JSON.stringify(nodeCache.get("admin-pie-charts") as string);
  } else {
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
      allOrder,
      allUsers,
      adminUsers,
      customers,
    ] = await Promise.all([
      Order.countDocuments({ status: "processing" }),
      Order.countDocuments({ status: "shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Prodcut.distinct("category"),
      Prodcut.countDocuments(),
      Prodcut.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);
    const orderFulfilement = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };
    const categoryCount = await getInventeries({
      categories,
      productsCount,
    });
    const stockAvailabilty = {
      inStock: productsCount - outOfStock,
      outOfStock,
    };
    const grossIncome = allOrder.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );
    const discount = allOrder.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );
    const productionCost = allOrder.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );
    const burnt = allOrder.reduce((prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));
    const netMargin = grossIncome - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };
    const userAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age > 40).length,
    };
    const adminCustomer = {
      admin: adminUsers,
      customers,
    };
    charts = {
      orderFulfilement,
      categoryCount,
      stockAvailabilty,
      revenueDistribution,
      userAgeGroup,
      adminCustomer,
    };
    nodeCache.set("admin-pie-charts", JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts,
  });
});
export const getBarStats = TryCatch(async (req, res, next) => {
  let charts;
  if (nodeCache.has("admin-bar-charts")) {
    charts = JSON.stringify(nodeCache.get("admin-bar-charts") as string);
  } else {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    const sixMonthProductPromise = Prodcut.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");
    const sixMonthUserPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");
    const twelveMonthOrderPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUserPromise,
      twelveMonthOrderPromise,
    ]);
    const productCounts = getChartData({ length: 6, docArr: products, today });
    const usersCounts = getChartData({ length: 6, docArr: users, today });
    const ordersCounts = getChartData({ length: 6, docArr: orders, today });
    charts = {
      users: usersCounts,
      product: productCounts,
      order: ordersCounts,
    };
    nodeCache.set("admin-bar-charts", JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts,
  });
});
export const getLineStats = TryCatch(async (req, res, next) => {
  let charts;
  if (nodeCache.has("admin-line-charts")) {
    charts = JSON.stringify(nodeCache.get("admin-bar-charts") as string);
  } else {
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
      Prodcut.find(baseQuery).select("createdAt"),
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
    nodeCache.set("admin-line-charts", JSON.stringify(charts));
  }
  return res.status(200).json({
    success: true,
    charts,
  });
});
