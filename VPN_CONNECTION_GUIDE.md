# VPN Connection Guide

## ✅ OpenVPN Installed Successfully!

OpenVPN has been installed via Homebrew. You're ready to connect!

---

## 📋 **Step-by-Step VPN Connection**

### **Step 1: Get the config.ovpn File**

You need to obtain the `config.ovpn` file from:
- **Henry** (team lead)
- **Team repository** (if shared)
- **Previous team members**

**Ask Henry for:**
- VPN configuration file (`config.ovpn`)
- VPN credentials (if changed)
- VPN server details

---

### **Step 2: Place config.ovpn File**

Once you have the file, place it in your project root:

```bash
# Option 1: Place in project root
cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main
# Copy config.ovpn here

# Option 2: Place anywhere (remember the path)
# Copy config.ovpn to any location you prefer
```

---

### **Step 3: Connect to VPN**

**In Terminal 1** (keep this running):

```bash
# Navigate to where config.ovpn is located
cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main

# Connect to VPN (enter your Mac password when prompted)
sudo openvpn --config config.ovpn

# Then enter VPN credentials:
# Username: Buffalo22
# Password: 2c@nBird
```

**Expected Output:**
```
Wed Oct 28 10:00:00 2025 OpenVPN 2.6.15 ...
Wed Oct 28 10:00:01 2025 Attempting to establish TCP connection ...
Wed Oct 28 10:00:02 2025 TCP connection established with ...
Wed Oct 28 10:00:03 2025 Initialization Sequence Completed
```

**Keep this terminal window open!** VPN must stay connected.

---

## ✅ **Verify VPN Connection**

### **Test SFTP Server Access:**

Once VPN is connected, test if you can reach the SFTP server:

```bash
# In a new terminal (Terminal 2), test SFTP connection
ping -c 3 192.168.50.137

# You should see successful ping replies
```

**Or test SFTP manually:**

```bash
sftp henry1@192.168.50.137
# Enter password: DropInn12
# If successful, you'll see: sftp>
# Type 'exit' to disconnect
```

---

## 🚀 **Start Servers After VPN Connection**

### **Terminal 2 - Backend Server:**

**Wait until VPN is connected** (Terminal 1 shows "Initialization Sequence Completed"), then:

```bash
cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main/server
npm run debug
```

**Expected Output:**
- Backend starts successfully
- No SFTP connection errors
- Server listening on port 3000

---

### **Terminal 3 - Frontend Server:**

```bash
cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main
npm start
```

**Expected Output:**
- Angular compilation
- Server listening on port 4200

---

## 📋 **Complete Setup Order**

1. ✅ **Install OpenVPN** (DONE via Homebrew)
2. ⏳ **Get config.ovpn file** (Need from Henry/team)
3. ⏳ **Connect VPN** (Terminal 1)
4. ⏳ **Start Backend** (Terminal 2 - after VPN connected)
5. ⏳ **Start Frontend** (Terminal 3)

---

## 🔍 **Troubleshooting**

### **"config.ovpn: No such file or directory"**

**Solution:**
- Make sure `config.ovpn` is in the current directory
- Or use full path: `sudo openvpn --config /path/to/config.ovpn`

### **"Cannot resolve hostname"**

**Solution:**
- Check your internet connection
- Verify config.ovpn file is correct
- Contact Henry for updated config file

### **"Authentication failed"**

**Solution:**
- Verify VPN credentials:
  - Username: `Buffalo22`
  - Password: `2c@nBird`
- If credentials don't work, ask Henry for current credentials

### **"SFTP connection timeout"**

**Solution:**
- Make sure VPN is connected first
- Verify VPN connection status: `ping 192.168.50.137`
- Check if SFTP server is running

---

## 📞 **Next Steps**

### **1. Get config.ovpn File**

Contact **Henry** at:
- Email: `hbremers@gmail.com`
- Phone: `1 (303) 249-4676`

**Ask for:**
- VPN configuration file (`config.ovpn`)
- VPN server access
- Updated credentials (if changed)

### **2. Once You Have config.ovpn:**

1. Copy it to project root: `/Users/sonit/Desktop/ASU_5A_Fall-2025-main/`
2. Connect VPN using the command above
3. Verify connection works
4. Start backend and frontend servers

---

## 📝 **Quick Reference**

**VPN Connection:**
```bash
cd /Users/sonit/Desktop/ASU_5A_Fall-2025-main
sudo openvpn --config config.ovpn
# Username: Buffalo22
# Password: 2c@nBird
```

**Verify Connection:**
```bash
ping 192.168.50.137
# Should see successful replies
```

**SFTP Test:**
```bash
sftp henry1@192.168.50.137
# Password: DropInn12
```

---

## ⚠️ **Important Notes**

1. **VPN must be connected** before starting backend server
2. **Keep VPN terminal running** - Don't close it while working
3. **Get config.ovpn from team** - Required for connection
4. **SFTP requires VPN** - Cannot connect without VPN

---

## 🎯 **After VPN is Connected**

Once VPN is connected and servers are running:

1. ✅ **Test Upload**: Go to `http://localhost:4200/mediaTransfer`
2. ✅ **Upload a file**: Files will be stored on SFTP server
3. ✅ **Verify files**: Check SFTP server for uploaded files
4. ✅ **Test download**: Click download link in email

---

**Current Status:**
- ✅ OpenVPN installed
- ⏳ Need config.ovpn file (contact Henry)
- ⏳ VPN connection pending
- ⏳ SFTP access pending

Once you have the config.ovpn file, you can connect to VPN and start using SFTP storage! 🚀


