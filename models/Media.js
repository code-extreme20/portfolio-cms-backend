const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
    {
        filename: {
            type: String,
            required: true,
        },

        originalName: {
            type: String,
            required: true,
        },

        url: {
            type: String,
            required: true,
        },

        mimeType: {
            type: String,
            required: true,
        },

        size: {
            type: Number,
            required: true,
        },

        type: {
            type: String,
            enum: ["image"],
            default: "image",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Media", mediaSchema);