// Requirements
const express = require("express");

// Product model
const Product = require("../models/product");

// Create router
const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
	const userRole = req.headers["role"];

	const products = await Product.find();
	res.status(200).json(products);
});

// GET products by category
router.get("/categories/:category", async (req, res) => {
	const userRole = req.headers["role"];

	const category = req.params.category;
	const product = await Product.find({ category: category });
	if (!product) return res.status(404);
	res.json(product);
});

// GET product by ID
router.get("/:id", async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) return res.status(404);
	res.json(product);
});

// CREATE product
router.post("/", async (req, res) => {
	const { name, price, ingredients, category, options } = req.body;

	try {
		const product = await Product.create({
			name,
			price,
			ingredients,
			category,
			options,
		});
		res.status(201).json(product);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// UPDATE product
router.patch("/:id", async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!product) return res.status(404);
		res.json(product);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// DELETE product
router.delete("/:id", async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) return res.status(404);
		res.json({ message: "Deleted product" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Export router
module.exports = router;
