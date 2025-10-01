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

const maxFileSize = Number(process.env.MAX_FILE_SIZE_BYTES || (10 * 1024 * 1024 * 1024));
const rejectSpaces = String(process.env.REJECT_FILENAMES_WITH_SPACES || 'true').toLowerCase() === 'true';

function fileFilter(req, file, cb) {
    if (rejectSpaces && /\s/.test(file.originalname)) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'FILENAME_HAS_SPACES'));
    }
    cb(null, true);
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: maxFileSize,
    },
    fileFilter,
});

// Export the `upload` object in CommonJS format
module.exports = upload;