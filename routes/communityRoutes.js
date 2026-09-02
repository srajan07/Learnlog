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
} = require("../controllers/communityController");

router.get("/posts", getAllPosts);

router.get("/posts/me", authMiddleware, getMyPosts);

router.get("/posts/:id", getPostById);

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

module.exports = router;