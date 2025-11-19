"use strict";
const config = require('./../config.json');
const nodemailer = require('nodemailer');
const docx = require('../routes/generateDocxHandler');
const pdf = require('../routes/generatePDFHandler');
const xlsx = require('../routes/generateXlsx');
//const htmlService = require('../app/services/generateHtml');
//const docxHtmlService = require('../services/docxHtmlService');
//onst fileNameService = require('./fileNameService');
const excelService = require('./excelService');
const simpleSearchHandler = require('../routes/tvSearchHandler');
const selectedChannel = 'All';
const htmlService = require('../services/htmlService');
const AWSEmail = require('../AWSemail/ses-client');

exports.sendEmailForCronJob = async function (searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds, emailaddresses, reportFormats, fileName) {

htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds).then((result) => {AWSEmail.sendEmail(emailaddresses, 'DigiClips Search Result', result)});

}

exports.sendEmailPendingUser = async function(email) {
	AWSEmail.sendEmailPlain(['maniswami23@gmail.com','bobshapiro40@gmail.com', 'hbremers@gmail.com'], 'DigiClips New User', 'There is a new user pending approval for the Digiclips Search Engine: '+ email);  
}

exports.sendEmailRegistration = async function(email, isVerified, isAccountExist) {
	if (!isAccountExist) {
		AWSEmail.sendEmailPlain([email], 'DigiClips Login Change', 'An administrator for Digiclips has cleared your login. Please contact for further information');
	}
	else {
		if (isVerified == 1) {
			AWSEmail.sendEmailPlain([email], 'DigiClips Login Verified', 'Congratulations, this account has been verified. You may now login to the search engine');
		}
		else {
			AWSEmail.sendEmailPlain([email], 'DigiClips Login Not Verified', 'An administrator for Digiclips has blocked your login. Please contact for further information');
		}
	}
};


/**
 * Sends an email for the given query to specified email addresses.
 * @param {string} searchQuery - the query to execute for the email
 * @param {string} numOfRecords - the number of records to email
 * @param {string} emailaddresses - a list of email addresses to send to
 * @param {string} reportFormats - a list of the formats to deliver reports as
 * @param {Date} date - filters results to only those after this date
 * @returns {Promise.<*>} - a promise that completes when the email is sent
 */
exports.sendEmailForQuery2 = async function (emailaddresses, htmlString, numOfRecords, reportFormats, fileName, searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime, endTime, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds) {
    console.log("TESTINGG3....");
    const transporter = nodemailer.createTransport(config.email);


    // const htmlString =   htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
    //                                 stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers,
    //                                 allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio);


    const mailOptions = {
        from: config.email.from,
        // emailaddresses should be a string of comma-separated emails
        to: emailaddresses,
        subject: 'DigiClips Broadcast Report',
        html: htmlString,
        attachments: []
    };

    console.log("Report formats requested..", reportFormats);

    if (reportFormats.includes("email") || reportFormats === '') {
        // put report in email body if no formats are selected
        mailOptions.html = htmlString;
    } else {
        mailOptions.html = "Please find your DigiClips report(s) attached.";
    }

    if (reportFormats.includes("doc")) {
        // const docXhtmlString =  docxHtmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, country,
        //                                  stateProvince, city, startDateTime, endDateTime, numOfRecords, allChannels, allPapers,
        //                                  allMags, allCountries, allStates, allCities, newsIds, magIds);

        const doc = await docx.generateDocx(htmlString);
        console.log("Doc was selected");
        mailOptions.attachments.push({
            filename: fileName + '.docx',
            content: doc
        });
    }
    if (reportFormats.includes("excel")) {
        const excelFile = await excelService.generateXlsx(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
                                        stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime, endTime, numOfRecords, allChannels, allPapers,
                                        allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds);
        mailOptions.attachments.push({
            filename: fileName + '.xlsx',
            content: excelFile
        });
    }
    if (reportFormats.includes("pdf")) {
        const pdfContent = await pdf.generatePDF(htmlString);
        mailOptions.attachments.push({
            filename: fileName + '.pdf',
            content: pdfContent
        });
    }
    if (reportFormats.includes("html")) {
        mailOptions.attachments.push({
            filename: fileName + '.html',
            content: htmlString
        });
    }
    //    transporter.sendMail(mailOptions, function (error, info) {
    //        if (error) {
    //            console.log(error);
    //        } else {
    //            console.log('Sending email to: ' + emailaddresses + ' ' + info.response);
    //        }
    //    });
    htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds).then((result) => {AWSEmail.sendEmail(emailaddresses, 'DigiClips Search Result', result)});
};

exports.sendForm = async function (senderEmail,info){
  const transporter = nodemailer.createTransport(config.email);

  const mailOptions = {
      from: config.email.from,
      // emailaddresses should be a string of comma-separated emails
      to: config.email.from,
      subject: 'DigiClips Contact Us Form',
      html: '<html><p>New request from: ' + senderEmail + '</p><p><b>Request info: </b></p><p>' + info + "</p></html>",
  };

    //  transporter.sendMail(mailOptions, function (error, info) {
    //       if (error) {
    //           console.log(error);
    //      } else {
    //          console.log('Submitting form..' + info.response);
    //      }
    //  });
    htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds).then((result) => {AWSEmail.sendEmail(emailaddresses, 'DigiClips Search Result', result)});
};

exports.sendEmailForQuery = async function (searchQuery, selectedChannel, numOfRecords, emailaddresses, reportFormats, date) {
    const allChannels = selectedChannel === 'All';
    const unfilteredSearchResults = await simpleSearchHandler.getSimpleSearchResults(searchQuery, selectedChannel, allChannels, numOfRecords);
    var searchResults = simpleSearchHandler.filterByDate(unfilteredSearchResults, date);

    if (searchResults.length === 0) {
        return Promise.resolve();
    }

    const transporter = nodemailer.createTransport(confog.email);

    const fileName = fileNameService.generateFileName(searchQuery, selectedChannel);
    const htmlString = await htmlService.generateHtmlWithResults(searchQuery, searchResults);


    const mailOptions = {
        from: config.email.from,
        // emailaddresses should be a string of comma-separated emails
        to: emailaddresses,
        subject: 'DigiClips Broadcast Report',
        html: htmlString,
        attachments: []
    };
    if (reportFormats.includes("email") || reportFormats === '') {
        // put report in email body if no formats are selected
        mailOptions.html = htmlString;
    } else {
        mailOptions.html = "Please find your DigiClips report(s) attached.";
    }

    if (reportFormats.includes("doc")) {
        const docXhtmlString = await docxHtmlService.generateHtml(searchQuery, selectedChannel, allChannels, numOfRecords);

        const doc = await docx.generateDocx(docXhtmlString);
        mailOptions.attachments.push({
            filename: fileName + '.docx',
            content: doc
        });
    }
    if (reportFormats.includes("excel")) {
        const excelFile = await excelService.generateXlsxWithResults(searchResults);
        mailOptions.attachments.push({
            filename: fileName + '.xlsx',
            content: excelFile
        });
    }
    if (reportFormats.includes("pdf")) {
        const pdfContent = await pdf.generatePDF(htmlString);
        mailOptions.attachments.push({
            filename: fileName + '.pdf',
            content: pdfContent
        });
    }
    if (reportFormats.includes("html")) {
        mailOptions.attachments.push({
            filename: fileName + '.html',
            content: htmlString
        });
    }
    //    transporter.sendMail(mailOptions, function (error, info) {
    //        if (error) {
    //            console.log(error);
    //        } else {
    //            console.log('Sending email: ' + info.response);
    //        }
    //    });
    htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds).then((result) => {AWSEmail.sendEmail(emailaddresses, 'DigiClips Search Result', result)});
};
