const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;
