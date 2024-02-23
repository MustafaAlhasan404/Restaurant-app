const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			selectedOptions: [{ name: String, price: Number }],
		},
	],
	table: {
		type: Number,
		required: true,
	},
	orderDate: {
		type: Date,
		default: Date.now,
	},
	totalPrice: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		enum: ["unprocessed", "processed", "paid"],
		default: "unprocessed",
	},
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
