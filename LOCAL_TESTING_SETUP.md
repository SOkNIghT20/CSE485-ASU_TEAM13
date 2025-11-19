# Media Transfer - Local Testing Setup

## ✅ Changes Made for Local Testing

### **Problem Solved:**
The SFTP connection was timing out because it requires VPN access. We've disabled SFTP and switched to **local file storage** for testing without VPN.

### **What Changed:**

1. **SFTP Disabled** - No longer requires VPN or remote server connection
2. **Local Storage** - Files stored in `server/media-storage/` directory
3. **Simplified API** - Direct file upload/download without SFTP complexity

---

## 📂 File Storage Structure

Files are now stored locally:
```
server/
  └── media-storage/
      └── [uid]/           # Unique ID per transfer
          ├── file1.pdf
          ├── file2.jpg
          └── ...
```

---

## 🔧 Technical Changes

### **Modified Files:**

1. **`server/routes/media-transfer-api.js`**
   - Commented out SFTP imports
   - Added local storage directory setup
   - Replaced SFTP upload with local file copy
   - Replaced SFTP download with direct file serving
   - Updated list files to use local filesystem

2. **`src/app/app-routing/app-routing.module.ts`**
   - Removed `AuthGuard` from `/mediaTransfer` route
   - Now accessible without login for testing

---

## 🚀 How to Use

### **1. Start the Servers**

**Terminal 1 - Backend:**
```bash
cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main/server
npm run debug
```

**Terminal 2 - Frontend:**
```bash
cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main
npm start
```

### **2. Access Media Transfer**

Open browser: **`http://localhost:4200/mediaTransfer`**

No login required! ✅

### **3. Test File Upload**

1. Click the **blue upload button**
2. Select files (max 2GB each)
3. Enter your email (sender)
4. Enter recipient emails (press Enter after each)
5. Add subject and message (optional)
6. Click **"Send Email"**

### **4. Expected Behavior**

✅ **Files upload successfully** - Stored in `server/media-storage/[uid]/`  
✅ **Success message displayed** - "Files uploaded and emails sent successfully!"  
✅ **Emails sent** - Recipients and sender receive emails with download links  
✅ **No SFTP errors** - No VPN required  

---

## 📧 Email Configuration

Emails are sent via **Gmail SMTP**:
- Account: `digiclips.mediatransfer@gmail.com`
- Already configured in `src/app/media-transfer/mailer.cjs`

**Email includes:**
- Download links for each file
- Legal disclaimer (FAIR USE NOTICE)
- 7-day expiration notice
- 30-day auto-delete notice

---

## 🔍 Troubleshooting

### **Error: "An error occurred while uploading the files"**

**Solution:** The backend has been updated! 

1. Make sure backend restarted automatically (nodemon watches for changes)
2. Check terminal for "Files uploaded successfully" message
3. Verify `server/media-storage/` directory exists

### **Still Getting Errors?**

1. **Stop both servers** (Ctrl+C in both terminals)
2. **Restart backend first:**
   ```bash
   cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main/server
   npm run debug
   ```
3. **Wait for backend to start** (check for no errors)
4. **Start frontend:**
   ```bash
   cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main
   npm start
   ```
5. **Try uploading again**

### **Check Server Logs:**

Look for these messages in backend terminal:
- ✅ `Files uploaded successfully` - Upload worked
- ❌ `SFTP Error` - Old code still running (restart needed)

---

## 📝 Notes

- **Database errors** in terminal are expected (MySQL requires VPN)
- **Media Transfer works without database** for file upload/download
- **Local testing only** - For production, SFTP/VPN would be configured
- **Files stored locally** in `server/media-storage/` directory

---

## 🎯 Next Steps (Optional)

### **For Full Production Setup:**
1. Connect to VPN (see main README.md)
2. Re-enable SFTP in `media-transfer-api.js`
3. Configure database access
4. Enable authentication on routes

### **For Now (Local Testing):**
✅ Everything should work without VPN!  
✅ Test uploads, emails, and downloads locally  
✅ No AWS configuration needed  

