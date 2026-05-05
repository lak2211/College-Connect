
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://127.0.0.1:27017/college_connect";

async function checkUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        const User = mongoose.connection.db.collection('users');
        const user = await User.findOne({ email: "np123@gmail.com" });
        if (user) {
            console.log("User found:", JSON.stringify(user, null, 2));
        } else {
            console.log("User not found: np123@gmail.com");
            const allUsers = await User.find({}).limit(5).toArray();
            console.log("Sample users:", allUsers.map(u => u.email));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUser();
