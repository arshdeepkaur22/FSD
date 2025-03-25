const express = require("express");
const multer = require("multer");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Upload Project (Only Student)
router.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });

  try {
    const { title, description, techStack, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const project = new Project({ 
      title, 
      description, 
      techStack, 
      image: imagePath, 
      student: req.user.id,
      category 
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
      ratings: project.ratings 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Projects with Filtering and Sorting
router.get("/", async (req, res) => {
  const { 
    category, 
    sortBy = 'createdAt', 
    orderBy = 'desc',
    page = 1,
    limit = 10 
  } = req.query;

  try {
    const query = category ? { category } : {};
    
    const options = {
      sort: { [sortBy]: orderBy === 'desc' ? -1 : 1 },
      populate: "student",
      limit: Number(limit),
      skip: (page - 1) * limit
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

module.exports = router;