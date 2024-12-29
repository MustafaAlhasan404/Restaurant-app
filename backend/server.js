const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import & use routers
const reservationsRouter = require("./controllers/reservationController");
const productRouter = require("./controllers/productController");
const ordersRouter = require("./controllers/orderController");
const usersRouter = require("./controllers/userController");

app.use("/reservations", reservationsRouter);
app.use("/products", productRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);

// MongoDB Connection
const uri = "mongodb://atlas-sql-67717cef74ee353776309d9c-gb5f4.a.query.mongodb.net/myVirtualDatabase?ssl=true&authSource=admin";

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

// Start server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
    await connectToDatabase();
    console.log(`Server running on port ${port}`);
});