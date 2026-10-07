const fs = require("fs/promises");

const Media = require("../models/Media");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  let localFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    localFilePath = req.file.path;

    // Upload image to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(
      localFilePath,
      {
        folder: "portfolio-cms",
        resource_type: "image",
      }
    );

    // Save permanent Cloudinary URL in MongoDB
    const media = await Media.create({
      filename: cloudinaryResult.public_id,
      originalName: req.file.originalname,
      url: cloudinaryResult.secure_url,
      mimeType: req.file.mimetype,
      size: req.file.size,
      type: "image",
    });

    // Remove temporary local file
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

    // Remove temporary file if Cloudinary upload/database save fails
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

const deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await Media.findByIdAndDelete(id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found.",
      });
    }

    // Delete image from Cloudinary
    if (media.filename) {
      try {
        await cloudinary.uploader.destroy(media.filename, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary delete error:",
          cloudinaryError.message
        );
      }
    }

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