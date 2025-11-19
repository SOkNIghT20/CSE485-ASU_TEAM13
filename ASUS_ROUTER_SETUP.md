# ASUS Router Media Transfer Setup

## ✅ **Updated Configuration - Using Static IP (No VPN Required!)**

Henry has provided the **static IP** for the ASUS Router. Media Transfer now connects **directly** via static IP - **NO VPN required!**

---

## 📋 **Configuration Details**

### **SFTP Server (ASUS Router)**
- **Static IP**: `72.229.56.211`
- **Port**: `22` (SFTP) or `21` (FTP) - Henry will confirm
- **Router URL**: `http://router.asus.com`
- **Storage**: SD Drive connected to router
- **Path**: `/media-transfer-temp/` on SD drive

### **Connection Info**
- **Username**: `henry1` (to be confirmed with Henry)
- **Password**: `DropInn12` (to be confirmed with Henry)
- **No VPN Required** - Direct connection via static IP!

---

## 🔧 **What Was Updated**

### **1. SFTP Configuration**

**File**: `src/app/media-transfer/connect-sftp.cjs`

**Changed:**
- ✅ Host: `192.168.50.137` → `72.229.56.211` (static IP)
- ✅ Path: `/mnt/...` → `/media-transfer-temp/` (router SD drive)
- ✅ Removed VPN requirement
- ✅ Direct connection via static IP

---

## 🚀 **How to Set Up**

### **Step 1: Confirm Router Credentials with Henry**

**Contact Henry** to get:
1. ✅ Router SFTP/FTP username
2. ✅ Router SFTP/FTP password  
3. ✅ Port number (22 for SFTP or 21 for FTP)
4. ✅ SD drive mount path (if different)
5. ✅ Router admin access to configure if needed

**Contact:**
- Email: `hbremers@gmail.com`
- Phone: `1 (303) 249-4676`

---

### **Step 2: Test Connection**

**Test SFTP/FTP connection manually:**

```bash
# Test SFTP (port 22)
sftp henry1@72.229.56.211
# Enter password when prompted

# OR Test FTP (port 21) if SFTP doesn't work
ftp 72.229.56.211
# Enter username and password when prompted
```

---

### **Step 3: Verify Router Access**

**Check router admin panel:**

1. **Open browser**: `http://router.asus.com`
2. **Login** (Henry will provide admin credentials)
3. **Check FTP/SFTP settings**:
   - Enable FTP/SFTP server
   - Set port (22 for SFTP or 21 for FTP)
   - Configure SD drive access
   - Set user permissions

---

### **Step 4: Start Servers (No VPN Needed!)**

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

**No VPN connection needed!** ✅

---

## 🧪 **Testing**

### **Test Upload:**

1. **Go to**: `http://localhost:4200/mediaTransfer`
2. **Upload a test file** (Henry mentioned testing with a .jpg)
3. **Check backend terminal** for:
   - ✅ "Connecting to SFTP server..."
   - ✅ "Connected!"
   - ✅ "Files uploaded successfully to SFTP server"

### **Verify on Router SD Drive:**

1. **Connect to router** via `http://router.asus.com`
2. **Check SD drive** for uploaded files in:
   ```
   /media-transfer-temp/{uid}/{filename}
   ```

---

## 📁 **File Storage Structure**

**On Router SD Drive:**
```
/media-transfer-temp/
  └── {uid}/              # Unique ID per transfer
      ├── file1.jpg
      ├── file2.pdf
      └── ...
```

---

## 🔐 **Security Notes**

### **Current Setup:**
- ✅ **Static IP** - Publicly accessible
- ⚠️ **Password in Code** - Should move to environment variables
- ⚠️ **No VPN** - Direct internet access
- ✅ **Limited Users** - Only for demonstration/presentation

### **For Production:**
- ✅ Use environment variables for credentials
- ✅ Consider adding basic authentication
- ✅ Monitor file uploads
- ✅ Limit file access

---

## ⚙️ **Configuration Options**

### **If SFTP Doesn't Work (Port 22):**

**Try FTP (Port 21) instead:**

1. **Update `connect-sftp.cjs`:**
   ```javascript
   port: 21, // FTP port
   ```

2. **Or use FTP library:**
   ```bash
   npm install basic-ftp
   ```

### **Router Admin Configuration:**

**Henry needs to configure on router:**
1. **Enable FTP/SFTP service**
2. **Set port** (22 for SFTP recommended)
3. **Configure SD drive mount**
4. **Set user permissions** for SD drive access
5. **Enable external access** (if needed for testing)

---

## 🐛 **Troubleshooting**

### **"Connection timeout" or "Cannot connect"**

**Possible issues:**
1. ✅ Router SFTP/FTP service not enabled
2. ✅ Wrong port number (try 21 for FTP)
3. ✅ Firewall blocking connection
4. ✅ Router not accessible from your network
5. ✅ Wrong credentials

**Solution:**
- Contact Henry to verify router configuration
- Test connection manually first
- Check router admin panel settings

### **"Permission denied"**

**Solution:**
- Verify user has write permissions on SD drive
- Check SD drive mount point
- Verify path exists: `/media-transfer-temp/`

### **"SD drive not found"**

**Solution:**
- Verify SD drive is connected to router
- Check router admin panel for SD drive status
- Confirm mount point path with Henry

---

## 📝 **Next Steps**

### **1. Contact Henry for:**
- ✅ Router SFTP/FTP credentials
- ✅ Port confirmation (22 or 21)
- ✅ SD drive path verification
- ✅ Router admin access (if needed)
- ✅ Test file (.jpg) to try upload

### **2. Test Connection:**
```bash
# Test from terminal
sftp henry1@72.229.56.211
# OR
ftp 72.229.56.211
```

### **3. Start Testing:**
- Upload test file via web interface
- Verify file appears on router SD drive
- Test download functionality

---

## ✅ **Benefits of This Setup**

- ✅ **No VPN Required** - Direct connection
- ✅ **Static IP** - Always accessible
- ✅ **Router Storage** - Files on SD drive (not your laptop)
- ✅ **Presentation Ready** - For demo/presentation
- ✅ **Local System** - Not dependent on AWS

---

## 📞 **Support**

**Contact Henry for:**
- Router configuration
- SFTP/FTP credentials
- Port number confirmation
- SD drive setup
- Testing assistance

**Contact Info:**
- Email: `hbremers@gmail.com`
- Phone: `1 (303) 249-4676`

---

## 🎯 **Current Status**

- ✅ **SFTP Configuration Updated** - Using static IP `72.229.56.211`
- ✅ **No VPN Required** - Direct connection
- ⏳ **Need Router Credentials** - Contact Henry
- ⏳ **Need Port Confirmation** - 22 (SFTP) or 21 (FTP)
- ⏳ **Router Setup** - Henry to configure SD drive access

**Once Henry provides credentials and confirms router setup, you can test Media Transfer!** 🚀


