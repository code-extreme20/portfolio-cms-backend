const dotenv = require("dotenv");

dotenv.config();

const dns = require("dns");
const express = require("express");
const cors = require("cors");

// MongoDB Atlas SRV DNS resolution fix
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const aboutRoutes = require("./routes/aboutRoutes");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/projectRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const blogRoutes = require("./routes/blogRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Connect MongoDB
connectDB();

const app = express();

// Disable ETag so API requests don't return 304
// and confuse the admin authentication flow.
app.disable("etag");

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static("uploads"));

// ==============================
// API ROUTES
// ==============================

// Authentication
app.use("/api/auth", authRoutes);

// About
app.use("/api/about", aboutRoutes);

// Skills
app.use("/api/skills", skillRoutes);

// Projects
app.use("/api/projects", projectRoutes);

// Experience
app.use("/api/experience", experienceRoutes);

// Services
app.use("/api/services", serviceRoutes);

// Testimonials
app.use("/api/testimonials", testimonialRoutes);

// Blogs
app.use("/api/blogs", blogRoutes);

// Media / Uploads
app.use("/api/upload", uploadRoutes);

// Contact / Messages
app.use("/api/contact", messageRoutes);

// ==============================
// ROOT ROUTE
// ==============================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Portfolio CMS API is running",
  });
});

// ==============================
// HEALTH CHECK
// ==============================

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server and API are healthy",
    database: "MongoDB",
  });
});

// ==============================
// 404 HANDLER
// ==============================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================

app.use((err, req, res, next) => {
  console.error("Global API Error:", err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined,
  });
});

// ==============================
// START SERVER
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});