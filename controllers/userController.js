// Requirements
const express = require("express");

// User model
const User = require("../models/user");

// Create router
const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST login user
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Since password hashing is not required, we compare the plain text passwords directly
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Assuming login is successful, you might want to return the user data
        res.json({ user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE new user
router.post("/", async (req, res) => {
    const { Name, username, password, role } = req.body;
  
    try {
      const newUser = new User({
        Name,
        username,
        password,
        role,
      });
  
      const createdUser = await newUser.save();
      res.status(201).json(createdUser);
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error code
        res.status(400).json({ message: "Username already exists." });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  });

// UPDATE user
router.patch("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE user
router.delete("/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "Deleted user" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Export router
module.exports = router;
