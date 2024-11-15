const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Add debugging to check if env variables are loaded

// Configuration 
cloudinary.config({ 
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
   api_key: process.env.CLOUDINARY_API_KEY, 
   api_secret: process.env.CLOUDINARY_API_SECRET
}); 

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null

        //upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto",
            
        })
        //file has been uploaded successfully
        fs.unlinkSync(localFilePath)
        console.log("File uploaded to cloudinary successfully");
        return response;
    } catch (error) {
        //remove the locally saved temporary file as the upload operation failed
        fs.unlinkSync(localFilePath)
        console.log("Failed to upload local file: ", error);
        return null;
    }
}

module.exports = { uploadOnCloudinary };
