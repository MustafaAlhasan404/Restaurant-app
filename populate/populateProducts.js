const mongoose = require("mongoose");
const Product = require("../models/product"); // Replace with the correct path to your Product model

// Connect to the MongoDB database
mongoose.connect(
	"mongodb+srv://Mustafa:Mustafa00313@cluster0.9n4bpm2.mongodb.net/?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
);

// Create an array of menu items
const menuItems = [
  {
    name: "Cheeseburger",
  price: 9.99,
  ingredients: "Beef patty, cheese, lettuce, tomato, onion",
  category: "food",
  options: [
    { name: "extra cheese", price: 0.50 },
    { name: "extra patty", price: 1.00 },
    { name: "gluten-free bun", price: 0.75 }
  ],
  stockable: false,
  qty: 10,
  },
  {
    name: "Shawarma Wrap",
    price: 8.99,
    ingredients: "Grilled chicken, garlic sauce, vegetables",
    category: "food",
    options: [
      { name: "extra cheese", price: 0.50 },
      { name: "extra patty", price: 1.00 },
      { name: "gluten-free bun", price: 0.75 }
    ],
    stockable: false, // Set stockable to false for food items
    qty: 15,
  },
  {
    name: "Fried Chicken",
    price: 7.99,
    ingredients: "Crispy fried chicken, seasoning",
    category: "food",
    options: [
      { name: "extra cheese", price: 0.50 },
      { name: "extra patty", price: 1.00 },
      { name: "gluten-free bun", price: 0.75 }
    ],
    stockable: false, // Set stockable to false for food items
    qty: 12,
  },
  {
    name: "Chicken Tenders",
    price: 6.99,
    ingredients: "Breaded chicken tenders",
    category: "food",
    options: [
      { name: "extra cheese", price: 0.50 },
      { name: "extra patty", price: 1.00 },
      { name: "gluten-free bun", price: 0.75 }
    ],
    stockable: false, // Set stockable to false for food items
    qty: 8,
  },
  {
    name: "Buffalo Wings",
    price: 10.99,
    ingredients: "Spicy buffalo wings",
    category: "food",
    options: [
      { name: "extra cheese", price: 0.50 },
      { name: "extra patty", price: 1.00 },
      { name: "gluten-free bun", price: 0.75 }
    ],
    stockable: false, // Set stockable to false for food items
    qty: 20,
  },
  {
    name: "Water",
    price: 1.99,
    ingredients: "Pure water",
    category: "drink",
    options: [
      { name: "Ice", price: 0.50 },
    ],
    stockable: true,
    qty: 50,
  },
  {
    name: "Coke",
    price: 2.49,
    ingredients: "Carbonated cola drink",
    category: "drink",
    options: [
      { name: "Ice", price: 0.50 },
    ],
    stockable: true,
    qty: 30,
  },
  {
    name: "Pepsi",
    price: 2.49,
    ingredients: "Carbonated cola drink",
    category: "drink",
    options: [
      { name: "Ice", price: 0.50 },
    ],
    stockable: true,
    qty: 25,
  },
  {
    name: "7 Up",
    price: 2.49,
    ingredients: "Lemon-lime flavored carbonated drink",
    category: "drink",
    options: [
      { name: "Ice", price: 0.50 },
    ],
    stockable: true,
    qty: 20,
  },
  {
    name: "Apple Juice",
    price: 3.99,
    ingredients: "100% pure apple juice",
    category: "drink",
    options: [
      { name: "Ice", price: 0.50 },
    ],
    stockable: true,
    qty: 15,
  },
  {
    name: "AppleTrial",
    price: 3.99,
    ingredients: "100% pure apple juice",
    category: "drink",
    options: [
      { name: "Ice", price: 0.50 },
    ],
    stockable: true,
    qty: 1,
  },
  {
    name: "Apple",
    price: 3.99,
    ingredients: "100% pure apple juice",
    category: "snack",
    options: [
      { name: "Ice", price: 0.50 },
    ],
    stockable: true,
    qty: 15,
  },
  // {
  //   name: "Caesar Salad",
  //   price: 5.99,
  //   ingredients: "Romaine lettuce, croutons, Parmesan cheese, Caesar dressing",
  //   category: "snack",
  //   options: ["tosted bread"],
  //   stockable: true,
  //   qty: 15,
  // },
  // {
  //   name: "Mozzarella Sticks",
  //   price: 4.99,
  //   ingredients: "Breaded mozzarella cheese sticks",
  //   category: "snack",
  //   options: ["1 + "],
  //   stockable: true,
  //   qty: 20,
  // },
  // {
  //   name: "Onion Rings",
  //   price: 3.99,
  //   ingredients: "Battered and deep-fried onion rings",
  //   category: "snack",
  //   options: ["Honey mustard"],
  //   stockable: true,
  //   qty: 25,
  // },
  // {
  //   name: "Chicken Soup",
  //   price: 4.99,
  //   ingredients: "Homemade chicken soup with vegetables",
  //   category: "snack",
  //   options: ["bread chips"],
  //   stockable: true,
  //   qty: 10,
  // },
];

// Function to populate the database with menu items
async function populateMenuItems() {
  try {
    // Delete existing menu items
    await Product.deleteMany({ category: { $in: ["food", "drink", "snack"] } });

    // Insert new menu items
    await Product.insertMany(menuItems);

    console.log("Menu items created successfully!");
  } catch (error) {
    console.error("Error creating menu items:", error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
}

// Call the populateMenuItems function to populate the menu items
populateMenuItems();