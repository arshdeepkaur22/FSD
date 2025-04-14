const express = require("express");
const multer = require("multer");
const Project = require("../models/Project");
const User = require("../models/User"); 
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios");
const path = require("path");

const router = express.Router();

// Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  }
});

// Upload Project (Only Student)
router.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });

  try {
    const { 
      title, 
      description, 
      techStack, 
      category, 
      githubLink, 
      deployedLink,
      sdgGoals,
      sdgJustification,
      teamMembers // New field for team members
    } = req.body;
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // Validate GitHub repository URL if provided
    if (githubLink) {
      try {
        const url = new URL(githubLink);
        if (!url.hostname.includes('github.com')) {
          return res.status(400).json({ error: "Invalid GitHub repository URL" });
        }
      } catch (err) {
        return res.status(400).json({ error: "Invalid GitHub repository URL" });
      }
    }

    // Validate deployed link if provided
    if (deployedLink) {
      try {
        new URL(deployedLink);
      } catch (err) {
        return res.status(400).json({ error: "Invalid deployed project URL" });
      }
    }

    // Create SDG goals array from input
    let sdgGoalsArray = [];
    if (sdgGoals) {
      if (Array.isArray(sdgGoals)) {
        sdgGoalsArray = sdgGoals;
      } else if (typeof sdgGoals === 'string') {
        // Handle the case where sdgGoals might be a comma-separated string
        sdgGoalsArray = sdgGoals.split(',').map(goal => goal.trim());
      }
    }

    // Validate that if SDG goals are selected, justification is provided
    if (sdgGoalsArray.length > 0 && !sdgJustification) {
      return res.status(400).json({ error: "SDG justification is required when SDG goals are selected" });
    }

    // Parse team members if provided
    let teamMembersArray = [];
    if (teamMembers) {
      try {
        if (typeof teamMembers === 'string') {
          teamMembersArray = JSON.parse(teamMembers);
        } else if (Array.isArray(teamMembers)) {
          teamMembersArray = teamMembers;
        }
      } catch (err) {
        console.error("Error parsing team members:", err);
      }
    }

    const project = new Project({ 
      title, 
      description, 
      techStack, 
      image: imagePath, 
      student: req.user.id,
      category,
      githubLink,
      deployedLink,
      sdgGoals: sdgGoalsArray,
      sdgJustification,
      teamMembers: teamMembersArray, // Add team members to the project
      status: "In Review", // Default status for new projects
      feedback: [], // Initialize empty feedback array
      grade: "", // Initialize empty grade
    });
    
    await project.save();

    res.status(201).json({ message: "Project uploaded successfully!", project });
  } catch (error) {
    console.error("Error submitting project:", error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/:id/grade", authMiddleware, async (req, res) => {
  // Debug log
  console.log("Grade request received from user:", req.user);
  console.log("Project ID:", req.params.id);
  console.log("Grade data:", req.body);
  
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can grade projects" });
  }
  
  try {
    const { grade } = req.body;
    
    // Check if grade was provided
    if (grade === undefined || grade === null) {
      return res.status(400).json({ message: "Grade must be provided" });
    }
    
    // Validate grade format (empty string is allowed for clearing grade)
    const validGrades = ["", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];
    if (!validGrades.includes(grade)) {
      return res.status(400).json({ message: `Invalid grade value: '${grade}'. Must be one of: ${validGrades.join(", ")}` });
    }
    
    // Use findByIdAndUpdate to avoid validation issues
    // Also update the status to "Approved" if a grade is provided, or leave as is if grade is empty
    const newStatus = grade ? "Approved" : undefined;
    
    const updateFields = { grade };
    if (newStatus) {
      updateFields.status = newStatus;
    }
    
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: false }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Project graded successfully:", { 
      id: updatedProject._id, 
      grade: updatedProject.grade,
      status: updatedProject.status
    });

    res.json({ 
      message: "Project grade updated successfully",
      grade: updatedProject.grade,
      status: updatedProject.status
    });
  } catch (error) {
    console.error("Error in grade handler:", error);
    res.status(400).json({ error: error.message });
  }
});


// Like a Project
// Like a Project
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    console.log("Like request received from user:", req.user);
    console.log("Project ID:", req.params.id);
    
    // Use findByIdAndUpdate to avoid validation issues
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } }, // Increment likes by 1
      { new: true, runValidators: false }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    console.log("Project liked successfully:", {
      projectId: updatedProject._id,
      likes: updatedProject.likes
    });

    res.json({ 
      message: "Project liked successfully",
      likes: updatedProject.likes 
    });
  } catch (error) {
    console.error("Error in like handler:", error);
    res.status(400).json({ error: error.message });
  }
});
// Rate a Project (Teacher Only)
// Rate a Project (Teacher Only)
router.post("/:id/rate", authMiddleware, async (req, res) => {
  // Add debug logging
  console.log("Rate request received from user:", req.user);
  console.log("Project ID:", req.params.id);
  console.log("Rating data:", req.body);
  
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can rate projects" });
  }
  
  try {
    const { rating } = req.body;
    
    // Parse rating as a number
    const numericRating = parseInt(rating, 10);
    
    console.log("Parsed rating:", numericRating);
    
    // Validate rating
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ 
        message: `Invalid rating value: ${rating}. Must be a number between 1 and 5.`
      });
    }
    
    // Get user ID
    const userId = req.user.id;
    
    // Find if user has already rated this project
    const existingRating = await Project.findOne({
      _id: req.params.id,
      "ratings.user": userId
    });
    
    let updatedProject;
    
    if (existingRating) {
      // User has already rated, update their rating
      updatedProject = await Project.findOneAndUpdate(
        { _id: req.params.id, "ratings.user": userId },
        { $set: { "ratings.$.rating": numericRating } },
        { new: true }
      );
    } else {
      // User hasn't rated yet, add new rating
      updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { 
          $push: { 
            ratings: { user: userId, rating: numericRating } 
          }
        },
        { new: true }
      );
    }
    
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    // Calculate average rating manually
    let sumRatings = 0;
    updatedProject.ratings.forEach(r => {
      sumRatings += r.rating;
    });
    
    const avgRating = updatedProject.ratings.length > 0 ? 
      sumRatings / updatedProject.ratings.length : 0;
    
    // Update the average rating field
    updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { averageRating: avgRating },
      { new: true }
    );
    
    // Also update the project status if it's "Pending"
    if (updatedProject.status === "Pending") {
      updatedProject = await Project.findByIdAndUpdate(
        req.params.id,
        { status: "In Review" },
        { new: true }
      );
    }
    
    console.log("Project rated successfully:", {
      projectId: updatedProject._id,
      averageRating: avgRating,
      ratingsCount: updatedProject.ratings.length,
      status: updatedProject.status
    });

    res.json({ 
      message: "Rating submitted successfully",
      averageRating: avgRating,
      ratings: updatedProject.ratings.length,
      status: updatedProject.status
    });
  } catch (error) {
    console.error("Error in rating handler:", error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/students/all", authMiddleware, async (req, res) => {
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  
  try {
    // Get all students
    const students = await User.find({ role: "student" })
      .select("username name email");
    
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: error.message });
  }
});

// Provide Feedback on Project (Teacher Only)
router.post("/:id/feedback", authMiddleware, async (req, res) => {
  // Debug log
  console.log("Feedback request received from user:", req.user);
  
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can provide feedback" });
  }
  
  try {
    const { feedbackText, suggestedSdg } = req.body;
    
    // Log the feedback details for debugging
    console.log("Feedback details:", { feedbackText, suggestedSdg });
    
    // First find the project by ID without validation
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Create a new feedback object
    const newFeedback = {
      teacher: req.user.id,
      text: feedbackText,
      suggestedSdg: suggestedSdg || "",
      createdAt: new Date()
    };
    
    // Update using findByIdAndUpdate to avoid validation issues
    // This bypasses validation for fields we're not updating
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $push: { feedback: newFeedback } },
      { new: true }
    );
    
    // Populate teacher info in the response
    const populatedProject = await Project.findById(updatedProject._id)
      .populate("feedback.teacher", "username name email");

    res.json({ 
      message: "Feedback submitted successfully",
      feedback: populatedProject.feedback
    });
  } catch (error) {
    console.error("Error in feedback handler:", error);
    res.status(400).json({ error: error.message });
  }
});

// Change Project Status (Teacher Only)
router.put("/:id/status", authMiddleware, async (req, res) => {
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can update project status" });
  }
  
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "In Review", "Approved", "Rejected"];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    project.status = status;
    await project.save();

    res.json({ 
      message: `Project status updated to ${status}`,
      status: project.status 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Grade Project Team Members (Teacher Only)
router.post("/:id/grade-team", authMiddleware, async (req, res) => {
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Only teachers can grade projects" });
  }
  
  try {
    const { teamGrades } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Update team member grades
    if (!project.teamMembers) {
      project.teamMembers = [];
    }
    
    // Update grades for existing team members
    teamGrades.forEach(grade => {
      const memberIndex = project.teamMembers.findIndex(
        member => member.name === grade.name
      );
      
      if (memberIndex !== -1) {
        project.teamMembers[memberIndex].grade = grade.grade;
      }
    });
    
    await project.save();

    res.json({ 
      message: "Team grades updated successfully",
      teamMembers: project.teamMembers 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Projects with Filtering and Sorting
router.get("/", async (req, res) => {
  const { 
    category, 
    sdg,
    status,
    search,
    sortBy = 'createdAt', 
    orderBy = 'desc',
    page = 1,
    limit = 10 
  } = req.query;

  try {
    // Build query with all possible filters
    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (sdg) {
      query.sdgGoals = { $in: [sdg] };
    }
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { techStack: { $regex: search, $options: 'i' } }
      ];
    }
    
    const options = {
      sort: { [sortBy]: orderBy === 'desc' ? -1 : 1 },
      populate: { path: "student", select: "username name email" },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    };

    const projects = await Project.find(query, null, options);
    const total = await Project.countDocuments(query);

    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("student", "username name email")
      .populate("ratings.user", "username name")
      .populate("feedback.teacher", "username name");
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get GitHub Repository Info
router.get("/:id/github-info", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    if (!project.githubLink) {
      return res.status(404).json({ message: "This project has no GitHub repository" });
    }
    
    // Extract owner and repo from GitHub URL
    const url = new URL(project.githubLink);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length < 2) {
      return res.status(400).json({ message: "Invalid GitHub repository URL format" });
    }
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    // Fetch repository data from GitHub API
    try {
      const repoResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}`);
      const languagesResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/languages`);
      
      // Calculate language percentages
      const languages = languagesResponse.data;
      const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
      const languagePercentages = {};
      
      Object.entries(languages).forEach(([language, bytes]) => {
        languagePercentages[language] = Math.round((bytes / totalBytes) * 100);
      });
      
      const repoInfo = {
        name: repoResponse.data.name,
        description: repoResponse.data.description,
        stars: repoResponse.data.stargazers_count,
        forks: repoResponse.data.forks_count,
        issues: repoResponse.data.open_issues_count,
        languages: languagePercentages
      };
      
      res.json(repoInfo);
    } catch (error) {
      console.error("GitHub API error:", error.response?.data || error.message);
      res.status(500).json({ 
        message: "Error fetching GitHub repository information",
        error: error.response?.data?.message || error.message
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Projects by SDG
router.get("/sdg/:sdgGoal", async (req, res) => {
  try {
    const { sdgGoal } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const query = { sdgGoals: { $in: [sdgGoal] } };
    
    const options = {
      sort: { createdAt: -1 },
      populate: { path: "student", select: "username email name" },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    };
    
    const projects = await Project.find(query, null, options);
    const total = await Project.countDocuments(query);
    
    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get projects by student
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const options = {
      sort: { createdAt: -1 },
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit)
    };
    
    const projects = await Project.find({ student: userId }, null, options);
    const total = await Project.countDocuments({ student: userId });
    
    res.json({
      projects,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user's projects
router.get("/user/me", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ student: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students with their projects count and grades
router.get("/students/stats", authMiddleware, async (req, res) => {
  // Check if user is a teacher
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  
  try {
    console.log("Fetching students stats");
    
    // Get all students
    const students = await User.find({ role: "student" })
      .select("username name email");
      
    console.log(`Found ${students.length} students`);
    
    // For each student, get their projects count and average grade
    const studentsWithStats = await Promise.all(students.map(async (student) => {
      const projects = await Project.find({ student: student._id });
      
      console.log(`Student ${student.username}: ${projects.length} projects`);
      
      // Calculate average grade
      let totalRating = 0;
      let ratedProjects = 0;
      
      projects.forEach(project => {
        if (project.averageRating > 0) {
          totalRating += project.averageRating;
          ratedProjects++;
        }
      });
      
      const averageRating = ratedProjects > 0 ? totalRating / ratedProjects : 0;
      
      // Convert numerical grade to letter grade
      let letterGrade = "N/A";
      if (averageRating > 0) {
        if (averageRating >= 4.5) letterGrade = "A";
        else if (averageRating >= 4.0) letterGrade = "A-";
        else if (averageRating >= 3.5) letterGrade = "B+";
        else if (averageRating >= 3.0) letterGrade = "B";
        else if (averageRating >= 2.5) letterGrade = "B-";
        else if (averageRating >= 2.0) letterGrade = "C";
        else letterGrade = "D";
      }
      
      return {
        id: student._id,
        username: student.username, // This is a number (student ID)
        name: student.name,
        email: student.email,
        projectsCount: projects.length,
        averageGrade: letterGrade,
        averageRating: averageRating
      };
    }));
    
    console.log(`Returning stats for ${studentsWithStats.length} students`);
    res.json(studentsWithStats);
  } catch (error) {
    console.error("Error in students/stats endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;