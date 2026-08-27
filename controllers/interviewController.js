const InterviewSession = require("../models/InterviewSession");
const { generateInterviewReport } = require("../services/geminiReportService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const AppError = require("../utils/AppError");

// Start a new SDE Fresher Interview Session
const startInterview = asyncHandler(async (req, res) => {
  const session = await InterviewSession.create({
    user: req.user.id,
    type: "sde-fresher",
    status: "in-progress",
    startedAt: new Date(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, session, "Interview session started"));
});

// Submit Complete Interview (Technical + HR) -> Triggers ONE Gemini API Call
const submitInterview = asyncHandler(async (req, res) => {
  const { sessionId, technicalAnswers = [], hrAnswers = [] } = req.body;

  let session;
  if (sessionId) {
    session = await InterviewSession.findById(sessionId);
  }

  if (!session) {
    session = new InterviewSession({
      user: req.user.id,
      type: "sde-fresher",
      startedAt: new Date(),
    });
  }

  session.technicalAnswers = technicalAnswers;
  session.hrAnswers = hrAnswers;
  session.status = "completed";
  session.completedAt = new Date();

  // Generate 1-Call Gemini AI Report (with robust error fallback)
  const report = await generateInterviewReport(technicalAnswers, hrAnswers);
  session.report = report;

  await session.save();

  return res
    .status(200)
    .json(new ApiResponse(200, session, "Interview submitted and evaluated successfully"));
});

// Get Interview Session by ID
const getInterviewById = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!session) {
    throw new AppError("Interview session not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, session, "Interview session fetched successfully"));
});

module.exports = {
  startInterview,
  submitInterview,
  getInterviewById,
};
