const Message = require("../models/Message");
const sendContactEmail = require("../utils/sendEmail");

const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject and message are required.",
      });
    }

    // Save message to MongoDB
    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send notification email
    try {
      await sendContactEmail({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
    } catch (emailError) {
      console.error(
        "Contact email notification failed:",
        emailError.message
      );

      // Message is already safely stored in MongoDB.
      return res.status(201).json({
        success: true,
        message:
          "Message received successfully. Email notification could not be sent.",
        data: newMessage,
        emailSent: false,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Message received and email notification sent successfully.",
      data: newMessage,
      emailSent: true,
    });
  } catch (error) {
    console.error("Create message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
};

const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const message = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message updated successfully.",
      data: message,
    });
  } catch (error) {
    console.error("Update message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update message.",
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};