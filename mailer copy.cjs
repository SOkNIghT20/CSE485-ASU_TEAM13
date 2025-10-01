//HTML template formats email. This can be changed
var HTML_TEMPLATE = require("./mail-template.cjs");
var nodemailer = require("nodemailer");

//Create transport object with credentials
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || undefined,
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

//Lambda function that sends email
const SENDMAIL = async (mail, result) => {
    try {
        const mailReturn = await transporter.sendMail(mail)
        result(mailReturn);
        return "200"
    } catch (error) {
        return "404"
    }
};

module.exports = function mailcall (sender,recipient, subject, body, link, expiry) {
    if(!recipient)return;

    const options = {
        from: process.env.FROM_DISPLAY || process.env.SMTP_USER,
        //Define recipient as a list or single email
        to: recipient,
        subject: subject,
        text: body,
        html: HTML_TEMPLATE(`File(s) Sent by: ${sender}`, `Message from the Sender:\n${body}\n\n<hr/>Downloadable Links:\n${link}`, expiry),
    }

    
    SENDMAIL(options, (mailReturn) => {
        console.log("Email sent successfully");
        console.log("MESSAGE ID: ", mailReturn.messageId);
    });
}

