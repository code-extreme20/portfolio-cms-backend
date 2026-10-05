const express = require("express");

const {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);

// ADMIN
router.get("/:id", protect, getBlog);
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

module.exports = router;