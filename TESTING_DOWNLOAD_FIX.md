# Download Link Fix - Testing Guide

## ✅ What Was Fixed

### **Problem:**
Email download links were incorrect and recipients couldn't download files.

### **Solution:**
Fixed the download URL in the email to correctly point to:
```
http://localhost:3000/media-transfer/get-media-link/{uid}/{filename}
```

---

## 🧪 How to Test

### **Step 1: Upload a New File**

1. Go to: `http://localhost:4200/mediaTransfer`
2. Click the blue upload button
3. Select a file (e.g., `lab4.pdf`)
4. Fill in:
   - **Your Email**: Your actual email address
   - **Recipient Email**: Your email (or another email you can check)
   - **Subject**: "Test Download"
   - **Message**: "Testing file download"
5. Click **"Send Email"**

### **Step 2: Check Your Email**

1. Open your email inbox
2. Look for email from: `digiclips.mediatransfer@gmail.com`
3. Subject: "Test Download" (or what you entered)
4. You should see:
   - Message from sender
   - Downloadable file links (clickable)
   - Legal disclaimer
   - Expiration notice

### **Step 3: Test the Download**

1. **Click the file link** in the email
2. Your browser should:
   - Either **download the file automatically**
   - Or **open a download prompt**
3. **Verify the file** opens correctly

---

## 🔗 Download Link Format

**Email Link:**
```
http://localhost:3000/media-transfer/get-media-link/{uid}/{filename}
```

**Example:**
```
http://localhost:3000/media-transfer/get-media-link/abc-123-def/lab4.pdf
```

---

## 📂 Where Files are Stored

Files are saved locally in:
```
server/media-storage/{uid}/
  └── filename.pdf
```

**To verify a file was uploaded:**
```bash
ls server/media-storage/
```

You should see directories named with UIDs, each containing the uploaded files.

---

## ⚠️ Troubleshooting

### **"File not found" when clicking link**

**Possible causes:**
1. Backend server not running
2. UID is incorrect
3. File wasn't uploaded successfully

**Solution:**
```bash
# Check if file exists
ls server/media-storage/*/

# Restart backend if needed
cd server && npm run debug
```

### **Link doesn't open in browser**

**Cause:** Email client may not allow clickable links

**Solution:**
- Copy the link manually
- Paste into browser address bar
- Press Enter

### **Download starts but file is corrupted**

**Cause:** File wasn't copied correctly during upload

**Solution:**
- Upload the file again
- Make sure backend console shows no errors

---

## 📧 Email Template

Recipients will receive an email like this:

```
Subject: Test Download
From: digiclips.mediatransfer@gmail.com

File(s) Sent by: youremail@example.com

Message from the Sender:
Testing file download

---
Downloadable Links:
• lab4.pdf  [Download]

---
The link(s) will expire in: [Date]
Files will be automatically deleted after 30 days

If you were not expecting this email or have any questions, 
please reach out to digiclips.mediatransfer@gmail.com

[Legal Disclaimer - FAIR USE NOTICE follows]
```

---

## ✅ Success Criteria

- ✅ Email received with download links
- ✅ Links are clickable
- ✅ File downloads when clicked
- ✅ Downloaded file opens correctly
- ✅ Sender receives confirmation email

---

## 🎯 Next Test

After confirming downloads work:

1. **Test with multiple files**
2. **Test with different file types** (.pdf, .jpg, .docx, etc.)
3. **Test with multiple recipients**
4. **Verify sender confirmation email** includes all recipient addresses

---

## 🔧 Technical Notes

### **Backend Route:**
```javascript
router.get('/get-media-link/:uid/:fileName', async (req, res) => {
    const filePath = path.join(LOCAL_STORAGE_DIR, uid, fileName);
    res.download(filePath, fileName);
});
```

### **Mounted At:**
```javascript
app.use('/media-transfer', mediaTransfer);
```

### **Full URL:**
```
http://localhost:3000/media-transfer/get-media-link/:uid/:fileName
```

---

## 📝 Important Notes

1. **For local testing only** - Uses `localhost:3000`
2. **For production** - Would use actual domain name
3. **File encoding** - Filenames are URL-encoded in links
4. **File expiration** - 7 days (configurable in code)
5. **Auto-delete** - 30 days (admin can configure)

