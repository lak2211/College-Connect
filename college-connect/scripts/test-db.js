
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://127.0.0.1:27017/college_connect";

async function testConnection() {
    console.log("Testing MongoDB connection to:", MONGODB_URI);
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to MongoDB");
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: Could not connect to MongoDB");
        console.error(err);
        process.exit(1);
    }
}

testConnection();
