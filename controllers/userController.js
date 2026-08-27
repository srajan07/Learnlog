const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/User");
const ApiResponse = require("../utils/ApiResponse");

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, fullName } = req.body;

  const updates = {};
  if (name) updates.name = name;
  if (fullName) updates.name = fullName;

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile updated successfully"));
});

module.exports = {
  getProfile,
  updateProfile,
};