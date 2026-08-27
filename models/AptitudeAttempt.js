const mongoose = require("mongoose");

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 30,
    },
    percentage: {
      type: Number,
      required: true,
    },
    categoryScores: {
      type: Map,
      of: Number,
      default: {},
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AptitudeAttempt", aptitudeAttemptSchema);
