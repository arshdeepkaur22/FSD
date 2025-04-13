// models/Collaboration.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollaborationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  projectDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    default: []
  },
  positionsAvailable: {
    type: Number,
    required: true,
    min: 1
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deadline: {
    type: Date,
    default: null
  },
  githubRepository: {
    type: String
  },
  offersMentorship: {
    type: Boolean,
    default: false
  },
  sdgGoals: {
    type: [String],
    default: []
  },
  sdgJustification: {
    type: String
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Filled'],
    default: 'Open'
  },
  applicants: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    skills: [String],
    message: String,
    githubProfile: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentorshipRequests: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    topic: String,
    description: String,
    preferredTimeSlots: String,
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending'
    },
    mentorMessage: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Collaboration', CollaborationSchema);