const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    imageUrl: { type: String, default: '' },  // Optional, defaults to an empty string if not provided
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
