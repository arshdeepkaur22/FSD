const jwt = require("jsonwebtoken");

// Use the same secret as in your auth routes
const JWT_SECRET = 'fsdproject';


const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    // Extract the token from "Bearer [token]" format
    const tokenValue = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
    
    // Verify the token
    const decoded = jwt.verify(tokenValue, JWT_SECRET);
    
    // Set the user data in the request
    req.user = decoded;
    
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;