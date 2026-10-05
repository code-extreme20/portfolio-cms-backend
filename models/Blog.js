const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        excerpt: {
            type: String,
            default: "",
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        coverImage: {
            type: String,
            default: "",
        },

        category: {
            type: String,
            default: "",
            trim: true,
        },

        tags: {
            type: [String],
            default: [],
        },

        author: {
            type: String,
            default: "Admin",
            trim: true,
        },

        published: {
            type: Boolean,
            default: false,
        },

        publishedAt: {
            type: Date,
            default: null,
        },

        order: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Blog", blogSchema);