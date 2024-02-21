// Requirements
const express = require("express");

// Reservation model
const Reservation = require("../models/reservation");

// Create router
const router = express.Router();

// GET all reservations
router.get("/", async (req, res) => {
	const userRole = req.headers["role"];

	// let reservations;
	// // Employee sees upcoming reservations
	// // Manager sees all reservations
	// if (userRole === "manager") {
	// 	reservations = await Reservation.find();
	// } else if (userRole === "employee") {
	// 	const currentDate = new Date();
	// 	reservations = await Reservation.find({
	// 		dateTime: { $gte: currentDate },
	// 	});
	// } else {
	// 	return res.status(403).json({ error: "Invalid role" });
	// }

	const reservations = await Reservation.find();
	res.status(200).json(reservations);
});

// GET reservation by ID
router.get("/:id", async (req, res) => {
	const reservation = await Reservation.findById(req.params.id);
	if (!reservation) return res.status(404);
	res.json(reservation);
});

// CREATE reservation
router.post("/", async (req, res) => {
	const { name, phone, dateTime, numGuests } = req.body;

	try {
		const newReservation = await Reservation.create({
			name,
			phone,
			dateTime,
			numGuests,
		});
		res.status(201).json(newReservation);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// UPDATE reservation
router.patch("/:id", async (req, res) => {
	try {
		const reservation = await Reservation.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!reservation) return res.status(404);
		res.json(reservation);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// DELETE reservation
router.delete("/:id", async (req, res) => {
	try {
		const reservation = await Reservation.findByIdAndDelete(req.params.id);
		if (!reservation) return res.status(404);
		res.json({ message: "Deleted reservation" });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Export router
module.exports = router;
