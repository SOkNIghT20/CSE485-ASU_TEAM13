# Media Transfer Module for SE 
## Team: Media Messengers Ohio State University SP25

## Proposed Functionality
1.  ExpressJS folder with API endpoint
2.  Upon API endpoint hit:
-   Establishes connection with Chrome Remote Desktop SFTP Server
-   Starts direct download of file
3.  Endpoint is Triggered in association with the file's fileID and identifier of user (uid or email)
4.  Endpoint is Triggered by direct API endpoint link sent through Nodemailer emailing.

## To run api
-   cd into media-transfer folder
-   run `npm run debug`

## To run frontend
-   cd into repository
-   `npm install -g @angular/cli`
-   `npm install`
-   `ng serve`
-   If you get the following error: "... cannot be loaded because running scripts is disabled on this system..."
       Enter this into your terminal: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

## Email service
- Make sure back end is running
- Make sure you are connected to VPN (for download link to work)
- Access the "Media Transfer" tab through the Digi Clips Frontend
- Fill out the fields accordingly
       Enter a SINGLE email for the sender email (optional)
       You can enter a single email, or multiple emails in regex format for the recipient
       The only required fields are the recipient email and 1 or more files.
- Recipient must be connected to DigiClip's OpenVPN profile in order for download link to work
- CHECK SPAM MAIL. Some mail providers (gmail) will flag the email as spam. 

## Input Requirements of Media Transfer System
- File name must not have any spaces
- File must be < 10 Gb
- Email must be a valid email format