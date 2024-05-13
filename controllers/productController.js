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

// Get stockable products
router.get("/stock", async (req, res) => {
	const userRole = req.headers["role"];

	const products = await Product.find({ stockable: true });
	res.status(200).json(products);
});

// Change stock of item by ID
router.patch("/stock/:id", async (req, res) => {
	const userRole = req.headers["role"];
	const id = req.params.id;
  
	const product = await Product.findOne({ _id: id, stockable: true });
  
	if (!product) return res.status(404).json({ message: "Product not found or not stockable" });
  
	const updatedProduct = await Product.findByIdAndUpdate(
	  id,
	  { qty: req.body.qty }, // Set the new quantity directly
	  { new: true }
	);
  
	if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
  
	res.status(200).json(updatedProduct);
  });

// GET products by category
router.get("/categories/:category", async (req, res) => {
	const userRole = req.headers["role"];

	const category = req.params.category;
	const products = await Product.find({ category: category });
	if (!products) return res.status(404);
	res.json(products);
});

// GET product by ID
router.get("/:id", async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) return res.status(404);
	res.json(product);
});

// CREATE product
router.post("/", async (req, res) => {
	const {
		name,
		price,
		ingredients,
		category,
		options,
		stockable = false, // Default value for when it is not passed to the API
		qty = 0, // Default value
	} = req.body;

	try {
		const product = await Product.create({
			name,
			price,
			ingredients,
			category,
			options,
			stockable,
			qty: stockable ? qty : undefined, // Only set qty if stockable is true
		});
		res.status(201).json(product);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// UPDATE product
router.patch("/:id", async (req, res) => {
	try {
		const { stockable, qty, ...updateData } = req.body;
		const update = {
			...updateData,
			...(stockable !== undefined && { stockable }), // Conditionally include stockable
			...(stockable && { qty }), // Conditionally include qty if stockable is true
		};

		const product = await Product.findByIdAndUpdate(req.params.id, update, {
			new: true,
		});
		if (!product) return res.status(404);
		res.json(product);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Soft DELETE product
router.delete("/:id", async (req, res) => {
	try {
	  const product = await Product.findByIdAndUpdate(
		req.params.id,
		{ deleted: true }, // Set the deleted field to true
		{ new: true }
	  );
	  if (!product) return res.status(404).json({ message: "Product not found" });
	  res.json({ message: "Product deleted" }); // Respond with a message indicating a soft delete
	} catch (error) {
	  res.status(400).json({ message: error.message });
	}
  });

// Export router
module.exports = router;
