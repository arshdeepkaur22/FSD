const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// JWT Secret - use the same secret across all files
const JWT_SECRET = "fsdproject";

// Register Route
router.post("/register", async (req, res) => {
  try {
    let { username, name, email, password, role } = req.body;

    // Validate inputs
    if (!username || !name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Convert username to integer
    username = parseInt(username);
    if (isNaN(username)) {
      return res.status(400).json({ message: "Username must be a number" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Create new user WITHOUT hashing the password here
    // The User model's pre-save hook will handle the hashing
    const newUser = new User({ 
      username, 
      name, 
      email, 
      password, // Pass the plain password - it will be hashed by the pre-save hook
      role 
    });
    
    await newUser.save();

    // Generate token for the new user
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    // Return success with token
    res.status(201).json({ 
      message: "User registered successfully", 
      token, 
      userId: newUser._id, 
      role: newUser.role 
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid 2credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid cccredentials" });

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Return success with token
    res.status(200).json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Add this to your authRoutes.js temporarily
router.get("/create-test-user", async (req, res) => {
  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: "test@example.com" });
    if (existingUser) {
      return res.json({
        message: "Test user already exists",
        userId: existingUser._id,
      });
    }

    // Create a test user with a known password
    const hashedPassword = await bcrypt.hash("password123", 10);
    const testUser = new User({
      username: 12345,
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      role: "student",
    });

    await testUser.save();

    res.json({ message: "Test user created", userId: testUser._id });
  } catch (error) {
    console.error("Error creating test user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
