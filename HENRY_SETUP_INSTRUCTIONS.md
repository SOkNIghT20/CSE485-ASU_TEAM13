# Setup Instructions from Henry - ASUS Router Media Transfer

## 📋 **Information from Henry**

### **Key Details:**

1. **Static IP**: `72.229.56.211`
2. **Router**: ASUS Router at `http://router.asus.com`
3. **Storage**: SD Drive connected to router
4. **Purpose**: Demonstration/Presentation only
5. **NOT AWS**: Works on local system via router
6. **Limited Users**: Only for presentation

---

## ✅ **Configuration Updated**

### **SFTP Connection:**
- **Host**: `72.229.56.211` (Static IP)
- **Port**: `22` (SFTP) - *May need to change to `21` (FTP)*
- **Path**: `/media-transfer-temp/` on SD drive
- **NO VPN Required** - Direct connection!

### **Files Updated:**
- ✅ `src/app/media-transfer/connect-sftp.cjs` - Uses static IP
- ✅ `server/routes/media-transfer-api.js` - Updated error messages
- ✅ All file paths point to router SD drive

---

## 🔧 **Next Steps with Henry**

### **1. Get Router Credentials**

**Contact Henry** to get:
- ✅ Router FTP/SFTP username (currently set to `henry1`)
- ✅ Router FTP/SFTP password (currently set to `DropInn12`)
- ✅ Port number (22 for SFTP or 21 for FTP)
- ✅ SD drive mount path verification

### **2. Router Configuration**

**Henry needs to configure on router:**

1. **Access router admin**: `http://router.asus.com`
2. **Enable FTP/SFTP service**
3. **Set port**: 
   - Port `22` for SFTP (recommended - more secure)
   - OR Port `21` for FTP (if SFTP not available)
4. **Configure SD drive access**:
   - Mount SD drive
   - Set permissions for media-transfer-temp directory
   - Create `/media-transfer-temp/` directory on SD drive
5. **Set user credentials**:
   - Username: (confirm with Henry)
   - Password: (confirm with Henry)
   - Permissions: Read/Write on SD drive

### **3. Test Connection**

**Once Henry configures router, test connection:**

```bash
# Test SFTP (port 22)
sftp henry1@72.229.56.211

# OR Test FTP (port 21) if SFTP doesn't work
ftp 72.229.56.211
```

**Expected:**
- ✅ Connection successful
- ✅ Can navigate to SD drive
- ✅ Can create directories
- ✅ Can upload/download files

---

## 🧪 **Testing Process**

### **Step 1: Test with .jpg File**

As Henry suggested:
1. Upload a test `.jpg` file
2. Verify it appears on router SD drive
3. Test download from email link
4. Confirm file integrity

### **Step 2: Verify Storage**

1. **Access router admin**: `http://router.asus.com`
2. **Check SD drive** for:
   ```
   /media-transfer-temp/
     └── {uid}/
         └── test.jpg
   ```

### **Step 3: Test Complete Flow**

1. **Upload file** via web interface
2. **Receive email** with download link
3. **Click download link** - should download from router
4. **Verify file** matches uploaded file

---

## 📝 **What to Ask Henry**

### **Router Setup:**
1. What is the router admin username/password?
2. Is FTP or SFTP enabled on the router?
3. What port is configured? (22 for SFTP, 21 for FTP)
4. What is the SD drive mount path?
5. Are the credentials `henry1` / `DropInn12` correct?
6. Can you create the `/media-transfer-temp/` directory on SD drive?

### **Testing:**
1. Can you provide a test .jpg file to use?
2. Should I test upload/download now?
3. Is the router accessible from my location?

---

## ⚙️ **Configuration Details**

### **Current SFTP Config:**

```javascript
host: '72.229.56.211', // Static IP
port: 22,              // SFTP (or 21 for FTP)
username: 'henry1',    // Confirm with Henry
password: 'DropInn12', // Confirm with Henry
```

### **If Using FTP Instead:**

If router only supports FTP (port 21), we may need to:
1. Change port to `21`
2. Use FTP library instead of SFTP
3. Update connection code

**Contact Henry** to confirm which protocol is enabled.

---

## 🎯 **Testing Checklist**

**Before Testing:**
- ✅ Henry has configured router FTP/SFTP
- ✅ Credentials confirmed and working
- ✅ Port number confirmed (22 or 21)
- ✅ SD drive accessible and mounted
- ✅ `/media-transfer-temp/` directory exists

**During Testing:**
- ✅ Upload test .jpg file
- ✅ Verify file appears on router SD drive
- ✅ Check backend logs for connection success
- ✅ Test email with download link
- ✅ Verify download works

**After Testing:**
- ✅ Confirm file integrity
- ✅ Test multiple files
- ✅ Test with different file types
- ✅ Verify auto-delete works (30 days)

---

## 📞 **Contact Information**

**Henry's Contact:**
- Email: `hbremers@gmail.com`
- Phone: `1 (303) 249-4676`

**Meeting Note:**
- November 2 meeting time change: MDT → MST
- Check for meeting conflicts

---

## ⚠️ **Important Notes**

1. **No VPN Required** - Direct connection via static IP
2. **For Demonstration Only** - Not for production with many users
3. **Router Setup Required** - Henry needs to configure router
4. **SD Drive Storage** - Files stored on router SD drive
5. **Static IP** - Always accessible via `72.229.56.211`

---

## 🚀 **Once Henry Configures Router**

1. **Update credentials** in `connect-sftp.cjs` (if different)
2. **Test connection** from terminal
3. **Start backend server**
4. **Test upload** via web interface
5. **Verify on router SD drive**

**Everything is ready - just need router configuration from Henry!** 🎯


