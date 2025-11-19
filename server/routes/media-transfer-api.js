const express = require('express');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
// SFTP enabled - requires VPN connection to SFTP server
const { connectToSFTP, downloadFiles, closeConnection, uploadFiles, listFiles } = require('../../src/app/media-transfer/connect-sftp.cjs');
const mailcall = require('../../src/app/media-transfer/mailer.cjs');
const os = require('os');
const router = express.Router();
const getWebUrl = require('../../src/app/media-transfer/getWebURL.cjs')

// Enable JSON parsing for incoming requests
router.use(express.json());

// Flag to track SFTP connection status
let isConnectedToSFTP = false;

// Configure multer for temporary file storage (before SFTP upload)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../src/app/media-transfer/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024, // 2 GB limit
    },
});

// PRIMARY ENDPOINT: Get Media Link - Download from SFTP server
router.get('/get-media-link/:uid/:fileName', async (req, res) => {
    const { uid, fileName } = req.params;
    
    if (!uid || !fileName) {
        return res.status(404).json({ message: "Missing UID or fileName in request" });
    }

    try {
        // Connect to SFTP if not already connected
        if (!isConnectedToSFTP) {
            const connectResult = await connectToSFTP();
            if (connectResult === "demo") {
                // Demo mode - local storage is being used
                console.log("📦 Running in demo mode (local storage)");
                isConnectedToSFTP = true; // Allow operations to proceed
            } else if (connectResult === "404") {
                return res.status(500).json({ message: "Failed to connect to SFTP server" });
            } else {
                isConnectedToSFTP = true;
            }
        }

        // Download file from SFTP to temporary location
        const downloadsDir = path.join(os.homedir(), 'Downloads');
        const tempFilePath = path.join(downloadsDir, fileName);
        
        // Ensure downloads directory exists
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }

        // Download from SFTP using UID as username and fileName as fileId
        const downloadResult = await downloadFiles(uid, fileName);
        
        if (downloadResult === "200") {
            // Check if file was downloaded
            if (fs.existsSync(tempFilePath)) {
                if (req.method === 'HEAD') {
                    return res.status(200).end();
                }

                // Send file for download, then clean up
                res.download(tempFilePath, fileName, (err) => {
                    // Clean up temp file after download
                    if (fs.existsSync(tempFilePath)) {
                        fs.unlinkSync(tempFilePath);
                    }
                    if (err) {
                        console.error("Download error:", err);
                        res.status(500).json({ message: "Error downloading file" });
                    }
                });
            } else {
                return res.status(404).json({ message: "File not found after download" });
            }
        } else {
            return res.status(404).json({ message: "Error downloading file from SFTP" });
        }
    } catch (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Error downloading file" });
    }
});

// UPLOAD ENDPOINT - Upload files to SFTP server
router.post('/upload', upload.array('files'), async (req, res) => {
    const { uid } = req.body;
    const files = req.files;

    if (!files || files.length === 0) {
        return res.status(400).json({ message: "Missing uploaded files" });
    }

    try {
        // For demo purposes, always use demo mode (local storage)
        // SFTP connection can be enabled later if needed
        const { enableDemoMode } = require('../../src/app/media-transfer/connect-sftp.cjs');
        enableDemoMode();
        console.log("📦 Using demo mode (local storage) for file upload");
        
        // Upload files using local storage
        console.log(`Uploading ${files.length} file(s) for UID: ${uid}`);
        console.log("Files received:", files.map(f => ({ path: f.path, originalname: f.originalname })));
        
        const uploadResult = await uploadFiles(uid, files);

        // Clean up temp files after upload
        files.forEach(file => {
            const filePath = file.path;
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete temp file:", filePath, err);
                    }
                });
            }
        });

        if (uploadResult === "200") {
            return res.status(200).json({ 
                message: "Files uploaded successfully",
                uid: uid,
                fileCount: files.length
            });
        } else {
            console.error("Upload failed with result:", uploadResult);
            return res.status(500).json({ message: "Error uploading files. Please check server logs for details." });
        }
    } catch (err) {
        console.error("Upload error:", err);
        console.error("Error stack:", err.stack);
        // Always try demo mode as fallback
        try {
            const { enableDemoMode } = require('../../src/app/media-transfer/connect-sftp.cjs');
            enableDemoMode();
            console.log("🔄 Retrying upload with demo mode enabled...");
            
            // Log file details for debugging
            console.log("Files to upload:", files.map(f => ({ 
                path: f.path, 
                originalname: f.originalname,
                exists: fs.existsSync(f.path)
            })));
            
            const retryResult = await uploadFiles(uid, files);
            if (retryResult === "200") {
                return res.status(200).json({ 
                    message: "Files uploaded successfully (using local storage)",
                    uid: uid,
                    fileCount: files.length
                });
            } else {
                console.error("Retry failed with result:", retryResult);
                return res.status(500).json({ 
                    message: "Error uploading files. Demo mode retry also failed. Check server logs.",
                    error: err.message
                });
            }
        } catch (retryErr) {
            console.error("Retry also failed:", retryErr);
            console.error("Retry error stack:", retryErr.stack);
            return res.status(500).json({ 
                message: "Error uploading files. Please check server logs for details.",
                error: err.message
            });
        }
    }
});

// SEND EMAIL ENDPOINT
router.get('/send-email-info', (req, res) => {
    const { email, uid, fileName, subject, body, sender } = req.query;

    if (!email || !fileName) {
        return res.status(400).json({ message: "Missing email or fileName in request" });
    }

    const emailList = email.split(", ");
    const splitFiles = fileName.split(",");

    const now = new Date();
    const expiryDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 23, 59, 0);
    const formattedExpiry = expiryDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    let errors = 0;
    // Use backend URL directly for download links (not frontend URL)
    // This allows downloads without requiring authentication
    const backendURL = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'http://44.231.94.92:3000'; // Update with production backend URL if different
    
    emailList.forEach((recipient) => {
        let links = "";
        splitFiles.forEach(file => {
            // Download link - points directly to backend API (no authentication required)
            const downloadLink = `${backendURL}/media-transfer/get-media-link/${uid}/${encodeURIComponent(file)}`;
            links += `<li><a href="${downloadLink}">${file}</a></li>`;
        });

        const message = mailcall(sender || "Anonymous User", recipient, subject || "Digiclips File Request", body || "", links, formattedExpiry);
        if (message === "404") {
            errors++;
        }
    });

    if (errors === 0) {
        res.status(200).json({ message: "Emails Sent Successfully!" });
    } else {
        res.status(500).json({ message: "Error Sending Emails" });
    }
});

// LIST FILES ENDPOINT - List files from SFTP server
router.get('/get-list/:uid', async (req, res) => {
    const { uid } = req.params;
    
    try {
        // Connect to SFTP if not already connected
        if (!isConnectedToSFTP) {
            const connectResult = await connectToSFTP();
            if (connectResult === "demo") {
                // Demo mode - local storage is being used
                console.log("📦 Running in demo mode (local storage)");
                isConnectedToSFTP = true; // Allow operations to proceed
            } else if (connectResult === "404") {
                return res.status(500).json({ message: "Failed to connect to SFTP server" });
            } else {
                isConnectedToSFTP = true;
            }
        }

        const result = await listFiles(uid);
        
        if (result === "404") {
            return res.status(404).json({ message: "Error listing files, user directory may not exist" });
        } else {
            res.status(200).json({
                message: "Files listed successfully",
                files: result.map(file => file.name),
            });
        }
    } catch (err) {
        console.error("List files error:", err);
        res.status(500).json({ message: "Error listing files" });
    }
});

// MULTER ERROR HANDLER
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: "File size exceeds the limit (2 GB)" });
        }
        return res.status(500).json({ error: `Multer error: ${err.message}` });
    }
    next(err);
});

// Export router
module.exports = router;