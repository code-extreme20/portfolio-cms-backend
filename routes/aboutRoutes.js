const express = require("express");

const {
  getAbout,
  updateAbout,
} = require("../controllers/aboutController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getAbout);

// Admin only
router.put("/", protect, updateAbout);

module.exports = router;