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

// Add this to your authRoutes.js file
router.post("/register-admin", async (req, res) => {
  try {
    let { username, name, email, password } = req.body;
    
    // Admin secret key for added security
    const { adminSecretKey } = req.body;
    const ADMIN_SECRET = "your-admin-secret-key"; // Replace with a secure key in production
    
    if (adminSecretKey !== ADMIN_SECRET) {
      return res.status(401).json({ message: "Unauthorized admin registration attempt" });
    }

    // Validate inputs
    if (!username || !name || !email || !password) {
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

    // Create new admin user
    const newAdmin = new User({ 
      username, 
      name, 
      email, 
      password, // Will be hashed by pre-save hook
      role: "admin" 
    });
    
    await newAdmin.save();

    // Generate token for the new admin
    const token = jwt.sign(
      { id: newAdmin._id, role: newAdmin.role }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    // Return success with token
    res.status(201).json({ 
      message: "Admin registered successfully", 
      token, 
      userId: newAdmin._id, 
      role: newAdmin.role 
    });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
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

    // Add this to your authRoutes.js temporarily (for development/testing only)
router.get("/create-test-admin", async (req, res) => {
  try {
    // Check if test admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      return res.json({
        message: "Test admin already exists",
        userId: existingAdmin._id,
      });
    }

    // Create a test admin with a known password
    const hashedPassword = await bcrypt.hash("adminpassword", 10);
    const testAdmin = new User({
      username: 99999,
      name: "Test Admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    await testAdmin.save();

    res.json({ message: "Test admin created", userId: testAdmin._id });
  } catch (error) {
    console.error("Error creating test admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

    res.json({ message: "Test user created", userId: testUser._id });
  } catch (error) {
    console.error("Error creating test user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
