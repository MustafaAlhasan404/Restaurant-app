const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Order = require("../models/order");

// Helper function to sort orders by status
const sortOrdersByStatus = (orders) => {
  const statusOrder = { "unprocessed": 1, "processed": 2, "paid": 3 };
  return orders.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
};

// Get all orders, sorted by unprocessed first, then processed, then paid
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    const sortedOrders = sortOrdersByStatus(orders);
    res.json(sortedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { products, table } = req.body;
    if (!products || !table) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    let totalPrice = 0;
    for (let product of products) {
      const dbProduct = await Product.findById(product.product);
      if (!dbProduct) {
        return res.status(400).json({ error: "Invalid product" });
      }
      totalPrice += dbProduct.price * (product.quantity || 1);
      if (product.selectedOptions) {
        for (let option of product.selectedOptions) {
          totalPrice += option.price * (option.quantity || 1);
        }
      }
      if (dbProduct.stockable) {
        dbProduct.qty -= (product.quantity || 1);
        await dbProduct.save();
      }
    }

    const newOrder = new Order({ products, table, totalPrice });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!["unprocessed", "processed", "paid"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete order by id
router.delete("/:id", async (req, res) => {
  try {
    const result = await Order.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
