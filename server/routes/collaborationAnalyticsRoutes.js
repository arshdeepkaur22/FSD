const express = require("express");
const Collaboration = require("../models/Collaboration");
const router = express.Router();

// Get all collaborations with filtering (No Auth Required)
router.get("/collaborations", async (req, res) => {
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

// Get collaboration counts by various metrics (No Auth Required)
router.get("/collaborations/analytics", async (req, res) => {
  try {
    // Get total counts
    const totalCount = await Collaboration.countDocuments();
    const openCount = await Collaboration.countDocuments({ status: 'Open' });
    const closedCount = await Collaboration.countDocuments({ status: 'Closed' });
    const mentorshipCount = await Collaboration.countDocuments({ offersMentorship: true });
    
    // Get applicant stats
    const collaborations = await Collaboration.find({}, 'applicants');
    const totalApplicants = collaborations.reduce((total, collab) => {
      return total + (collab.applicants ? collab.applicants.length : 0);
    }, 0);
    
    // Get average applicants per collaboration
    const avgApplicants = collaborations.length > 0 ? 
      totalApplicants / collaborations.length : 0;
      
    // Get top skills requested
    const allCollabs = await Collaboration.find({}, 'requiredSkills');
    const skillsCount = {};
    
    allCollabs.forEach(collab => {
      if (collab.requiredSkills && collab.requiredSkills.length > 0) {
        collab.requiredSkills.forEach(skill => {
          skillsCount[skill] = (skillsCount[skill] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by count
    const topSkills = Object.entries(skillsCount)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    res.json({
      totalCollaborations: totalCount,
      openCollaborations: openCount,
      closedCollaborations: closedCount,
      mentorshipOfferings: mentorshipCount,
      totalApplicants: totalApplicants,
      averageApplicantsPerCollaboration: avgApplicants.toFixed(2),
      topRequestedSkills: topSkills
    });
  } catch (error) {
    console.error("Error fetching collaboration analytics:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;