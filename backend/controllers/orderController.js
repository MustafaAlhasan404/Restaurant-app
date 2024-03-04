const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Order = require("../models/order");

// Get all orders, sorted by unprocessed first, then processed, then paid
router.get("/", async (req, res) => {
	try {
		const orders = await Order.find();
		const sortedOrders = orders.sort((a, b) => {
			const statusOrder = ["unprocessed", "processed", "paid"];
			return (
				statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
			);
		});
		res.json(sortedOrders);
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

		res.json(order);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
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

		res.json(unpaidOrders);
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

			if (dbProduct.stockable) {
				dbProduct.qty--;
				await dbProduct.save();
			}
		}

		const newOrder = new Order({
			products,
			table,
			totalPrice,
		});

		await newOrder.save();

		res.status(201).json(newOrder);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

module.exports = router;

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

// Update order status to "processed"
router.patch("/:orderId/processed", async (req, res) => {
	try {
		const { orderId } = req.params;

		const updatedOrder = await Order.findByIdAndUpdate(
			orderId,
			{ status: "processed" },
			{ new: true }
		);

		res.status(200).json(updatedOrder);
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

		res.status(200).json(updatedOrder);
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
	  res.status(500).json({ message: error.message || "Internal Server Error" });
	}
  });
  

module.exports = router;