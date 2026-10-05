const About = require("../models/About");

// Get About
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    res.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Get About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch About information",
    });
  }
};

// Create or Update About
const updateAbout = async (req, res) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      req.body,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "About information updated successfully",
      data: about,
    });
  } catch (error) {
    console.error("Update About Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update About information",
    });
  }
};

module.exports = {
  getAbout,
  updateAbout,
};