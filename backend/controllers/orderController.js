const express = require("express");
const Product = require("../models/product");
const Order = require("../models/order");
const router = express.Router();

// Get all orders, sorted by unprocessed first, then processed, then paid
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    const sortedOrders = orders.sort((a, b) => {
      const statusOrder = ["unprocessed", "processed", "paid"];
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });
    res.json(sortedOrders.map(order => ({
      ...order.toObject(),
      totalPricePreTax: order.totalPricePreTax // Ensure this field is included
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get revenue by timeframe
router.get("/revenue/:timeframe", async (req, res) => {
  const { timeframe } = req.params; // 'daily', 'monthly', 'yearly'
  const { startDate, endDate } = req.query; // Expecting ISO date strings

  // Define the MongoDB aggregation pipeline
  let groupBy = {};
  switch (timeframe) {
    case 'daily':
      groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } };
      break;
    case 'monthly':
      groupBy = { $dateToString: { format: "%Y-%m", date: "$orderDate" } };
      break;
    case 'yearly':
      groupBy = { $dateToString: { format: "%Y", date: "$orderDate" } };
      break;
    default:
      return res.status(400).json({ error: "Invalid timeframe specified" });
  }

  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "paid",
          orderDate: {
            $gte: new Date(startDate),
            $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999))
          }
        }
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    res.json(revenueData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unpaid orders (unprocessed, then processed)
router.get("/unpaid", async (req, res) => {
  try {
    const unpaidOrders = await Order.find({
      status: { $in: ["unprocessed", "processed"] },
    }).sort({ status: 1 });

    // Custom sorting logic
    unpaidOrders.sort((a, b) => {
      if (a.status === "unprocessed" && b.status === "processed") {
        return -1;
      } else if (a.status === "processed" && b.status === "unprocessed") {
        return 1;
      } else {
        return 0;
      }
    });

    res.json(unpaidOrders.map(order => ({
      ...order.toObject(),
      totalPricePreTax: order.totalPricePreTax // Ensure this field is included
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      ...order.toObject(),
      totalPricePreTax: order.totalPricePreTax // Ensure this field is included
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { products, table, notes } = req.body;

    if (!products || !table) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    let totalPrice = 0;

    // Loop through order products
    for (let product of products) {
      const dbProduct = await Product.findById(product.product);

      if (!dbProduct) {
        return res.status(400).json({ error: "Invalid product" });
      }

      totalPrice += dbProduct.price;

      if (product.selectedOptions) {
        for (let option of product.selectedOptions) {
          totalPrice += option.price;
        }
      }
    }

    // Calculate tax using the provided formula
    const tax = (totalPrice / 1.10) * 0.10;
    const totalPricePreTax = totalPrice;
    totalPrice += tax;

    const newOrder = new Order({
      products,
      table,
      totalPrice,
      totalPricePreTax, // Ensure this field is included
      tax,
      notes,
    });

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update order status to "unprocessed"
router.patch("/:orderId/unprocessed", async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "unprocessed" },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/:orderId/processed", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    let lowStockProducts = []; // Array to keep track of low stock products

    // Decrease product quantity for stockable products
    for (let product of order.products) {
      const dbProduct = await Product.findById(product.product);

      if (dbProduct.stockable) {
        dbProduct.qty--;
        if (dbProduct.qty < 10) {
          lowStockProducts.push(dbProduct); // Add to low stock array
        }
        await dbProduct.save();
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "processed" },
      { new: true }
    );

    // Include low stock information in the response
    res.status(200).json({
      ...updatedOrder.toObject(),
      lowStockProducts: lowStockProducts.length > 0 ? lowStockProducts : null,
      totalPricePreTax: updatedOrder.totalPricePreTax // Ensure this field is included
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update order status to "paid"
router.patch("/:orderId/paid", async (req, res) => {
  try {
    const { orderId } = req.params;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "paid" },
      { new: true }
    );

    res.status(200).json({
      ...updatedOrder.toObject(),
      totalPricePreTax: updatedOrder.totalPricePreTax // Ensure this field is included
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete order by id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Order.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

module.exports = router;
