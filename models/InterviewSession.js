const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: "" },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      default: "sde-fresher",
    },
    technicalAnswers: [answerSchema],
    hrAnswers: [answerSchema],
    report: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
