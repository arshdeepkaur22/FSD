const mongoose = require("mongoose");

const adminActivitySchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ["user_management", "project_moderation", "content_organization", "notification", "report_generation", "sdg_tracking"]
  },
  details: {
    type: String,
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "targetModel"
  },
  targetModel: {
    type: String,
    enum: ["User", "Project", "Collaboration", null]
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const AdminActivity = mongoose.model("AdminActivity", adminActivitySchema);

module.exports = AdminActivity;