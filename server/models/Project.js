const mongoose = require("mongoose");

// Team member schema (subdocument)
const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    enum: ["", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
    default: ""
  }
});

// Feedback schema (subdocument)
const feedbackSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    required: true
  },
  suggestedSdg: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: {
    type: String,
    required: true
  },
  githubLink: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?.*$/.test(v);
      },
      message: props => `${props.value} is not a valid GitHub repository URL!`
    }
  },
  deployedLink: {
    type: String,
    required: false,
    validate: {
      validator: function(v) {
        return !v || /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/350x200"
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    enum: ['Website', 'Game', 'Mobile App', 'AI', 'Other'],
    required: true
  },
  // Project status
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  // Overall project grade (letter grade)
  grade: {
    type: String,
    enum: ["", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"],
    default: ""
  },
  // Team members
  teamMembers: [teamMemberSchema],
  // Teacher feedback
  feedback: [feedbackSchema],
  // SDG fields
  sdgGoals: {
    type: [String],
    enum: [
      'No Poverty', 
      'Zero Hunger', 
      'Good Health and Well-being', 
      'Quality Education',
      'Gender Equality', 
      'Clean Water and Sanitation',
      'Affordable and Clean Energy',
      'Decent Work and Economic Growth',
      'Industry, Innovation, and Infrastructure',
      'Reduced Inequality',
      'Sustainable Cities and Communities',
      'Responsible Consumption and Production',
      'Climate Action',
      'Life Below Water',
      'Life on Land',
      'Peace, Justice, and Strong Institutions',
      'Partnerships for the Goals'
    ],
    required: true
  },
  sdgJustification: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Middleware to calculate average rating
projectSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0) / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);