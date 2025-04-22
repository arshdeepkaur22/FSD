const User = require("../models/User");
const Project = require("../models/Project");
const Collaboration = require("../models/Collaboration");
const AdminActivity = require("../models/AdminActivity");

// Helper function to log admin activity
const logAdminActivity = async (adminId, action, details, targetId = null, targetModel = null) => {
  try {
    const activity = new AdminActivity({
      admin: adminId,
      action,
      details,
      targetId,
      targetModel
    });
    await activity.save();
  } catch (error) {
    console.error("Error logging admin activity:", error);
  }
};

// User Management Controllers
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, search, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const options = {
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      select: "-password" // Exclude password
    };
    
    const users = await User.find(query, null, options);
    const total = await User.countDocuments(query);
    
    await logAdminActivity(req.user.id, "user_management", "Viewed user list");
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    await logAdminActivity(
      req.user.id, 
      "user_management", 
      `Viewed user details for ${user.username}`,
      user._id,
      "User"
    );
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, email, name, role, status } = req.body;
    
    // Find user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (name) user.name = name;
    if (role) user.role = role;
    if (status) user.status = status;
    
    await user.save();
    
    await logAdminActivity(
      req.user.id, 
      "user_management", 
      `Updated user ${user.username}`,
      user._id,
      "User"
    );
    
    res.json({ 
      message: "User updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Store user info for logging
    const userInfo = {
      id: user._id,
      username: user.username
    };
    
    await User.findByIdAndDelete(req.params.id);
    
    await logAdminActivity(
      req.user.id, 
      "user_management", 
      `Deleted user ${userInfo.username}`,
      userInfo.id,
      "User"
    );
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, name, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: "User with this email or username already exists" 
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password, // Will be hashed by the User model
      name,
      role: role || "student",
      status: "active"
    });
    
    await user.save();
    
    await logAdminActivity(
      req.user.id, 
      "user_management", 
      `Created new user ${username} with role ${role || "student"}`,
      user._id,
      "User"
    );
    
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
};

// Project Moderation Controllers
exports.getAllProjects = async (req, res) => {
  try {
    const { 
      status, 
      category, 
      sdg, 
      search, 
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build query
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (sdg) {
      query.sdgGoals = { $in: [sdg] };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Pagination
    const options = {
      sort: { createdAt: -1 },
      populate: { path: "student", select: "username name email" },
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    };
    
    const projects = await Project.find(query, null, options);
    const total = await Project.countDocuments(query);
    
    await logAdminActivity(req.user.id, "project_moderation", "Viewed project list");
    
    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProjectStatus = async (req, res) => {
  try {
    const { status, adminFeedback } = req.body;
    
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Update status
    project.status = status;
    
    // Add admin feedback if provided
    if (adminFeedback) {
      project.feedback.push({
        teacher: req.user.id, // Using teacher field for admin
        text: adminFeedback,
        createdAt: new Date()
      });
    }
    
    await project.save();
    
    await logAdminActivity(
      req.user.id, 
      "project_moderation", 
      `Updated project status to ${status} for project "${project.title}"`,
      project._id,
      "Project"
    );
    
    res.json({ 
      message: "Project status updated successfully",
      project: {
        _id: project._id,
        title: project.title,
        status: project.status
      }
    });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(400).json({ error: error.message });
  }
};

// Content Organization Controllers
exports.getCategories = async (req, res) => {
  try {
    // Aggregate projects by category
    const categories = await Project.aggregate([
      { $group: { 
        _id: "$category", 
        count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } }
    ]);
    
    // Format the response
    const formattedCategories = categories.map(cat => ({
      name: cat._id || "Uncategorized",
      count: cat.count
    }));
    
    await logAdminActivity(req.user.id, "content_organization", "Viewed categories");
    
    res.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSdgStats = async (req, res) => {
  try {
    // Aggregate projects by SDG goals
    const sdgStats = await Project.aggregate([
      { $unwind: "$sdgGoals" },
      { $group: { 
        _id: "$sdgGoals", 
        count: { $sum: 1 } 
      }},
      { $sort: { count: -1 } }
    ]);
    
    // Format the response
    const formattedStats = sdgStats.map(stat => ({
      name: stat._id,
      count: stat.count
    }));
    
    await logAdminActivity(req.user.id, "content_organization", "Viewed SDG statistics");
    
    res.json(formattedStats);
  } catch (error) {
    console.error("Error fetching SDG stats:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { oldCategory, newCategory } = req.body;
    
    // Update all projects with the old category
    const result = await Project.updateMany(
      { category: oldCategory },
      { $set: { category: newCategory } }
    );
    
    await logAdminActivity(
      req.user.id, 
      "content_organization", 
      `Updated category from "${oldCategory}" to "${newCategory}"`
    );
    
    res.json({ 
      message: "Category updated successfully",
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(400).json({ error: error.message });
  }
};

// Leaderboard Controllers
exports.getLeaderboardData = async (req, res) => {
  try {
    // Get top projects by likes and ratings
    const topProjects = await Project.find({})
      .sort({ likes: -1, averageRating: -1 })
      .limit(10)
      .populate("student", "username name");
    
    // Get top students by project count and average rating
    const topStudents = await User.aggregate([
      { $match: { role: "student" } },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "student",
          as: "projects"
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          name: 1,
          projectCount: { $size: "$projects" },
          averageRating: { 
            $avg: "$projects.averageRating" 
          }
        }
      },
      { $sort: { projectCount: -1, averageRating: -1 } },
      { $limit: 10 }
    ]);
    
    await logAdminActivity(req.user.id, "user_management", "Viewed leaderboard data");
    
    res.json({
      topProjects,
      topStudents
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ error: error.message });
  }
};

// Notifications Controllers
exports.getAllNotifications = async (req, res) => {
  try {
    // Assuming you have a Notification model
    // If not, you'll need to create one
    const notifications = [
      {
        id: 1,
        title: "Project Submission Deadline",
        message: "Reminder: The deadline for submitting projects for the Spring Showcase is May 15th, 2023.",
        type: "announcement",
        date: "2023-05-01",
        sentTo: "All Users",
        status: "sent",
      },
      {
        id: 2,
        title: "Platform Maintenance",
        message:
          "The platform will be undergoing maintenance on Saturday, May 6th from 2AM to 5AM UTC. Some features may be unavailable during this time.",
        type: "alert",
        date: "2023-05-03",
        sentTo: "All Users",
        status: "sent",
      },
      {
        id: 3,
        title: "New SDG Category Added",
        message:
          "We have added a new category for SDG 14: Life Below Water. Projects related to ocean conservation and marine ecosystems can now be tagged with this category.",
        type: "update",
        date: "2023-05-05",
        sentTo: "All Users",
        status: "sent",
      },
      {
        id: 4,
        title: "Faculty Evaluation Period",
        message:
          "Faculty members are reminded that the project evaluation period begins on May 10th and ends on May 20th.",
        type: "announcement",
        date: "2023-05-08",
        sentTo: "Faculty",
        status: "sent",
      },
      {
        id: 5,
        title: "Student Workshop: SDG Integration",
        message:
          "Join us for a virtual workshop on how to effectively integrate SDGs into your projects. The workshop will be held on May 12th at 3PM UTC.",
        type: "announcement",
        date: "2023-05-10",
        sentTo: "Students",
        status: "scheduled",
        scheduledDate: "2023-05-11",
      },
    ];
    
    await logAdminActivity(req.user.id, "notification", "Viewed notification list");
    
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, recipients, scheduledDate } = req.body;
    
    // In a real implementation, you would save this to a Notification model
    // For now, we'll just return a success message
    
    await logAdminActivity(
      req.user.id, 
      "notification", 
      `Created new ${type} notification: "${title}"`
    );
    
    res.status(201).json({
      message: "Notification created successfully",
      notification: {
        title,
        message,
        type,
        recipients,
        scheduledDate,
        createdAt: new Date(),
        status: scheduledDate ? "scheduled" : "sent"
      }
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(400).json({ error: error.message });
  }
};

// Reports Controllers
exports.getReportData = async (req, res) => {
  try {
    const { reportType, timeframe } = req.query;
    
    // Get date range based on timeframe
    const endDate = new Date();
    let startDate = new Date();
    
    if (timeframe === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate.setFullYear(startDate.getFullYear() - 1);
    } else {
      // Default to last 30 days
      startDate.setDate(startDate.getDate() - 30);
    }
    
    let reportData = {};
    
    if (reportType === "projects") {
      // Project submission trends
      const projectTrends = await Project.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      reportData.projectTrends = projectTrends;
      
      // Project categories distribution
      const categoryDistribution = await Project.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      reportData.categoryDistribution = categoryDistribution;
    } 
    else if (reportType === "users") {
      // User registration trends
      const userTrends = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      
      reportData.userTrends = userTrends;
      
      // User role distribution
      const roleDistribution = await User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 }
          }
        }
      ]);
      
      reportData.roleDistribution = roleDistribution;
    }
    else if (reportType === "sdg") {
      // SDG distribution
      const sdgDistribution = await Project.aggregate([
        { $unwind: "$sdgGoals" },
        {
          $group: {
            _id: "$sdgGoals",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      reportData.sdgDistribution = sdgDistribution;
    }
    else {
      // Overview report with key metrics
      const totalProjects = await Project.countDocuments();
      const totalUsers = await User.countDocuments();
      const totalStudents = await User.countDocuments({ role: "student" });
      const totalTeachers = await User.countDocuments({ role: "teacher" });
      
      // Recent project submissions
      const recentProjects = await Project.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("student", "username name");
      
      reportData = {
        metrics: {
          totalProjects,
          totalUsers,
          totalStudents,
          totalTeachers
        },
        recentProjects
      };
    }
    
    await logAdminActivity(
      req.user.id, 
      "report_generation", 
      `Generated ${reportType || "overview"} report for ${timeframe || "default"} timeframe`
    );
    
    res.json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
};

// SDG Tracking Controllers
exports.getSdgTrackingData = async (req, res) => {
  try {
    // Get all SDGs with project counts
    const sdgData = await Project.aggregate([
      { $unwind: "$sdgGoals" },
      {
        $group: {
          _id: "$sdgGoals",
          projectCount: { $sum: 1 },
          projects: { $push: "$_id" }
        }
      },
      { $sort: { projectCount: -1 } }
    ]);
    
    // Get student counts for each SDG
    const sdgWithStudents = await Promise.all(sdgData.map(async (sdg) => {
      const studentCount = await Project.distinct("student", {
        _id: { $in: sdg.projects }
      }).then(students => students.length);
      
      return {
        name: sdg._id,
        projectCount: sdg.projectCount,
        studentCount,
        impact: getImpactLevel(sdg.projectCount)
      };
    }));
    
    await logAdminActivity(req.user.id, "sdg_tracking", "Viewed SDG tracking data");
    
    res.json(sdgWithStudents);
  } catch (error) {
    console.error("Error fetching SDG tracking data:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to determine impact level
function getImpactLevel(count) {
  if (count >= 100) return "Very High";
  if (count >= 70) return "High";
  if (count >= 40) return "Medium";
  return "Low";
}

// Admin Activity Controllers
exports.getAdminActivities = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const activities = await AdminActivity.find()
      .sort({ timestamp: -1 })
      .populate("admin", "username name")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    
    const total = await AdminActivity.countDocuments();
    
    res.json({
      activities,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error("Error fetching admin activities:", error);
    res.status(500).json({ error: error.message });
  }
};

// Dashboard Overview
exports.getDashboardOverview = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const pendingProjects = await Project.countDocuments({ status: "In Review" });
    const totalCollaborations = await Collaboration.countDocuments();
    
    // Get recent activities
    const recentActivities = await AdminActivity.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .populate("admin", "username");
    
    // Get user role distribution
    const userRoles = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get project status distribution
    const projectStatuses = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    await logAdminActivity(req.user.id, "user_management", "Viewed admin dashboard overview");
    
    res.json({
      counts: {
        totalUsers,
        totalProjects,
        pendingProjects,
        totalCollaborations
      },
      recentActivities,
      userRoles,
      projectStatuses
    });
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    res.status(500).json({ error: error.message });
  }
};