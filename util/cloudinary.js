const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({ 
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
   api_key: process.env.CLOUDINARY_API_KEY, 
   api_secret: process.env.CLOUDINARY_API_SECRET
}); 

const uploadOnCloudinary = async (file) => {
    try {
        if (!file) return null;
        
        // Create base64 string from buffer and mimetype
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        // Upload to cloudinary
        const response = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: "your-folder-name" // Optional: specify a folder in cloudinary
        });

        console.log("File uploaded successfully:", response.url);
        return response;
    } catch (error) {
        console.log("Error uploading to cloudinary:", error);
        return null;
    }
}

module.exports = { uploadOnCloudinary };
