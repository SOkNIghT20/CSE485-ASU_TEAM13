# DigiClips Media Transfer · CSE485 ASU Team 13

A focused slice of the DigiClips Media Transfer project that demonstrates the upload → email → download flow using an Angular frontend and a Node.js backend.

Scrum Master: **Sonit Sai Penchala**  
Core contributors: **Dhruv Shetty**, **Nirek Shah**, Team 13

---

## Overview

Media Transfer allows approved Subscribers and Administrators to send large files and notify recipients by email with a download link. Files are stored on DigiClips local storage and are auto deleted based on an admin policy. This repo includes the frontend feature module and configuration stubs that point the app to a local backend during development.

---

## Tech Stack

- Angular 16 or newer  
- TypeScript  
- Node.js 18 or 20 for tooling and API proxy  
- Backend expects Multer for uploads and Nodemailer for email

---

## Repository Layout

> Some files may be provided as templates named with the word `copy` in the filename. Rename them by removing the word `copy` and placing them in the correct folders as shown below.

Typical layout:

CSE485-ASU_TEAM13/
├── proxy.conf.json # Angular dev proxy to backend
├── README.md
└── src/
├── app/
│ └── media-transfer/
│ ├── mediatransfer.component.html
│ ├── mediatransfer.component.scss
│ ├── mediatransfer.component.ts
│ └── media-transfer.service.ts
└── environments/
├── environment.ts
└── environment.prod.ts

yaml
Copy code

If you see files like `mediatransfer.component copy.ts` or `environment copy.ts`, rename them to the names above and move them into the `src/` tree.

---

## Getting Started

### Prerequisites

- Node.js 18 or 20  
- npm 9 or newer  
- Angular CLI installed globally or use `npx ng`  
- Local backend running at `http://localhost:3000` for development

### Install

```bash
# Clone the repo
git clone https://github.com/SOkNIghT20/CSE485-ASU_TEAM13.git
cd CSE485-ASU_TEAM13

# Install frontend dependencies
npm install
One time setup: rename template files if present
bash
Copy code
# Examples. Run only if you see these "copy" files in the repo root.
# Adjust paths if your files are stored under src/ already.

# Environments
mkdir -p src/environments
mv "environment copy.ts" src/environments/environment.ts
mv "environment.prod copy.ts" src/environments/environment.prod.ts

# Proxy
mv "proxy.conf copy.json" proxy.conf.json

# Media Transfer feature files
mkdir -p src/app/media-transfer
mv "mediatransfer.component copy.html" src/app/media-transfer/mediatransfer.component.html
mv "mediatransfer.component copy.scss" src/app/media-transfer/mediatransfer.component.scss
mv "mediatransfer.component copy.ts" src/app/media-transfer/mediatransfer.component.ts
mv "media-transfer copy.service.ts" src/app/media-transfer/media-transfer.service.ts
Configuration
Angular environments
src/environments/environment.ts (development)

ts
Copy code
export const environment = {
  production: false,
  apiBase: '/api',
  downloadBase: '/api'
};
src/environments/environment.prod.ts (production)

ts
Copy code
export const environment = {
  production: true,
  apiBase: 'https://your-prod-api',
  downloadBase: 'https://your-prod-api'
};
Angular dev proxy
Create proxy.conf.json in the repo root:

json
Copy code
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug",
    "pathRewrite": { "^/api": "" }
  }
}
Update package.json to use the proxy:

json
Copy code
{
  "scripts": {
    "start": "ng serve --proxy-config proxy.conf.json",
    "build": "ng build"
  }
}
Running the App
bash
Copy code
# Start Angular dev server with proxy
npm run start

# Open the app
# http://localhost:4200
Navigate to the Media Transfer screen in the app.

Using Media Transfer
Enter one or more recipient email addresses.

Attach one or more files. File names must not contain spaces. Respect the size limit set by the backend.

Click Send.

Recipients receive an email with a download link. Clicking the link downloads the file through the backend.

Expected Backend Endpoints
The frontend talks to a backend that exposes the following routes:

POST /media-transfer/upload

GET /media-transfer/send-email-info

GET /media-transfer/get-media-link/:uid/:fileName

GET /media-transfer/get-list/:username

If you are also running the backend locally, create a .env file in your backend project with variables similar to:

ini
Copy code
PORT=3000
CORS_ORIGIN=http://localhost:4200

MAX_FILE_SIZE_BYTES=10737418240
REJECT_FILENAMES_WITH_SPACES=true

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=digiclips.mediatransfer@gmail.com
SMTP_PASS=<gmail-app-password>
DOWNLOAD_BASE_URL=http://localhost:3000

SFTP_HOST=<host>
SFTP_PORT=22
SFTP_USER=<user>
SFTP_PASS=<password-or-key>
STORAGE_ROOT=/ssd/%UID%
Validation Rules
File name cannot contain spaces

File size must be under the configured limit

Recipient email must be valid format

The frontend should block invalid inputs and mirror backend error messages

Troubleshooting
API calls fail from the browser

Make sure the backend is running on http://localhost:3000 and the proxy target matches.

Check the dev tools Network tab for the proxied path that starts with /api.

Emails do not arrive

Verify SMTP credentials and use an app password if the account has 2FA.

Check the spam folder on the recipient side.

Download link fails

Confirm the link contains the correct uid and fileName.

Verify the file exists in backend storage and that permissions allow read access.

CORS or mixed origin errors

Ensure the Angular app uses the proxy, and the backend allows http://localhost:4200 in CORS.

Scripts
bash
Copy code
npm run start     # start Angular development server with proxy
npm run build     # production build
Contributing
Create a feature branch with the pattern feat/<short-name> or fix/<short-name>. Open a pull request with a short description, a list of changed files, and a screenshot or short clip that demonstrates the change. Keep commits scoped and readable.

License
Academic use for ASU CSE485 Team 13. External reuse requires sponsor approval.

Acknowledgments
Thanks to DigiClips sponsors for requirements and infrastructure guidance, and to prior university teams for handoff materials that informed this implementation.

