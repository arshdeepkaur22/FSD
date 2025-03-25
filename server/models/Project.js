const mongoose = require("mongoose");

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