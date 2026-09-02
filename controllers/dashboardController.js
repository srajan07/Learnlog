const User = require("../models/User");

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getDashboardStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json(
      new ApiResponse(404, null, "User not found")
    );
  }

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
      },
      "Dashboard data fetched successfully"
    )
  );
});

module.exports = {
  getDashboardStats,
};