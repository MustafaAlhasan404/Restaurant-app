const mongoose = require("mongoose");
const Reservation = require("../models/reservation"); // Replace with the correct path to your Reservation model

// Connect to the MongoDB database
mongoose.connect(
    "mongodb+srv://Mustafa:Mustafa00313@cluster0.9n4bpm2.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// Create an array of reservation items
const reservationItems = [
    {
        name: "Alice Johnson",
        phone: "123-456-7890",
        dateTime: new Date("2024-03-10T19:00:00Z"),
        numGuests: 4,
        notes: "Allergic to peanuts",
    },
    {
        name: "Bob Smith",
        phone: "987-654-3210",
        dateTime: new Date("2024-03-11T17:00:00Z"),
        numGuests: 2,
        notes: "Window seat preferred",
    },
    // ... more reservations with the userRole field included
];

// Function to populate the database with reservation items
async function populateReservationItems() {
    try {
        // Delete existing reservations if needed
        // await Reservation.deleteMany({}); // Uncomment if you want to clear out all existing reservations

        // Insert new reservation items
        await Reservation.insertMany(reservationItems);

        console.log("Reservation items created successfully!");
    } catch (error) {
        console.error("Error creating reservation items:", error);
    } finally {
        // Disconnect from the database
        mongoose.disconnect();
    }
}

// Call the populateReservationItems function to populate the reservation items
populateReservationItems();
