const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const router = express.Router();

// Get all projects with filtering and sorting (No Auth Required)
router.get("/projects", async (req, res) => {
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

// Get student statistics (No Auth Required)
router.get("/students/stats", async (req, res) => {
  try {
    console.log("Fetching students stats (public endpoint)");
    
    // Get all students
    const students = await User.find({ role: "student" })
      .select("username name email");
      
    console.log(`Found ${students.length} students`);
    
    // For each student, get their projects count and average grade
    const studentsWithStats = await Promise.all(students.map(async (student) => {
      const projects = await Project.find({ student: student._id });
      
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

// Get projects by SDG (No Auth Required)
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

// Get projects by student (No Auth Required) 
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

module.exports = router;