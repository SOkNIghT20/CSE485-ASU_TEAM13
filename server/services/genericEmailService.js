const AlertList = require('./../routes/emailAlertListHandler');
const NodeMailer = require('nodemailer');
const CronJobService = require('./cronJobService');
const simpleSearchH = require('../routes/tvSearchHandler');
const newsSearchH = require('../routes/newspaperSearchHandler');
const magSearchH = require('../routes/magazineSearchHandler');
const radioSearchH = require('../routes/radioSearchHandler');
const socialMediaSearchH = require('../routes/socialMediaSearchHandler');
const htmlService = require('./htmlService');
const pdf = require('./../routes/generatePDFHandler');
const docx = require('./../routes/generateDocxHandler');
const excelService = require('./excelService');
const fileNameService = require('./fileNameService');
const removeAlertIDArticlesFromList = require('./../routes/removeAllAlertIDFromArticlesHandler');
const config = require('./../config.json');
const AWSEmail = require('../AWSemail/ses-client');
const _ = require('underscore');

module.exports = {
  startCron: function() {
    // Creates crontabs that run the generic email alerts
    try{
      /* CU BOULDER TEAM COMMENTED THIS OUT BECAUSE IT INTERFERES WITH SOME API CALLS */
      // const sendEmailSevenMinutes = () => {getAlerts("7 minutes")};
      // CronJobService.createCronJob(sendEmailSevenMinutes, 7);
      // const sendEmailTwentyMinutes = () => {getAlerts("20 minutes")};
      // CronJobService.createCronJob(sendEmailTwentyMinutes, 20);
      // const sendEmailThirtyMinutes = () => {getAlerts("30 minutes")};
      // CronJobService.createCronJob(sendEmailThirtyMinutes, 30);
      // const sendEmailSixtyMinutes = () => {getAlerts("60 minutes")};
      // CronJobService.createCronJob(sendEmailSixtyMinutes, 60);
      // const sendEmailOneDay = () => {getAlerts("24 hours")};
      // CronJobService.createCronJob(sendEmailOneDay, 1440);
      // const sendEmailOneWeek = () => {getAlerts("7 days")};
      // CronJobService.createCronJob(sendEmailOneWeek, 10080);
      // const sendEmailTwoWeek = () => {getAlerts("14 days")};
      // CronJobService.createCronJob(sendEmailTwoWeek, 20160);
      // const sendEmailOneMonth = () => {getAlerts("30 days")};
      // CronJobService.createCronJob(sendEmailOneMonth, 43200);

      console.log("Started generic email alert crons");
    }catch (ex){
      console.log("Error starting generic email alert crons");
    }

  }
};

function getAlerts(frequency) {
  console.log("GET ALERTS HERE --------------------------------");
  AlertList.getAlertListCronJob().then(rows => {
    for(i = 0; i < rows[0].length; i++) {
      if (rows[0][i].realTimeAlerts == frequency){
		  console.log("GET ALERTS HERE " + i);
        sendEmail(rows[0][i].email, rows[0][i].idemailAlerts, "All", rows[0][i].keywords_string, rows[0][i].country, rows[0][i].stateProv, rows[0][i].city, rows[0][i].startDate, rows[0][i].startTime, rows[0][i].endDate, rows[0][i].endTime, rows[0][i].numOfResults, rows[0][i].formatEmail, rows[0][i].formatDoc, rows[0][i].formatExcel, rows[0][i].formatPDF, rows[0][i].formatHTML, rows[0][i].digiViewType, rows[0][i].digiViewAndAnalysis, rows[0][i].textReport, rows[0][i].textReportAnalysis, rows[0][i].hitReport, rows[0][i].hitReportAndAnalysis, rows[0][i].positivePhrases, rows[0][i].negativePhrases, rows[0][i].phrases);
      }
    }
  }).catch(err => {console.log("Couldn't load CronJob alert list")});
}

function queryStringFromKeywords(keywords) {
    keywords = keywords.split(',').map(w => w.trim()).filter(w => w.length > 0).map(w => `/&&/"${w}"`);
    const orWords = "";
    const notWords = "";
    return [...keywords, ...orWords, ...notWords].join(' ');
  }

function createIDList(results, ids) {
    for (let key in results) {
      ids.push(results[key].ID);
    }
  }

function convertDateFormat(date) {
    if (date.charAt(4) === '-') { // yyyy-mm-dd format
      const year = date.substring(0, 4);
      const month = date.substring(5, 7);
      const day = date.substring(8, 10);
      return month + "/" + day + "/" + year;
    } else { // mm/dd/yyyy format (should be this format when entered manually)
      return date;
    }
}

function createIDList(results, ids) {
  for (let key in results) {
    ids.push(results[key].ID);
  }
}

function createIDListSocialMedia(results, ids) {
  for (let key in results) {
    ids.push(results[key].id);
  }
}

function createIDListTV(results, locations) {
  for (let key in results) {
    locations.push(results[key].location);
  }
}

async function sendEmail(email, alertID, mediaType, keywords, country, stateProv, city, startDate, startTime, endDate, endTime, numOfResults, formatEmail, formatDoc, formatExcel, formatPDF, formatHTML, digiViewType, digiViewAndAnalysis, textReport, textReportAnalysis, hitReport, hitReportAndAnalysis, positivePhrases, negativePhrases, phrases){

//  Deprecated
//  const transporter = NodeMailer.createTransport(config.email);

  if (numOfResults === undefined || numOfResults === null) {
    numOfResults = 10;
  }
  if (startDate === undefined || startDate === null || startDate === '') {
    startDate = '2000-01-01';
  }
  if (endDate === undefined || endDate === null || endDate == '') {
    endDate = new Date().toISOString().slice(0, 10);
  }
  if (startTime === undefined || startTime === null || startTime === '') {
    startTime = '00:00:00';
  }
  if (endTime === undefined || endTime === null || endTime === '') {
    endTime = '23:59:59';
  }
  if (country === undefined || country === null || country === '') {
    country = 'All';
  }
  if (stateProv === undefined || stateProv === null || stateProv === '') {
    stateProv = 'All';
  }
  if (city === undefined || city === null || city === '') {
    city = 'All';
  }

  var searchQuery = queryStringFromKeywords(keywords);
  console.log('FROM genericEmailService.js, searchQuery: ' + searchQuery);

  console.log('startDate is ' + startDate);
  console.log('endDate is ' + endDate);
//  var startDateTime = convertDateFormat(startDate) + " " + startTime;
//  var endDateTime = convertDateFormat(endDate) + " " + endTime;
  var startDateTime = "";
  var endDateTime = "";
  var newspaperResultIDs = [];
  var magazineResultIDs = [];
  var socialmediaResultIDs = [];
  var radioResultIDs = [];
  var televisionResultIDs = [];

  simpleSearchH.getSimpleSearchResults(searchQuery, 'All', true, numOfResults, startDate, endDate, startTime, endTime)
  .then(rows => {
    const resultSize = rows.length;
    const rowsByFilename = _.groupBy(rows, 'Mp4_File_Name');
    createIDList(rowsByFilename, televisionResultIDs);
    newsSearchH.getSearchResults(searchQuery, 'All', true, country, country === 'All', stateProv, stateProv === 'All', city, city === 'All', startDateTime, endDateTime, numOfResults)
    .then(rows => {
      const newsSize = rows[0].length;
      const news = rows[0];
      createIDList(news, newspaperResultIDs);
      radioSearchH.getSearchResults(searchQuery, 'All', true, country, country === 'All', stateProv, stateProv === 'All', city, city === 'All', startDateTime, endDateTime, numOfResults)
      .then(rows => {
        const radioResultsSize = rows[0].length;
        const radio = rows[0];
        createIDList(radio, radioResultIDs);
        magSearchH.getSearchResults(searchQuery, 'All', true, country, country === 'All', stateProv, stateProv === 'All', city, city === 'All', startDateTime, endDateTime, numOfResults)
        .then(rows => {
          const magSize = rows[0].length;
          const magazine = rows[0];
          createIDList(magazine, magazineResultIDs);
          htmlService.generateHtml(searchQuery, 'All', 'All', 'All', 'All', 'All', country, stateProv, city, startDateTime, endDateTime, startDate, endDate, startTime, endTime, numOfResults, true, true, true, true, true, true, newspaperResultIDs, magazineResultIDs, socialmediaResultIDs, 'All', 'All', 'All').then((result) => {AWSEmail.sendEmail(email, 'DigiClips Search Result Real Time Alert', result);});
        },
        err => {
          console.log(err);
          res.status(500).send("Something broke!");
        });
      },
      err => {
        console.log(err);
        res.status(500).send("Something broke!");
      });
    },
    err => {
      console.log(err);
      res.status(500).send("Something broke!");
    });
  },
  err => {
    console.log(err);
    res.status(500).send("Something broke!");
  });

  // Remove all articles that match the AlertID so they're not sent a second time
  // removeAlertIDArticlesFromList.removeArticles(alertID);
}
