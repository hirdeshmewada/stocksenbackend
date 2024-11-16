const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Add debugging to check if env variables are loaded

// Configuration 
cloudinary.config({ 
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
   api_key: process.env.CLOUDINARY_API_KEY, 
   api_secret: process.env.CLOUDINARY_API_SECRET
}); 

const uploadOnCloudinary = async (fileBuffer) => {
    try {
        if (!fileBuffer) return null;

        // Convert buffer to base64 string for cloudinary
        const fileStr = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;

        // Upload the buffer directly to cloudinary
        const response = await cloudinary.uploader.upload(fileStr, {
            resource_type: "auto"
        });

        console.log("File uploaded to cloudinary successfully");
        return response;
    } catch (error) {
        console.log("Failed to upload file to cloudinary: ", error);
        return null;
    }
}

module.exports = { uploadOnCloudinary };
