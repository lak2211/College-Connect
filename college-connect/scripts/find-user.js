const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/college-connect';

async function findUser() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model('User', new mongoose.Schema({ email: String }), 'users');
    const user = await User.findOne();
    console.log(user ? user.email : 'No users found');
    await mongoose.disconnect();
}

findUser();
