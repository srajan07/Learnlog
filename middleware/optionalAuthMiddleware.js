const jwt = require("jsonwebtoken");

function optionalAuthMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return next();
  }

  const parts = auth.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next();
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    // invalid/expired token — just proceed unauthenticated
  }

  next();
}

module.exports = optionalAuthMiddleware;