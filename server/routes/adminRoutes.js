const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMIddleware");

// Apply middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard Overview
router.get("/dashboard", adminController.getDashboardOverview);

// User Management Routes
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.post("/users", adminController.createUser);

// Project Moderation Routes
router.get("/projects", adminController.getAllProjects);
router.put("/projects/:id/status", adminController.updateProjectStatus);

// Content Organization Routes
router.get("/categories", adminController.getCategories);
router.get("/sdg-stats", adminController.getSdgStats);
router.put("/categories", adminController.updateCategory);

// Leaderboard Routes
router.get("/leaderboard", adminController.getLeaderboardData);

// Notifications Routes
router.get("/notifications", adminController.getAllNotifications);
router.post("/notifications", adminController.createNotification);

// Reports Routes
router.get("/reports", adminController.getReportData);

// SDG Tracking Routes
router.get("/sdg-tracking", adminController.getSdgTrackingData);

// Admin Activity Routes
router.get("/activities", adminController.getAdminActivities);

module.exports = router;