const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");  // Create this model
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { username, name, email, password, role } = req.body;

    if (!username || !name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    username = parseInt(username); // Convert to integer
    if (isNaN(username)) {
      return res.status(400).json({ message: "Username must be a number" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, "your_secret_key", { expiresIn: "1d" });

    res.status(200).json({ token, userId: user._id, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
