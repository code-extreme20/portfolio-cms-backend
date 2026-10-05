const dns = require("dns");
const mongoose = require("mongoose");

// Use reliable public DNS servers for MongoDB Atlas SRV resolution.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );
  } catch (error) {
    console.error(
      `MongoDB Connection Error: ${error.message}`
    );

    process.exit(1);
  }
};

module.exports = connectDB;