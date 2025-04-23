const express = require('express');
const router = express.Router();
const Management = require('../models/managementModel');
const auth = require('../middleware/auth');

// Get management dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const managementData = await Management.findOne({ institutionId: req.user.id });
    if (!managementData) {
      return res.status(404).json({ message: 'Management data not found' });
    }
    res.json(managementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update performance metrics
router.put('/performance', auth, async (req, res) => {
  try {
    const { participationRate, projectQualityScore, engagementLevel } = req.body;
    const managementData = await Management.findOneAndUpdate(
      { institutionId: req.user.id },
      {
        'performanceMetrics': {
          participationRate,
          projectQualityScore,
          engagementLevel,
          lastUpdated: new Date()
        }
      },
      { new: true }
    );
    res.json(managementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add SDG contribution
router.post('/sdg', auth, async (req, res) => {
  try {
    const managementData = await Management.findOneAndUpdate(
      { institutionId: req.user.id },
      { $push: { sdgContributions: req.body } },
      { new: true }
    );
    res.json(managementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add industry partnership
router.post('/partnerships', auth, async (req, res) => {
  try {
    const managementData = await Management.findOneAndUpdate(
      { institutionId: req.user.id },
      { $push: { industryPartnerships: req.body } },
      { new: true }
    );
    res.json(managementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate report
router.post('/reports', auth, async (req, res) => {
  try {
    const report = {
      ...req.body,
      generatedAt: new Date()
    };
    const managementData = await Management.findOneAndUpdate(
      { institutionId: req.user.id },
      { $push: { reports: report } },
      { new: true }
    );
    res.json(managementData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 