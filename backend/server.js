const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// Import models
const User = require("./models/user");
const Reservation = require("./models/reservation");
const Product = require("./models/product");
const Stock = require("./models/stock");
const Orders = require("./models/order");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri =
	"mongodb+srv://Mustafa:Mustafa00313@cluster0.9n4bpm2.mongodb.net/?retryWrites=true&w=majority";

async function connectToDatabase() {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connected to MongoDB Database");
	} catch (error) {
		console.error("Failed to connect to MongoDB Database:", error);
	}
}

// Start the server
app.listen(port, async () => {
	await connectToDatabase();
	console.log(`Server is running on port ${port}`);
});
