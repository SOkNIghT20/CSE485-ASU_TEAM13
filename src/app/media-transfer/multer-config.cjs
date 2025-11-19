const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Using `path` and `__dirname` directly in CommonJS
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure `multer` storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Use absolute path for uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        // fileSize: 3 * 1024 * 1024, // for testing
        fileSize: 2 * 1024 * 1024 * 1024, // 2 GB limit (configurable by admin)
    },
});

// Export the `upload` object in CommonJS format
module.exports = upload;