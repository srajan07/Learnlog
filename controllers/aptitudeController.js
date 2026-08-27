const AptitudeAttempt = require("../models/AptitudeAttempt");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

// Save Aptitude Mock Attempt
const saveAttempt = asyncHandler(async (req, res) => {
  const { score, totalQuestions = 30, percentage, categoryScores } = req.body;

  const attempt = await AptitudeAttempt.create({
    user: req.user.id,
    score,
    totalQuestions,
    percentage: percentage ?? Math.round((score / totalQuestions) * 100),
    categoryScores: categoryScores || {},
    completedAt: new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, attempt, "Aptitude attempt saved successfully"));
});

// Get Aptitude Attempt History
const getAttemptHistory = asyncHandler(async (req, res) => {
  const attempts = await AptitudeAttempt.find({ user: req.user.id }).sort({
    completedAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, attempts, "Aptitude history fetched successfully"));
});

module.exports = {
  saveAttempt,
  getAttemptHistory,
};
