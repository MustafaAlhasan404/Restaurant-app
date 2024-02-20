const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	ingredients: String,
	category: {
		type: String,
		enum: ["food", "drink", "snack"],
		default: "food",
	},
	options: [{ name: String, price: Number }],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
