//HTML template formats email. This can be changed
var HTML_TEMPLATE = require("./mail-template.cjs");
var nodemailer = require("nodemailer");

//Create transport object with credentials
const transporter = nodemailer.createTransport({
    //MUST BE GMAIL BECAUSE OF DIGICLIPS's ACCOUNT
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    //Use SSL:
    secure: true,
    //Sender credentials:
    auth: {
        user: "digiclips.mediatransfer@gmail.com",
        //APP PASSWORD
        pass: "mqzt krag hbhn sibt",
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
        from: "digiclips.mediatransfer@gmail.com",
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

