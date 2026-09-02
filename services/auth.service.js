const jwt=require("jsonwebtoken");
const Session=require("../models/Session");
const ms=require("ms");
const crypto = require("crypto");

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      _id: user._id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
}

function generateRefreshToken(user){
    return jwt.sign({
        id:user._id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRE
    })
}

async function createSession({ user, refreshToken, device, ipAddress }) {
    return Session.create({
        user: user._id,
        refreshToken: hashRefreshToken(refreshToken),
        device,
        ipAddress,
        expiresAt: new Date(
            Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRE)
        ),
    });
}

function hashRefreshToken(refreshToken) {
      return crypto.createHash("sha256").update(refreshToken).digest("hex");
}
async function revokeAllSessions(userId) {
  return Session.deleteMany({ user: userId });
}
module.exports={
    generateAccessToken,
    generateRefreshToken,
    createSession,
    hashRefreshToken,
    revokeAllSessions,
}