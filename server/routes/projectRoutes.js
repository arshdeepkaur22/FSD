const express = require("express");
const multer = require("multer");
const Project = require("../models/Project");
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
      sdgJustification
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
      sdgJustification
    });
    
    await project.save();

    res.status(201).json({ message: "Project uploaded successfully!", project });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like a Project
router.post("/:id/like", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Prevent multiple likes from same user (optional - can be implemented with more complex logic)
    project.likes += 1;
    await project.save();

    res.json({ likes: project.likes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rate a Project
router.post("/:id/rate", authMiddleware, async (req, res) => {
  try {
    const { rating } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    // Check if user has already rated
    const existingRatingIndex = project.ratings.findIndex(
      r => r.user.toString() === req.user.id
    );

    if (existingRatingIndex > -1) {
      // Update existing rating
      project.ratings[existingRatingIndex].rating = rating;
    } else {
      // Add new rating
      project.ratings.push({
        user: req.user.id,
        rating
      });
    }

    await project.save();

    res.json({ 
      averageRating: project.averageRating,
      ratings: project.ratings.length 
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
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { techStack: { $regex: search, $options: 'i' } }
      ];
    }
    
    const options = {
      sort: { [sortBy]: orderBy === 'desc' ? -1 : 1 },
      populate: { path: "student", select: "username email" },
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
      .populate("student", "username name email") // Populate with all possible fields
    
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
      populate: { path: "student", select: "username email" },
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

module.exports = router;