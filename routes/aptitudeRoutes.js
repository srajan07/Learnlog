const express = require("express");
const router = express.Router();
const {
  saveAttempt,
  getAttemptHistory,
} = require("../controllers/aptitudeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/attempt", authMiddleware, saveAttempt);
router.get("/history", authMiddleware, getAttemptHistory);

module.exports = router;
