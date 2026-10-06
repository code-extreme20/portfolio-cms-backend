const Media = require("../models/Media");

const getBackendUrl = (req) => {
    if (process.env.BACKEND_URL) {
        return process.env.BACKEND_URL.replace(/\/$/, "");
    }

    return `${req.protocol}://${req.get("host")}`;
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image.",
            });
        }

        const backendUrl = getBackendUrl(req);

        const fileUrl = `${backendUrl}/uploads/images/${req.file.filename}`;

        const media = await Media.create({
            filename: req.file.filename,
            originalName: req.file.originalname,
            url: fileUrl,
            mimeType: req.file.mimetype,
            size: req.file.size,
            type: "image",
        });

        return res.status(201).json({
            success: true,
            message: "Image uploaded successfully.",
            data: media,
        });
    } catch (error) {
        console.error("Upload image error:", error);

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