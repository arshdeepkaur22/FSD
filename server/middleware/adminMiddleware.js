
const User = require("../models/User");

// Middleware to check if user is an admin
const adminMiddleware = async (req, res, next) => {
  try {
    // Check if user exists and is authenticated (from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch the user from the database to double-check their role
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // User is authenticated and is an admin
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = adminMiddleware;