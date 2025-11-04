# SFTP Server Setup Guide

## ✅ SFTP Server Configuration Complete!

The Media Transfer module is now configured to use **SFTP server** instead of local storage.

---

## 📋 **SFTP Server Details**

**Current Configuration** (in `src/app/media-transfer/connect-sftp.cjs`):
- **Host**: `192.168.50.137`
- **Port**: `22`
- **Username**: `henry1`
- **Password**: `DropInn12`
- **Base Directory**: `/mnt/9b90f2ca-dd8c-46d9-8348-46c21a5eda95/media-transfer-temp`

---

## 🔐 **Requirements**

### **1. VPN Connection Required**

You **MUST** be connected to the VPN to access the SFTP server:

1. **Connect to OpenVPN** (as mentioned in README.md):
   ```bash
   sudo openvpn --config config.ovpn
   ```
2. **Credentials**:
   - Username: `Buffalo22`
   - Password: `2c@nBird`

3. **Verify VPN Connection**: 
   - You should be able to reach `192.168.50.137`

---

## 🔧 **How It Works**

### **Upload Flow:**
1. User uploads file via web interface
2. File temporarily stored in `src/app/media-transfer/uploads/`
3. File uploaded to SFTP server at:
   ```
   /mnt/.../media-transfer-temp/{uid}/{filename}
   ```
4. Temporary file deleted after successful upload

### **Download Flow:**
1. User clicks download link in email
2. Backend connects to SFTP server
3. File downloaded from SFTP to temporary location
4. File served to user and then cleaned up

---

## 🚀 **Testing SFTP Setup**

### **Step 1: Connect to VPN**

```bash
# In Terminal 1
sudo openvpn --config config.ovpn
# Enter credentials when prompted
```

### **Step 2: Verify SFTP Connection**

```bash
# Test SFTP connection manually (optional)
sftp henry1@192.168.50.137
# Enter password: DropInn12
```

### **Step 3: Start Backend Server**

```bash
# In Terminal 2
cd server
npm run debug
```

**Expected Output:**
- ✅ "Connecting to SFTP server..."
- ✅ "Connected!" (when first upload/download happens)

### **Step 4: Test Upload**

1. Go to: `http://localhost:4200/mediaTransfer`
2. Upload a test file
3. Check backend terminal for:
   - ✅ "Files uploaded successfully to SFTP server"

---

## 📁 **File Storage Structure on SFTP Server**

```
/mnt/9b90f2ca-dd8c-46d9-8348-46c21a5eda95/media-transfer-temp/
  └── {uid}/              # Unique ID per transfer
      ├── file1.pdf
      ├── file2.jpg
      └── ...
```

**Example:**
```
/mnt/.../media-transfer-temp/abc-123-def-456/
  └── lab4.pdf
```

---

## ⚙️ **Configuration**

### **Update SFTP Settings**

Edit: `src/app/media-transfer/connect-sftp.cjs`

```javascript
let config = {
    host: '192.168.50.137',        // SFTP server IP
    port: 22,                       // SFTP port
    username: 'henry1',            // SFTP username
    password: 'DropInn12',         // SFTP password
    // ...
};
```

### **Environment Variables (Future Enhancement)**

For better security, consider using environment variables:

```javascript
let config = {
    host: process.env.SFTP_HOST || '192.168.50.137',
    port: process.env.SFTP_PORT || 22,
    username: process.env.SFTP_USERNAME || 'henry1',
    password: process.env.SFTP_PASSWORD || 'DropInn12',
    // ...
};
```

---

## 🔒 **Security Notes**

### **Current Security:**

1. **VPN Required** - SFTP server only accessible via VPN
2. **Password in Code** - ⚠️ Should move to environment variables
3. **No Public IP Exposure** - Server not directly exposed to internet

### **Recommended Improvements:**

1. ✅ **Use Environment Variables** for credentials
2. ✅ **SSH Key Authentication** instead of password
3. ✅ **Encrypted Configuration** for sensitive data
4. ✅ **Access Logging** for security audit

---

## 🐛 **Troubleshooting**

### **Error: "Failed to connect to SFTP server"**

**Solution:**
1. ✅ Check VPN is connected
2. ✅ Verify SFTP server is reachable:
   ```bash
   ping 192.168.50.137
   ```
3. ✅ Check credentials are correct
4. ✅ Ensure SFTP service is running on server

### **Error: "Error uploading files to SFTP server"**

**Solution:**
1. ✅ Check file permissions on SFTP server
2. ✅ Verify directory exists and is writable
3. ✅ Check disk space on SFTP server
4. ✅ Review backend logs for detailed error

### **Error: "File not found after download"**

**Solution:**
1. ✅ Verify file was uploaded successfully
2. ✅ Check UID and filename match
3. ✅ Verify SFTP server file path is correct
4. ✅ Check file permissions on SFTP server

---

## 📊 **Monitoring**

### **Check SFTP Connection Status:**

Backend terminal will show:
- `"Connecting to SFTP server..."` - Connection attempt
- `"Connected!"` - Successful connection
- `"SFTP Error: ..."` - Connection failed

### **Check Uploaded Files:**

Files are stored on SFTP server at:
```
/mnt/9b90f2ca-dd8c-46d9-8348-46c21a5eda95/media-transfer-temp/{uid}/
```

---

## 🔄 **Auto-Cleanup**

The SFTP server automatically deletes files after **7 days** via cron job (configured in `connect-sftp.cjs`).

**Cron Schedule:**
- Runs daily at midnight
- Deletes files older than 7 days
- Logs cleanup activities

---

## 📝 **Next Steps**

1. ✅ **Test Upload**: Upload a file and verify it appears on SFTP server
2. ✅ **Test Download**: Click download link and verify file downloads
3. ✅ **Monitor Logs**: Check backend terminal for SFTP connection status
4. ✅ **Verify VPN**: Ensure VPN connection is stable during testing

---

## 🎯 **Benefits of SFTP Storage**

✅ **Centralized Storage** - All files in one location  
✅ **VPN Protected** - Secure access via VPN only  
✅ **Auto-Cleanup** - Files automatically deleted after expiration  
✅ **Scalable** - Can handle large files (2GB limit)  
✅ **Backup Ready** - Files on dedicated server (not your laptop)  

---

## ⚠️ **Important Notes**

1. **VPN Connection Required** - Media Transfer won't work without VPN
2. **Server Access** - Requires VPN credentials from Henry/team
3. **File Permissions** - Ensure SFTP user has write/read permissions
4. **Network Stability** - VPN connection must be stable for large uploads

---

## 🔗 **Related Files**

- **SFTP Connection**: `src/app/media-transfer/connect-sftp.cjs`
- **API Routes**: `server/routes/media-transfer-api.js`
- **Configuration**: See README.md for VPN setup instructions

---

## 📞 **Support**

If you encounter issues:
1. Check VPN connection status
2. Verify SFTP server is accessible: `ping 192.168.50.137`
3. Review backend terminal logs
4. Contact team lead for SFTP server access

