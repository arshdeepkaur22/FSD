const express = require("express");
const Collaboration = require("../models/Collaboration");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Create a collaboration request
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      projectDescription,
      description,
      requiredSkills,
      positionsAvailable,
      deadline
    } = req.body;

    // Create the collaboration request
    const collaboration = new Collaboration({
      title,
      projectDescription,
      description,
      requiredSkills: requiredSkills.split(',').map(skill => skill.trim()),
      positionsAvailable: parseInt(positionsAvailable, 10),
      createdBy: req.user.id,
      deadline: deadline ? new Date(deadline) : null,
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
      status = "Open", // Default to Open, but allow filtering by status
      skill,
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

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    res.json(collaboration);
  } catch (error) {
    console.error("Error fetching collaboration:", error);
    res.status(500).json({ error: error.message });
  }
});

// Apply to a collaboration request (any user can apply)
router.post("/:id/apply", authMiddleware, async (req, res) => {
  try {
    const { skills, message } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    if (collaboration.status !== "Open") {
      return res.status(400).json({ message: "This collaboration request is no longer open" });
    }

    // Check if the user has already applied
    const alreadyApplied = collaboration.applicants.some(
      applicant => applicant.user.toString() === req.user.id
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this collaboration" });
    }

    // Add the application
    collaboration.applicants.push({
      user: req.user.id,
      skills: skills.split(',').map(skill => skill.trim()),
      message,
      status: "Pending",
      appliedAt: new Date()
    });

    await collaboration.save();

    // Notify the creator about the new application (implementation placeholder)
    try {
      const creator = await User.findById(collaboration.createdBy);
      console.log(`New application notification would be sent to ${creator.email}`);
    } catch (err) {
      console.error("Error sending notification:", err);
    }

    res.status(200).json({
      message: "Application submitted successfully",
      application: collaboration.applicants[collaboration.applicants.length - 1]
    });
  } catch (error) {
    console.error("Error applying to collaboration:", error);
    res.status(400).json({ error: error.message });
  }
});

// Update application status (accept/reject)
router.put("/:id/applications/:applicationId", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    // Check if the user is the creator of the collaboration request
    if (collaboration.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to update applications" });
    }

    // Find the application
    const application = collaboration.applicants.id(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application status
    application.status = status;

    // If accepting and all positions are filled, update collaboration status
    if (status === "Accepted") {
      const acceptedApplicants = collaboration.applicants.filter(app => app.status === "Accepted");
      
      if (acceptedApplicants.length >= collaboration.positionsAvailable) {
        collaboration.status = "Filled";
      }

      // Notify the applicant about acceptance
      try {
        const applicant = await User.findById(application.user);
        console.log(`Acceptance notification would be sent to ${applicant.email}`);
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    } else if (status === "Rejected") {
      // Notify the applicant about rejection
      try {
        const applicant = await User.findById(application.user);
        console.log(`Rejection notification would be sent to ${applicant.email}`);
      } catch (err) {
        console.error("Error sending notification:", err);
      }
    }

    await collaboration.save();

    res.json({
      message: `Application ${status.toLowerCase()} successfully`,
      application
    });
  } catch (error) {
    console.error("Error updating application:", error);
    res.status(400).json({ error: error.message });
  }
});

// Close a collaboration request
router.put("/:id/close", authMiddleware, async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({ message: "Collaboration request not found" });
    }

    if (collaboration.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the creator can close this collaboration request" });
    }

    collaboration.status = "Closed";
    await collaboration.save();

    res.json({
      message: "Collaboration request closed successfully",
      collaboration
    });
  } catch (error) {
    console.error("Error closing collaboration:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get my created collaborations (with applicants)
router.get("/my/created", authMiddleware, async (req, res) => {
  try {
    const collaborations = await Collaboration.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate("applicants.user", "username email");

    res.json({ collaborations });
  } catch (error) {
    console.error("Error fetching created collaborations:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get my applications
router.get("/my/applications", authMiddleware, async (req, res) => {
  try {
    const collaborations = await Collaboration.find({
      "applicants.user": req.user.id
    })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email");

    // Format the response to include application status
    const applications = collaborations.map(collab => {
      const myApplication = collab.applicants.find(
        app => app.user.toString() === req.user.id
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
        application: {
          status: myApplication.status,
          appliedAt: myApplication.appliedAt,
          skills: myApplication.skills,
          message: myApplication.message
        }
      };
    });

    res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;