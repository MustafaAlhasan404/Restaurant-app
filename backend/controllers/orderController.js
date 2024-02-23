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

		// Calculate total price
		let totalPrice = 0;
		for (const productObj of products) {
			const { product, selectedOptions } = productObj;

			let productData = product;
			if (product.stockable) {
				productData = await Product.findByIdAndUpdate(
					product._id,
					{ $inc: { quantity: -1 } },
					{ new: true }
				);
			}

			let productPrice = productData.price;
			for (const option of selectedOptions) {
				productPrice += option.price;
			}

			totalPrice += productPrice;
		}

		// Create new order
		const newOrder = new Order({
			products,
			table,
			totalPrice,
		});

		const createdOrder = await newOrder.save();
		res.status(201).json(createdOrder);
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

module.exports = router;
