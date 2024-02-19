// Requirements
const express = require('express');

// Reservation model
const Reservation = require('../models/reservation'); 

// Create router
const router = express.Router();

// Export router and accept app
module.exports = (app) => {

  // GET all reservations
  app.get('/reservations', async (req, res) => {
    const reservations = await Reservation.find();
    res.json(reservations);
  });

  // GET reservation by ID
  app.get('/reservations/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if(!reservation) return res.status(404);
    res.json(reservation);
  });

  // CREATE reservation
  app.post('/reservations', async (req, res) => {
    const { name, phone, dateTime, numGuests } = req.body;

    try {
      const newReservation = await Reservation.create({
        name, 
        phone,
        dateTime,
        numGuests 
      });
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({ message: error.message});
    }
  });

  // UPDATE reservation
  app.patch('/reservations/:id', async (req, res) => {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }  
      );
      if(!reservation) return res.status(404);
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE reservation
  app.delete('/reservations/:id', async (req, res) => {
    try {
      const reservation = await Reservation.findByIdAndDelete(req.params.id);
      if(!reservation) return res.status(404);
      res.json({ message: 'Deleted reservation' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

}
