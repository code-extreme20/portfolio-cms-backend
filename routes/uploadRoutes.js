const express = require("express");

const {
  uploadImage,
  getMedia,
  deleteMedia,
} = require("../controllers/uploadController");

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/image", protect, upload.single("image"), uploadImage);

router.get("/media", protect, getMedia);

router.delete("/media/:id", protect, deleteMedia);

module.exports = router;