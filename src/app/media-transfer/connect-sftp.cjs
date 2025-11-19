//Created by Bennett Godinho-Nelson 2/22/2025
//Edited by Xining Qin, Bennett Godinho-Nelson 2/22/2025
//Edited by Sarah Keck 3/4/2025 - imports and function exports
//Updated by ASU Team - Uses static IP (72.229.56.211) via ASUS Router
//NOTE: Connects directly to ASUS router via static IP using SFTP (port 22) - NO VPN required

const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const os = require('os');

let sftp = new Client();
let userName = 'default';
let fileID = 'default';
let useLocalStorage = false; // Demo mode flag - uses local storage when SFTP unavailable

// Function to explicitly enable demo mode
function enableDemoMode() {
    useLocalStorage = true;
    console.log("🔧 Demo mode explicitly enabled");
}

let config = {
    host: '72.229.56.211', // Static IP - ASUS Router SFTP Server
    port: 22, // SFTP port (secure file transfer)
    username: 'henry1', // TODO: Get actual router credentials from Henry
    password: 'DropInn12', // TODO: Get actual router credentials from Henry
    inDir: `/media-transfer-temp/${userName}/${fileID}`, // Path on router SD drive
    outDir: '/tmp' //Temporary current fileDir for personal output
};

// Get local storage directory for demo mode
function getLocalStorageDir() {
    // From src/app/media-transfer/ to server/media-storage
    // Go up 3 levels to project root, then into server/media-storage
    const localStorageBase = path.join(__dirname, '../../../server/media-storage');
    if (!fs.existsSync(localStorageBase)) {
        fs.mkdirSync(localStorageBase, { recursive: true });
    }
    return localStorageBase;
}

// Connects to SFTP and downloads files
async function connectToSFTP() {
    try {
        console.log("Connecting to SFTP server at", config.host, "...");
        // Set a shorter timeout for connection attempts (3 seconds)
        const connectPromise = sftp.connect(config);
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Connection timeout after 3 seconds")), 3000)
        );
        
        await Promise.race([connectPromise, timeoutPromise]);
        console.log("✅ Connected to SFTP server!");
        useLocalStorage = false;
        return "200";
    } catch (err) {
        const errorMsg = err.message || String(err);
        console.error("❌ SFTP Error:", errorMsg);
        console.log("⚠️  SFTP connection failed. Switching to local storage mode for demo purposes.");
        useLocalStorage = true;
        // Make sure sftp connection is closed if it was partially opened
        try {
            if (sftp && typeof sftp.end === 'function') {
                await sftp.end().catch(() => {}); // Ignore errors
            }
        } catch (e) {
            // Ignore errors when ending connection
        }
        // Create a new client instance for next attempt
        sftp = new Client();
        return "demo"; // Return "demo" to indicate demo mode
    } 
}

// Downloads Files
async function downloadFiles(username, fileName) {
    try {
        userName = username;
        fileID = fileName;

        // If in demo mode, use local storage
        if (useLocalStorage) {
            const localStorageDir = getLocalStorageDir();
            const userDir = path.join(localStorageDir, username);
            const sourceFilePath = path.join(userDir, fileName);
            const downloadsDir = path.join(os.homedir(), 'Downloads');
            fs.mkdirSync(downloadsDir, { recursive: true });
            const destFilePath = path.join(downloadsDir, fileName);

            if (fs.existsSync(sourceFilePath)) {
                fs.copyFileSync(sourceFilePath, destFilePath);
                console.log(`✅ File copied from local storage: ${fileName}`);
                return "200";
            } else {
                console.error(`File not found in local storage: ${sourceFilePath}`);
                return "404";
            }
        }

        // Remote file path on router SD drive (via static IP)
        const remoteFilePath = `/media-transfer-temp/${username}/${fileName}`;
        
        // Local download directory
        const downloadsDir = path.join(os.homedir(), 'Downloads');
        fs.mkdirSync(downloadsDir, { recursive: true });
        
        // Local file path
        const localFilePath = path.join(downloadsDir, fileName);

        // Download file from SFTP server
        await sftp.fastGet(remoteFilePath, localFilePath);
        
        return "200";
    } catch (err) {
        console.error("Download Error:", err);
        return "404";
    }
}

// Uploads Files
async function uploadFiles(username, fileList) {
    try {
        // Always use demo mode if SFTP isn't available (safety check)
        if (useLocalStorage || !sftp || typeof sftp.fastPut !== 'function') {
            console.log(`📦 Uploading ${fileList.length} file(s) to local storage for user: ${username}`);
            const localStorageDir = getLocalStorageDir();
            const userDir = path.join(localStorageDir, username);
            
            // Ensure the user directory exists
            if (!fs.existsSync(userDir)) {
                fs.mkdirSync(userDir, { recursive: true });
                console.log(`✅ Created user directory: ${userDir}`);
            }

            let successCount = 0;
            for (const file of fileList) {
                try {
                    // Handle both multer file objects and regular file paths
                    let localPath;
                    if (file.path) {
                        localPath = path.resolve(file.path).replace(/\\/g, '/');
                    } else if (typeof file === 'string') {
                        localPath = file;
                    } else {
                        console.error(`❌ Invalid file object:`, file);
                        continue;
                    }

                    if (!fs.existsSync(localPath)) {
                        console.warn(`⚠️  File not found locally: ${localPath}`);
                        console.warn(`File object:`, file);
                        continue;
                    }

                    const destFilePath = path.join(userDir, file.originalname || file.name || path.basename(localPath));
                    fs.copyFileSync(localPath, destFilePath);
                    console.log(`✅ File saved to local storage: ${file.originalname || file.name || path.basename(localPath)}`);
                    successCount++;
                } catch (fileErr) {
                    console.error(`❌ Error copying file:`, fileErr);
                    console.error(`File details:`, file);
                }
            }

            if (successCount === 0 && fileList.length > 0) {
                console.error(`❌ Failed to upload any files. Total files: ${fileList.length}`);
                return "500";
            }
            return "200";
        }

        // SFTP mode - upload to router
        const remoteDir = `/media-transfer-temp/${username}`; // Path on router SD drive

        // Ensure the user directory exists
        const exists = await sftp.exists(remoteDir);
        if (!exists) {
            await sftp.mkdir(remoteDir, true);
        }

        for (const file of fileList) {
            const localPath = path.resolve(file.path).replace(/\\/g, '/');

            if (!fs.existsSync(localPath)) {
                console.warn(`File not found locally: ${localPath}`);
                continue;
            }

            const remoteFilePath = `${remoteDir}/${file.originalname}`;
            await sftp.fastPut(localPath, remoteFilePath);
        }

        return "200";
    } catch (err) {
        console.error("Upload Error:", err);
        // If SFTP fails and we're not already in demo mode, try to fall back
        if (!useLocalStorage) {
            console.log("⚠️  SFTP upload failed, attempting to fall back to local storage...");
            useLocalStorage = true;
            return await uploadFiles(username, fileList); // Retry with local storage
        }
        return "500";
    }
}

// Lists files in directory
async function listFiles(username) {
    try {
        // If in demo mode, use local storage
        if (useLocalStorage) {
            const localStorageDir = getLocalStorageDir();
            const userDir = path.join(localStorageDir, username);
            
            if (fs.existsSync(userDir)) {
                const files = fs.readdirSync(userDir).map(fileName => ({
                    name: fileName,
                    type: 'file'
                }));
                console.log("Files in local storage:", files.map(file => file.name));
                return files;
            } else {
                return "404";
            }
        }

        // SFTP mode
        const inDir = `/mnt/9b90f2ca-dd8c-46d9-8348-46c21a5eda95/media-transfer-temp/${username}`;
        // Check if the dir exists
        if (await sftp.exists(inDir)) {
            const fileList = await sftp.list(inDir);
            console.log("Files in directory:", fileList.map(file => file.name));
            return fileList;
        } else {
            return "404";
        }
    } catch (err) {
        console.error("List files error:", err);
        return "404";
    }
}

// Will delete files every 7 days at midnight
async function deleteOldFiles(username) {
    try {
        const dirPath = `/media-transfer-temp/${username}`; // Path on router SD drive
        const now = Date.now();
        const ageLimit = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

        const fileList = await sftp.list(dirPath);

        for (const file of fileList) {
            const filePath = `${dirPath}/${file.name}`;
            const fileStats = await sftp.stat(filePath);

            if (now - new Date(fileStats.modifyTime).getTime() > ageLimit) {
                await sftp.delete(filePath);
            }
        }

        return "200";
    } catch (err) {
        console.error("Error deleting old files:", err);
        return "404";
    }
}

// Will run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        console.log("Running scheduled cleanup...");

        const baseDir = '/media-transfer-temp'; // Base directory on router SD drive
        const userDirs = await sftp.list(baseDir);

        for (const dir of userDirs) {
            if (dir.type === 'd') {
                console.log(`Cleaning up for user: ${dir.name}`);
                await deleteOldFiles(dir.name);
            } else {
                console.log(`Skipping  ${dir.name}`);
            }
        }

        console.log("Cleanup complete");
    } catch (err) {
        console.error("Scheduled cleanup failed:", err);
    }
});

async function closeConnection() {
    await sftp.end();
    console.log("Connection closed.");
}

module.exports = { connectToSFTP, downloadFiles, closeConnection, uploadFiles, listFiles, enableDemoMode };
