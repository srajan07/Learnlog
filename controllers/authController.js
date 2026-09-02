const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/otpGenerator");
const ApiResponse = require("../utils/ApiResponse");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const emailService = require("../services/emailServices");
const {
  generateAccessToken,
  generateRefreshToken,
  createSession,
  hashRefreshToken,
  revokeAllSessions,
} = require("../services/auth.service");
const Session = require("../models/Session");
const ms = require("ms");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: ms(process.env.REFRESH_TOKEN_EXPIRE),
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) throw new AppError("All feilds required", 400);

  const existingUser = await User.findOne({ email }).select("+password");
  if (existingUser) throw new AppError("Email Already exists", 400);

  const hashPassword = await bcrypt.hash(password, 10);
  await User.create({
    fullName,
    email,
    password: hashPassword,
  });

  res.status(201).json(new ApiResponse(201, null, "User registered successfully"));
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError("All feilds required", 400);

  const existUser = await User.findOne({ email }).select("+password");
  if (!existUser) throw new AppError("Invalid email or password", 401);

  const Ismatch = await bcrypt.compare(password, existUser.password);
  if (!Ismatch) throw new AppError("Invalid email or password", 401);

  const accessToken = generateAccessToken(existUser);
  const refreshToken = generateRefreshToken(existUser);
  const device = req.headers["user-agent"];
  const ipAddress = req.ip;
  await createSession({
    user: existUser,
    refreshToken,
    device,
    ipAddress,
  });
  res.cookie("refreshToken", refreshToken, cookieOptions);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken,
      },
      "Login Successfully"
    )
  );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken;
  if (!incomingToken) throw new AppError("Refresh token required", 401);
  let decode;
  try {
    decode = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const session = await Session.findOne({
    user: decode.id,
    refreshToken: hashRefreshToken(incomingToken),
  });
  if (!session) throw new AppError("Invalid or expired session", 401);

  const user = await User.findById(session.user);
  if (!user) throw new AppError("User not found", 404);

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  session.refreshToken = hashRefreshToken(newRefreshToken);
  session.expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRE));
  await session.save();
  res.cookie("refreshToken", newRefreshToken, cookieOptions);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
      },
      "NewAccessToken generated Successfully"
    )
  );
});

const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: user._id,
        _id: user._id,
        fullName: user.fullName,
        name: user.name || user.fullName,
        email: user.email,
        role: user.role,
      },
      "Profile fetched successfully"
    )
  );
});

const logout = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies.refreshToken;
  if (incomingToken) await Session.deleteOne({ refreshToken: hashRefreshToken(incomingToken) });
  res.clearCookie("refreshToken", cookieOptions);
  return res.status(200).json(new ApiResponse(200, null, "logout successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};
  if (!email) throw new AppError("Enter the email first", 400);

  const emailverify = await User.findOne({ email });
  if (!emailverify) throw new AppError("User not exits", 404);

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(String(otp), 10);
  emailverify.resetPasswordOtp = hashedOtp;
  emailverify.resetPasswordOtpExpires = new Date(Date.now() + 5 * 60 * 1000);

  await emailverify.save();
  await emailService(email, String(otp));

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

// Read-only check: confirms the OTP is currently valid WITHOUT consuming it.
// The actual OTP is only cleared inside resetPassword, once the reset
// has actually happened. This lets the UI show "OTP verified ✅" and move
// the user to the "set new password" screen without burning the OTP early.
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body || {};

  if (!email || !otp) {
    throw new AppError("Email and OTP are required", 400);
  }

  const user = await User.findOne({ email }).select(
    "+resetPasswordOtp +resetPasswordOtpExpires"
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
    throw new AppError("No active OTP request. Please request a new OTP.", 400);
  }

  if (Date.now() > user.resetPasswordOtpExpires.getTime()) {
    throw new AppError("OTP has expired. Please request a new one.", 400);
  }

  const otpMatch = await bcrypt.compare(String(otp).trim(), user.resetPasswordOtp);

  if (!otpMatch) {
    throw new AppError("Invalid OTP", 400);
  }

  // Do NOT clear resetPasswordOtp here — resetPassword still needs it.
  return res.status(200).json(new ApiResponse(200, null, "OTP verified successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body || {};

  if (!email || !otp || !newPassword) {
    throw new AppError("Email, OTP and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const user = await User.findOne({ email }).select(
    "+password +resetPasswordOtp +resetPasswordOtpExpires"
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
    throw new AppError("No active OTP request. Please request a new OTP.", 400);
  }

  if (Date.now() > user.resetPasswordOtpExpires.getTime()) {
    throw new AppError("OTP has expired. Please request a new one.", 400);
  }

  const otpMatch = await bcrypt.compare(String(otp).trim(), user.resetPasswordOtp);

  if (!otpMatch) {
    throw new AppError("Invalid OTP", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  // Invalidate the OTP after successful reset — this is the ONLY place
  // it gets cleared now.
  user.resetPasswordOtp = undefined;
  user.resetPasswordOtpExpires = undefined;

  await user.save();

  // Log out all existing sessions.
  await revokeAllSessions(user._id);

  return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logout,
  getProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
};