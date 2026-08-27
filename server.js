require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authroutes");
const userRoutes = require("./routes/userRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const communityRoutes = require("./routes/communityRoutes");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/community/posts", communityRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to InterviewPilot V1 API");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();