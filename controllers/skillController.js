const Skill = require("../models/Skill");

// GET all skills
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    console.error("Get Skills Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch skills",
    });
  }
};

// GET single skill
const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.json({
      success: true,
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch skill",
    });
  }
};

// CREATE skill
const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Create Skill Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE skill
const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    console.error("Update Skill Error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE skill
const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Delete Skill Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};

module.exports = {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
};