const mongoose = require('mongoose');

const managementSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  performanceMetrics: {
    participationRate: Number,
    projectQualityScore: Number,
    engagementLevel: Number,
    lastUpdated: Date
  },
  sdgContributions: [{
    sdgNumber: Number,
    contributionScore: Number,
    projectsCount: Number,
    impactDescription: String
  }],
  projectImpact: {
    educationalGoals: [{
      goal: String,
      achievement: Number,
      projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      }]
    }],
    sustainabilityGoals: [{
      goal: String,
      achievement: Number,
      projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      }]
    }]
  },
  industryPartnerships: [{
    organizationName: String,
    partnershipType: String,
    contactPerson: String,
    status: String,
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }]
  }],
  reports: [{
    reportType: String,
    period: String,
    metrics: Object,
    generatedAt: Date,
    fileUrl: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Management', managementSchema); 