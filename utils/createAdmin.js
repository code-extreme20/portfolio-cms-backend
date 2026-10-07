const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/User");

dotenv.config();

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const createOrResetAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected");

    const email = "admin@portfolio.com";
    const password = "Admin@12345";

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      existingAdmin.name = "Portfolio Admin";
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";

      await existingAdmin.save();

      console.log(
        "Admin password reset successfully"
      );
    } else {
      const admin = await User.create({
        name: "Portfolio Admin",
        email,
        password: hashedPassword,
        role: "admin",
      });

      console.log("Admin created successfully");
      console.log("Email:", admin.email);
    }

    console.log("Email:", email);
    console.log("Password:", password);

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error(
      "Error creating/resetting admin:",
      error.message
    );

    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
};

createOrResetAdmin();