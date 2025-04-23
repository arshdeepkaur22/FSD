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
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

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

// Create test admin user
router.get("/create-admin", async (req, res) => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      return res.json({
        message: "Admin user already exists",
        email: "admin@example.com",
        password: "admin123"
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      username: 12345,
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });

    await adminUser.save();

    res.json({ 
      message: "Admin user created successfully", 
      email: "admin@example.com",
      password: "admin123"
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
