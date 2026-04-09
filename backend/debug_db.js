const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.ATLASDB_URL || process.env.MONGODB_URL;
console.log("Connecting to:", uri);

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB successfully");
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    // Check if User collection exists and count documents
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    const count = await User.countDocuments();
    console.log("User count in 'users' collection:", count);
    
    const allUsers = await User.find({}).limit(5);
    console.log("First 5 users:", allUsers.map(u => u.email));

    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
