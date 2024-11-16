const multer = require('multer');

// Use memory storage instead of disk storage for Vercel compatibility
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

module.exports = { upload };