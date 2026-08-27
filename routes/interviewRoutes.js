const express = require("express");
const router = express.Router();
const {
  startInterview,
  submitInterview,
  getInterviewById,
} = require("../controllers/interviewController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/start", authMiddleware, startInterview);
router.post("/submit", authMiddleware, submitInterview);
router.get("/:id", authMiddleware, getInterviewById);

module.exports = router;
