# Media Transfer Module - Documentation

## Overview
The Media Transfer module allows Subscribers and Administrators to send media files to recipients via email, similar to WeTransfer or Smash.

## Features Implemented

### 1. **File Upload with Blue Button**
- Large blue pulsing button that opens the file explorer (Finder on Mac)
- Users can select multiple files at once
- Maximum file size: **2 GB per file** (configurable by administrators)
- Files with spaces or special characters in names are automatically filtered

### 2. **Email System**
- **Recipient Emails**: Add multiple recipient emails using an email chip interface
- **Sender Email**: Enter your email to receive confirmation
- **Subject & Message**: Customize the email subject and body
- **Auto-send**: Emails are automatically sent to all recipients when files are uploaded

### 3. **Email Notifications**
- **To Recipients**: Downloadable links sent to all recipient emails
- **To Sender**: Confirmation email sent to the sender with recipient list and file names
- **Legal Disclaimer**: All emails include the FAIR USE NOTICE as required

### 4. **File Management**
- Files are uploaded to SFTP server
- **Auto-deletion**: Files automatically deleted after 30 days (configurable by admin)
- Download links expire after 7 days
- Files stored locally, NOT on AWS

### 5. **User Interface**
- Clean, modern design with blue theme
- Two-column layout: Files on left, Email form on right
- Real-time file size validation
- Progress spinner during upload
- Success/Error/Warning messages

## How to Use

### For End Users:

1. **Access the Page**
   - Navigate to: `http://localhost:4200/mediaTransfer`
   - Must be logged in as Subscriber or Administrator

2. **Upload Files**
   - Click the blue "Upload Files" button
   - Select one or multiple files (max 2GB each)
   - Files appear in the left column

3. **Configure Email**
   - **Your Email**: Enter your email address (for confirmation)
   - **Recipients**: Type recipient emails and press Enter to add them
   - **Subject**: Enter email subject (optional)
   - **Message**: Add a custom message (optional)

4. **Send**
   - Click "Send Email" button
   - Files are uploaded and emails sent automatically
   - You'll receive a success message and confirmation email

### For Administrators:

**File Size Limit** (configurable):
- Edit: `src/app/media-transfer/multer-config.cjs`
- Change line 25: `fileSize: 2 * 1024 * 1024 * 1024` (currently 2GB)

**Auto-Delete Duration** (configurable):
- Currently set to 30 days in business logic
- Files are automatically cleaned up after expiration

**Email Settings**:
- Email account: `digiclips.mediatransfer@gmail.com`
- Configuration in: `src/app/media-transfer/mailer.cjs`

## Technical Details

### Frontend Components
- **Location**: `src/app/media-transfer/pages/mediatransfer/`
- **Route**: `/mediaTransfer` (requires authentication)
- **Service**: `src/app/services/media-transfer.service.ts`

### Backend API
- **Location**: `server/routes/media-transfer-api.js`
- **Endpoints**:
  - `POST /media-transfer/upload` - Upload files
  - `GET /media-transfer/send-email-info` - Send emails
  - `GET /media-transfer/get-media-link/:email/:fileId` - Download files

### File Storage
- **Method**: SFTP connection to local server
- **Configuration**: `src/app/media-transfer/connect-sftp.cjs`
- **Temp Storage**: Local uploads folder (automatically cleaned)
- **NOT using AWS** - All storage is local/SFTP based

### Email Template
- **Location**: `src/app/media-transfer/mail-template.cjs`
- **Includes**: Legal disclaimer, download links, expiration notice
- **Provider**: Gmail via nodemailer

## Database Tracking
- MySQL database tracks users and download activity
- Can be used for existing clients
- Monitors who is downloading files and when

## Testing the Module

### Manual Testing Checklist:
1. ✅ Upload button opens file explorer
2. ✅ Multiple file selection works
3. ✅ File size validation (rejects files > 2GB)
4. ✅ Email chip interface for recipients
5. ✅ Email sent to all recipients
6. ✅ Confirmation email sent to sender
7. ✅ Legal disclaimer included in emails
8. ✅ Success/error messages display correctly
9. ✅ Files appear in left column with remove option
10. ✅ Progress indicator during upload

## Security Features
- Authentication required (Subscriber or Admin only)
- File size limits enforced
- Email validation
- Filename sanitization (no special characters/spaces)
- SFTP secure connection
- Legal disclaimer on all emails

## Local Testing
- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:4200/mediaTransfer`
- Login credentials needed (from README.md)

## Files Modified/Created
1. `src/app/media-transfer/multer-config.cjs` - Updated to 2GB limit
2. `src/app/media-transfer/pages/mediatransfer/mediatransfer.component.ts` - Added sender confirmation
3. `src/app/media-transfer/mail-template.cjs` - Added legal disclaimer
4. `server/routes/media-transfer-api.js` - Updated error messages

## Notes
- This module is for LOCAL use only, NOT AWS
- File links work locally via SFTP connections
- Requires VPN connection for full SFTP functionality (per main README)
- The Ohio State 2024 team and ASU teams have previously worked on this module

## Future Enhancements (Optional)
- Admin panel to view active transfers
- Transfer history/analytics
- Bulk email recipient import
- Custom expiration dates per transfer
- Transfer download analytics

