// routes/collabRoutes.js
const express = require("express");
const Collaboration = require("../models/Collaboration");
const User = require("../models/User");
const axios = require("axios");

const router = express.Router();

// Create a collaboration request
router.post("/create", async (req, res) => {
  try {
    const {
      title,
      projectDescription,
      description,
      requiredSkills,
      positionsAvailable,
      deadline,
      githubRepository,
      offersMentorship,
      sdgGoals,
      sdgJustification,
      createdBy
    } = req.body;

    // Validate GitHub repository if provided
    if (githubRepository) {
      try {
        // Simple validation to check if repo exists
        const githubUrl = new URL(githubRepository);
        if (!githubUrl.hostname.includes('github.com')) {
          return res.status(400).json({ error: "Invalid GitHub repository URL" });
        }
      } catch (err) {
        return res.status(400).json({ error: "Invalid GitHub repository URL" });
      }
    }

    // Create the collaboration request
    const collaboration = new Collaboration({
      title,
      projectDescription,
      description,
      requiredSkills: Array.isArray(requiredSkills) 
        ? requiredSkills 
        : (requiredSkills ? requiredSkills.split(',').map(skill => skill.trim()) : []),
      positionsAvailable: parseInt(positionsAvailable, 10),
      createdBy,
      deadline: deadline ? new Date(deadline) : null,
      githubRepository,
      offersMentorship: offersMentorship === 'true' || offersMentorship === true,
      sdgGoals: sdgGoals || [],
      sdgJustification,
      status: "Open"
    });

    await collaboration.save();

    res.status(201).json({
      message: "Collaboration request created successfully",
      collaboration
    });
  } catch (error) {
    console.error("Error creating collaboration request:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get all collaboration requests (with optional filters)
router.get("/", async (req, res) => {
  try {
    const {
      status,
      skill,
      sdg,
      offersMentorship,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};
    
    // Only filter by status if explicitly provided
    if (status) {
      query.status = status;
    }

    // Filter by skill if provided
    if (skill) {
      query.requiredSkills = { $in: [skill] };
    }

    // Filter by SDG if provided
    if (sdg) {
      query.sdgGoals = { $in: [sdg] };
    }

    // Filter by mentorship availability
    if (offersMentorship) {
      query.offersMentorship = offersMentorship === 'true';
    }

    const options = {
      sort: { createdAt: -1 },
      populate: { path: "createdBy", select: "username" },
      limit: parseInt(limit, 10),
      skip: (parseInt(page, 10) - 1) * parseInt(limit, 10)
    };

    const collaborations = await Collaboration.find(query, null, options);
    const total = await Collaboration.countDocuments(query);

    res.json({
      collaborations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page, 10)
    });
  } catch (error) {
    console.error("Error fetching collaborations:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get collaboration request by ID
router.get("/:id", async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("applicants.user", "username email");
    
    // Only populate mentorshipRequests if they exist in the schema
    if (collaboration && collaboration.mentorshipRequests && collaboration.mentorshipRequests.length > 0) {
      await Collaboration.populate(collaboration, {
        path: "mentorshipRequests.user",
        select: "username email"
      });
    }

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    res.json(collaboration);
  } catch (error) {
    console.error("Error fetching collaboration:", error);
    res.status(500).json({ error: error.message });
  }
});

// Apply to a collaboration request
router.post("/:id/apply", async (req, res) => {
  try {
    const { skills, message, githubProfile, userId } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    if (collaboration.status !== "Open") {
      return res.status(400).json({ message: "This collaboration request is no longer open" });
    }

    // Add the application
    collaboration.applicants.push({
      user: userId || "6428a1b23bc9b2f4c9c62a8f", // Use provided ID or default
      skills: typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()) : skills,
      message,
      githubProfile,
      status: "Pending",
      appliedAt: new Date()
    });

    await collaboration.save();

    res.status(200).json({
      message: "Application submitted successfully",
      application: collaboration.applicants[collaboration.applicants.length - 1]
    });
  } catch (error) {
    console.error("Error applying to collaboration:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get my created collaborations
router.get("/my/created", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const creatorId = userId;

    // Find collaborations without populating mentorshipRequests first
    const collaborations = await Collaboration.find({ createdBy: creatorId })
      .sort({ createdAt: -1 })
      .populate("applicants.user", "username email");
    
    // Only populate mentorshipRequests if needed and they exist in the documents
    for (let collab of collaborations) {
      if (collab.mentorshipRequests && collab.mentorshipRequests.length > 0) {
        try {
          await Collaboration.populate(collab, {
            path: "mentorshipRequests.user",
            select: "username email"
          });
        } catch (populateError) {
          console.warn("Couldn't populate mentorshipRequests:", populateError.message);
        }
      }
    }

    res.json({ collaborations });
  } catch (error) {
    console.error("Error fetching created collaborations:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get my applications
router.get("/my/applications", async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    
    const applicantId = userId;

    // Get collaborations where I applied
    const appliedCollaborations = await Collaboration.find({
      "applicants.user": applicantId
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email");

    // Format the applications response
    const applications = appliedCollaborations.map(collab => {
      const myApplication = collab.applicants.find(
        app => app.user.toString() === applicantId
      );
      
      return {
        collaboration: {
          _id: collab._id,
          title: collab.title,
          projectDescription: collab.projectDescription,
          createdBy: collab.createdBy,
          status: collab.status,
          createdAt: collab.createdAt,
          githubRepository: collab.githubRepository
        },
        application: {
          status: myApplication.status,
          appliedAt: myApplication.appliedAt,
          skills: myApplication.skills,
          message: myApplication.message,
          githubProfile: myApplication.githubProfile
        }
      };
    });

    // Get mentorship requests
    // Since we're having schema issues, let's check if we can access them
    let mentorshipRequests = [];
    try {
      const mentorshipCollaborations = await Collaboration.find({
        "mentorshipRequests.user": applicantId
      })
        .sort({ createdAt: -1 })
        .populate("createdBy", "username email");
      
      mentorshipRequests = mentorshipCollaborations.map(collab => {
        const myRequest = collab.mentorshipRequests.find(
          req => req.user.toString() === applicantId
        );
        
        return {
          collaboration: {
            _id: collab._id,
            title: collab.title,
            projectDescription: collab.projectDescription,
            createdBy: collab.createdBy,
            status: collab.status,
            createdAt: collab.createdAt
          },
          request: myRequest
        };
      });
    } catch (mentorshipError) {
      console.warn("Error fetching mentorship requests:", mentorshipError);
      // Continue without mentorship requests
    }

    res.json({ 
      applications,
      mentorshipRequests
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: error.message });
  }
});

// Close collaboration
router.put("/:id/close", async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);
    
    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }
    
    collaboration.status = "Closed";
    await collaboration.save();
    
    res.json({ message: "Collaboration request closed successfully" });
  } catch (error) {
    console.error("Error closing collaboration:", error);
    res.status(500).json({ error: error.message });
  }
});



router.post("/:id/mentorship", async (req, res) => {
  try {
    const { topic, description, preferredTimeSlots, userId } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    if (!collaboration.offersMentorship) {
      return res.status(400).json({ message: "This collaboration does not offer mentorship" });
    }

    // Initialize mentorshipRequests array if it doesn't exist
    if (!collaboration.mentorshipRequests) {
      collaboration.mentorshipRequests = [];
    }

    // Add the mentorship request
    collaboration.mentorshipRequests.push({
      user: userId,
      topic,
      description,
      preferredTimeSlots,
      status: "Pending",
      createdAt: new Date()
    });

    await collaboration.save();

    res.status(200).json({
      message: "Mentorship request submitted successfully",
      request: collaboration.mentorshipRequests[collaboration.mentorshipRequests.length - 1]
    });
  } catch (error) {
    console.error("Error requesting mentorship:", error);
    res.status(400).json({ error: error.message });
  }
});

// Respond to mentorship request
router.put("/:id/mentorship/:requestId", async (req, res) => {
  try {
    const { status, mentorMessage } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    // Find the mentorship request
    const mentorshipRequestIndex = collaboration.mentorshipRequests.findIndex(
      (request) => request._id.toString() === req.params.requestId
    );

    if (mentorshipRequestIndex === -1) {
      return res.status(404).json({ message: "Mentorship request not found" });
    }

    // Update the mentorship request
    collaboration.mentorshipRequests[mentorshipRequestIndex].status = status;
    if (mentorMessage) {
      collaboration.mentorshipRequests[mentorshipRequestIndex].mentorMessage = mentorMessage;
    }

    await collaboration.save();

    res.json({
      message: `Mentorship request ${status.toLowerCase()} successfully`,
      request: collaboration.mentorshipRequests[mentorshipRequestIndex]
    });
  } catch (error) {
    console.error("Error responding to mentorship request:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/mentorship/all-pending", async (req, res) => {
  try {
    // Find all collaborations that have pending mentorship requests
    const collaborations = await Collaboration.find({
      "mentorshipRequests.status": "Pending"
    })
    .populate("createdBy", "username email")
    .populate("mentorshipRequests.user", "username email");
    
    // Extract all pending mentorship requests with their collaboration info
    const allRequests = [];
    
    collaborations.forEach(collab => {
      const pendingRequests = collab.mentorshipRequests
        .filter(req => req.status === "Pending")
        .map(req => ({
          _id: req._id,
          topic: req.topic || "No topic provided",
          description: req.description || "No description provided",
          preferredTimeSlots: req.preferredTimeSlots || "",
          status: req.status,
          createdAt: req.createdAt,
          user: req.user,
          collaboration: {
            _id: collab._id,
            title: collab.title,
            createdBy: collab.createdBy
          }
        }));
      
      allRequests.push(...pendingRequests);
    });
    
    res.json({ requests: allRequests });
  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all active mentorship requests (for teachers)
router.get("/mentorship/all-active", async (req, res) => {
  try {
    // Find all collaborations that have accepted mentorship requests
    const collaborations = await Collaboration.find({
      "mentorshipRequests.status": "Accepted"
    })
    .populate("createdBy", "username email")
    .populate("mentorshipRequests.user", "username email");
    
    // Extract all accepted mentorship requests with their collaboration info
    const allRequests = [];
    
    collaborations.forEach(collab => {
      const acceptedRequests = collab.mentorshipRequests
        .filter(req => req.status === "Accepted")
        .map(req => ({
          _id: req._id,
          topic: req.topic || "No topic provided",
          description: req.description || "No description provided",
          preferredTimeSlots: req.preferredTimeSlots || "",
          status: req.status,
          mentorMessage: req.mentorMessage || "",
          createdAt: req.createdAt,
          user: req.user,
          collaboration: {
            _id: collab._id,
            title: collab.title,
            createdBy: collab.createdBy
          }
        }));
      
      allRequests.push(...acceptedRequests);
    });
    
    res.json({ requests: allRequests });
  } catch (error) {
    console.error("Error fetching active mentorship requests:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;