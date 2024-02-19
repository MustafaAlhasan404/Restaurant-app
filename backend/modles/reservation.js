const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String }, 
    dateTime: { type: Date, required: true },
    numGuests: { type: Number, required: true },
    notes: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
