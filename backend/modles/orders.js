const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({ 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    options: [{ name: String, price: Number }]
});

const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    tableNumber: Number,
    orderStatus: { type: String, enum: ['unprocessed', 'processed', 'paid'], default: 'unprocessed' },
    notes: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
