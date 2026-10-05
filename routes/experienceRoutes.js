const express = require("express");

const {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require("../controllers/experienceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getExperiences);
router.get("/:id", getExperience);

// Admin
router.post("/", protect, createExperience);
router.put("/:id", protect, updateExperience);
router.delete("/:id", protect, deleteExperience);

module.exports = router;