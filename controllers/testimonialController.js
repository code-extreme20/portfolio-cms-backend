const Testimonial = require("../models/Testimonial");

// Get all testimonials
const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({
            order: 1,
            createdAt: -1,
        });

        res.json({
            success: true,
            count: testimonials.length,
            data: testimonials,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch testimonials",
            error: error.message,
        });
    }
};

// Get single testimonial
const getTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }

        res.json({
            success: true,
            data: testimonial,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch testimonial",
            error: error.message,
        });
    }
};

// Create testimonial
const createTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.create(req.body);

        res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            data: testimonial,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create testimonial",
            error: error.message,
        });
    }
};

// Update testimonial
const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }

        res.json({
            success: true,
            message: "Testimonial updated successfully",
            data: testimonial,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update testimonial",
            error: error.message,
        });
    }
};

// Delete testimonial
const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

        if (!testimonial) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found",
            });
        }

        res.json({
            success: true,
            message: "Testimonial deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete testimonial",
            error: error.message,
        });
    }
};

module.exports = {
    getTestimonials,
    getTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
};