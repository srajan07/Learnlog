const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const JourneyPost = require("../models/JourneyPost");

// @desc    Create a new journey post
// @route   POST /api/community/posts
// @access  Private
const createPost = asyncHandler(async (req, res) => {
  const { title, category, workedOn, confusedBy, learned, content, image, tags } = req.body;

  if (!title || !content) {
    throw new AppError("Title and content are required fields", 400);
  }

  let formattedTags = [];
  if (Array.isArray(tags)) {
    formattedTags = tags;
  } else if (typeof tags === "string" && tags.trim().length > 0) {
    formattedTags = tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  const post = await JourneyPost.create({
    user: req.user.id,
    title,
    category: category || "Learning",
    workedOn: workedOn || "",
    confusedBy: confusedBy || "",
    learned: learned || "",
    content,
    image: image || "",
    tags: formattedTags,
  });

  const populatedPost = await JourneyPost.findById(post._id).populate(
    "user",
    "name fullName email"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedPost, "Journey post created successfully"));
});

// @desc    Get all community posts
// @route   GET /api/community/posts
// @access  Public
const getAllPosts = asyncHandler(async (req, res) => {
  const { category, tag } = req.query;
  const filter = {};

  if (category && category !== "All") {
    filter.category = category;
  }

  if (tag) {
    filter.tags = tag;
  }

  const posts = await JourneyPost.find(filter)
    .sort({ createdAt: -1 })
    .populate("user", "name fullName email");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Fetched community posts successfully"));
});

// @desc    Get current user's journey posts
// @route   GET /api/community/posts/me
// @access  Private
const getMyPosts = asyncHandler(async (req, res) => {
  const posts = await JourneyPost.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .populate("user", "name fullName email");

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Fetched user journey posts successfully"));
});

// @desc    Get a single post by ID
// @route   GET /api/community/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await JourneyPost.findById(req.params.id).populate(
    "user",
    "name fullName email"
  );

  if (!post) {
    throw new AppError("Journey post not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Fetched post details successfully"));
});

// @desc    Update a journey post
// @route   PATCH /api/community/posts/:id
// @access  Private
const updatePost = asyncHandler(async (req, res) => {
  const post = await JourneyPost.findById(req.params.id);

  if (!post) {
    throw new AppError("Journey post not found", 404);
  }

  // Authorization check: User can only update their own post
  if (post.user.toString() !== req.user.id) {
    throw new AppError("You are not authorized to update this post", 403);
  }

  const { title, category, workedOn, confusedBy, learned, content, image, tags } = req.body;

  if (title) post.title = title;
  if (category) post.category = category;
  if (workedOn !== undefined) post.workedOn = workedOn;
  if (confusedBy !== undefined) post.confusedBy = confusedBy;
  if (learned !== undefined) post.learned = learned;
  if (content) post.content = content;
  if (image !== undefined) post.image = image;
  if (tags !== undefined) {
    post.tags = Array.isArray(tags)
      ? tags
      : tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  await post.save();

  const updatedPost = await JourneyPost.findById(post._id).populate(
    "user",
    "name fullName email"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Journey post updated successfully"));
});

// @desc    Delete a journey post
// @route   DELETE /api/community/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const post = await JourneyPost.findById(req.params.id);

  if (!post) {
    throw new AppError("Journey post not found", 404);
  }

  // Authorization check: User can only delete their own post
  if (post.user.toString() !== req.user.id) {
    throw new AppError("You are not authorized to delete this post", 403);
  }

  await JourneyPost.findByIdAndDelete(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Journey post deleted successfully"));
});

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
};
