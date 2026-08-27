const AptitudeAttempt = require("../models/AptitudeAttempt");
const InterviewSession = require("../models/InterviewSession");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getDashboardStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  const aptitudeAttempts = await AptitudeAttempt.find({ user: req.user.id }).sort({
    completedAt: -1,
  });

  const interviewSessions = await InterviewSession.find({
    user: req.user.id,
    status: "completed",
  }).sort({ completedAt: -1 });

  const aptitudeAttemptsCount = aptitudeAttempts.length;
  let bestAptitudeScore = 0;
  if (aptitudeAttempts.length > 0) {
    bestAptitudeScore = Math.max(...aptitudeAttempts.map((a) => a.score));
  }

  const interviewsCompleted = interviewSessions.length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name || user.fullName,
          email: user.email,
          createdAt: user.createdAt,
        },
        aptitudeAttemptsCount,
        bestAptitudeScore,
        fundamentalsCardsReviewed: 35,
        interviewsCompleted,
        latestInterview: interviewSessions[0] || null,
      },
      "Dashboard stats fetched successfully"
    )
  );
});

module.exports = {
  getDashboardStats,
};
