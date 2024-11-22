const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true,
        trim: true
    },
    lastName: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true
    },
    phoneNumber: { 
        type: String, 
        required: true
    },
    image: { 
        type: String // Store Cloudinary URL instead of Buffer
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
