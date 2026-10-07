const fs = require("fs/promises");

const Media = require("../models/Media");
const cloudinary = require("../config/cloudinary");

// ==========================================
// UPLOAD IMAGE
// ==========================================
const uploadImage = async (req, res) => {
  let localFilePath = null;

  try {
    // Check uploaded file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    // Multer temporarily saves the file locally
    localFilePath = req.file.path;

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(
      localFilePath,
      {
        folder: "portfolio-cms",
        resource_type: "image",
      }
    );

    // Save Cloudinary information in MongoDB
    const media = await Media.create({
      filename: cloudinaryResult.public_id,
      originalName: req.file.originalname,
      url: cloudinaryResult.secure_url,
      mimeType: req.file.mimetype,
      size: req.file.size,
      type: "image",
    });

    // Delete temporary local file
    try {
      await fs.unlink(localFilePath);
    } catch (deleteError) {
      console.error(
        "Temporary file cleanup failed:",
        deleteError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully.",
      data: media,
    });
  } catch (error) {
    console.error("Upload image error:", error);

    // Delete temporary file if upload failed
    if (localFilePath) {
      try {
        await fs.unlink(localFilePath);
      } catch (deleteError) {
        console.error(
          "Temporary file cleanup failed:",
          deleteError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload image.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// ==========================================
// GET ALL MEDIA
// ==========================================
const getMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("Get media error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch media.",
    });
  }
};

// ==========================================
// DELETE MEDIA
// ==========================================
const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Find media first
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    // Delete image from Cloudinary
    if (media.filename) {
      try {
        await cloudinary.uploader.destroy(
          media.filename,
          {
            resource_type: "image",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary delete error:",
          cloudinaryError.message
        );
      }
    }

    // Delete media record from MongoDB
    await Media.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully.",
      data: media,
    });
  } catch (error) {
    console.error("Delete media error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete media.",
    });
  }
};

module.exports = {
  uploadImage,
  getMedia,
  deleteMedia,
};