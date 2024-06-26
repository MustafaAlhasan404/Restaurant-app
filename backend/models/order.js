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
            price: Number,
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
    notes: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["unprocessed", "processed", "paid"],
        default: "unprocessed",
    },
    serverCharge: {
        type: Number,
        default: 0,
    },
    tax: {
        type: Number,
        default: 0,
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
