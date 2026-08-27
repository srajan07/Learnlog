const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/communityController");

// Public / Authenticated routes
router.get("/", getAllPosts);
router.get("/me", authMiddleware, getMyPosts);
router.get("/:id", getPostById);

// Protected CRUD routes
router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
