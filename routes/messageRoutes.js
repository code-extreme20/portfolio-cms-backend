const express = require("express");

const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require("../controllers/messageController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public contact form
router.post("/", createMessage);

// Admin routes
router.get("/", protect, getMessages);

router.put("/:id", protect, updateMessage);

router.delete("/:id", protect, deleteMessage);

module.exports = router;