# SFTP Configuration Summary

## ✅ **SFTP Configuration Complete**

Media Transfer is configured to use **SFTP (Secure File Transfer Protocol)** via the ASUS Router static IP.

---

## 🔐 **SFTP Details**

### **Connection Information:**
- **Protocol**: **SFTP** (Secure File Transfer Protocol)
- **Host**: `72.229.56.211` (Static IP - ASUS Router)
- **Port**: `22` (SFTP standard port)
- **Library**: `ssh2-sftp-client` (SFTP-specific)
- **Storage**: SD Drive connected to ASUS Router

### **Why SFTP?**
- ✅ **Secure** - Encrypted file transfers
- ✅ **Better Security** - SSH-based authentication
- ✅ **Standard Port** - Port 22 (widely supported)
- ✅ **No VPN Required** - Direct connection via static IP

---

## ⚙️ **Configuration**

### **File**: `src/app/media-transfer/connect-sftp.cjs`

```javascript
let config = {
    host: '72.229.56.211', // Static IP - ASUS Router SFTP Server
    port: 22,               // SFTP port (secure file transfer)
    username: 'henry1',    // Router SFTP username
    password: 'DropInn12', // Router SFTP password
    // ...
};
```

---

## 📋 **What Henry Needs to Configure**

### **On ASUS Router (`http://router.asus.com`):**

1. **Enable SFTP Service**:
   - Access router admin panel
   - Enable SFTP/SSH service
   - Set port to `22` (SFTP standard port)

2. **Configure SD Drive**:
   - Mount SD drive
   - Set permissions for SFTP access
   - Create directory: `/media-transfer-temp/`

3. **Set SFTP Credentials**:
   - Username: `henry1` (or confirm with Henry)
   - Password: `DropInn12` (or confirm with Henry)
   - Permissions: Read/Write access to SD drive

4. **Allow External Access** (if needed):
   - Configure firewall to allow port 22
   - Set up port forwarding if behind NAT

---

## 🧪 **Testing SFTP Connection**

### **Step 1: Test from Terminal**

```bash
# Test SFTP connection
sftp henry1@72.229.56.211

# When prompted, enter password: DropInn12

# If successful, you'll see:
# sftp>

# Test commands:
# ls                    # List files
# cd media-transfer-temp  # Navigate to directory
# pwd                   # Show current directory
# exit                  # Disconnect
```

### **Step 2: Verify Router SFTP Service**

**Check if SFTP is enabled on router:**
1. Access: `http://router.asus.com`
2. Navigate to: **FTP Server** or **SFTP Settings**
3. Verify:
   - ✅ SFTP service is **enabled**
   - ✅ Port is set to **22**
   - ✅ User credentials are set
   - ✅ SD drive is mounted and accessible

---

## 🚀 **Using Media Transfer**

### **Once SFTP is Configured:**

1. **Start Backend Server**:
   ```bash
   cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main/server
   npm run debug
   ```

2. **Start Frontend Server**:
   ```bash
   cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main
   npm start
   ```

3. **Access Media Transfer**:
   - Go to: `http://localhost:4200/mediaTransfer`
   - Upload files (max 2GB each)
   - Files will be stored on router SD drive via SFTP

4. **Check Backend Logs**:
   - Should see: "Connecting to SFTP server..."
   - Should see: "Connected!" (when successful)
   - Should see: "Files uploaded successfully to SFTP server"

---

## 🔍 **Troubleshooting SFTP**

### **"Connection timeout"**

**Possible issues:**
1. SFTP service not enabled on router
2. Firewall blocking port 22
3. Router not accessible from your network
4. Wrong IP address

**Solution:**
- Verify router SFTP is enabled
- Test connection manually: `sftp henry1@72.229.56.211`
- Contact Henry to check router configuration

### **"Permission denied"**

**Solution:**
- Check SFTP user permissions on SD drive
- Verify `/media-transfer-temp/` directory exists
- Confirm user has write access

### **"Authentication failed"**

**Solution:**
- Verify username/password with Henry
- Check if credentials are correct on router
- Test manual connection first

---

## ✅ **SFTP vs FTP Comparison**

| Feature | SFTP (Current) | FTP |
|---------|----------------|-----|
| **Port** | 22 | 21 |
| **Security** | Encrypted | Not encrypted |
| **Authentication** | SSH-based | Username/Password |
| **Firewall** | Usually allowed | May be blocked |
| **Library** | ssh2-sftp-client | basic-ftp |

**✅ SFTP is MORE SECURE - Recommended!**

---

## 📝 **Next Steps**

1. **Contact Henry** to:
   - ✅ Enable SFTP service on router (port 22)
   - ✅ Configure SD drive for SFTP access
   - ✅ Confirm credentials (`henry1` / `DropInn12`)
   - ✅ Create `/media-transfer-temp/` directory

2. **Test Connection**:
   ```bash
   sftp henry1@72.229.56.211
   # Enter password when prompted
   ```

3. **Start Testing**:
   - Upload test .jpg file
   - Verify file appears on router SD drive
   - Test download functionality

---

## 🎯 **Current Status**

- ✅ **SFTP Configured** - Port 22, using ssh2-sftp-client
- ✅ **Static IP Set** - 72.229.56.211
- ✅ **No VPN Required** - Direct connection
- ⏳ **Need Router Setup** - Henry to configure SFTP on router
- ⏳ **Need Credentials Confirmation** - Verify with Henry

**Everything is configured for SFTP - just need router configuration from Henry!** 🚀


