const mongoose = require("mongoose");
const dns = require("dns");

// Set DNS servers to Google's to help resolve Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (err) {
  console.warn("Unable to set custom DNS servers:", err.message);
}

require("dotenv").config();

module.exports.MongoDBconfig = () => {
  const uri = process.env.ATLASDB_URL || process.env.MONGODB_URL;
  if (!uri) {
    console.error("No MongoDB URI found in environment variables.");
    return;
  }
  
  mongoose.connect(uri)
    .then(() => {
      console.log("Connected to database successfully");
    })
    .catch((err) => {
      console.error("MongoDB Connection Error:", err.message);
    });
};
