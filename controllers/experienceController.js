const Experience = require("../models/Experience");

// GET all
const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({
      order: 1,
      createdAt: -1,
    });

    res.json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    console.error("Get Experience Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
};

// GET one
const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.json({
      success: true,
      data: experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch experience",
    });
  }
};

// CREATE
const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Create Experience Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    console.error("Update Experience Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error("Delete Experience Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete experience",
    });
  }
};

module.exports = {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
};