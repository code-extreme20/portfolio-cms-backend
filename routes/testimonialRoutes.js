const express = require("express");

const {
    getTestimonials,
    getTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} = require("../controllers/testimonialController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getTestimonials);
router.get("/:id", getTestimonial);

// Admin
router.post("/", protect, createTestimonial);
router.put("/:id", protect, updateTestimonial);
router.delete("/:id", protect, deleteTestimonial);

module.exports = router;