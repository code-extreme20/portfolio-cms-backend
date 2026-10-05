const express = require("express");

const {
  login,
  refreshToken,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", protect, getMe);

module.exports = router;