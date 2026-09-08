const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleReaction,
} = require("../controllers/communityController");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");

router.get("/posts",   optionalAuthMiddleware,getAllPosts);

router.get("/posts/me", authMiddleware, getMyPosts);

router.get(
  "/posts/:id",
  optionalAuthMiddleware,
  getPostById
);

router.post(
  "/posts",
  authMiddleware,
  upload.single("image"),
  createPost
);

router.patch(
  "/posts/:id",
  authMiddleware,
  upload.single("image"),
  updatePost
);

router.delete(
  "/posts/:id",
  authMiddleware,
  deletePost
);
router.post("/posts/:id/reaction",authMiddleware,toggleReaction);

module.exports = router;