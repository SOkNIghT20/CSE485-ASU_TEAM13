"use strict";
const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const fileNameService = require('../services/fileNameService');
const htmlService = require('../services/htmlService');
const AWSEmail = require('../AWSemail/ses-client');
const passport = require('passport');

router.get('/sendPage', passport.authenticate('jwt', { session: false }), (req, res) => {
  const searchQuery = req.query.searchQuery;
  const emailaddresses = req.query.emailAddresses;
  const reportFormats = req.query.reportFormats;
  const media = req.query.mediaType;
  const selectedChannel = req.query.selectedChannel;
  const selectedNewspaper = req.query.selectedNewspaper;
  const selectedMagazine = req.query.selectedMagazine;
  const selectedSocialMedia = req.query.selectedSocialMedia;
  const selectedRadio = req.query.selectedRadio;
  const country = req.query.country;
  const stateProvince = req.query.stateProvince;
  const city = req.query.city;
  var startDate = req.query.startDate;
  var endDate = req.query.endDate;
  var startDateTime = req.query.startDateTime;
  var endDateTime = req.query.endDateTime;
  var startTime = req.query.startTime;
  var endTime = req.query.endTime;
  const numOfRecords = req.query.numOfRecords;
  const allChannels = selectedChannel === 'All';
  const allPapers = selectedNewspaper === 'All';
  const allMags = selectedMagazine === 'All';
  const allCountries = country === 'All';
  const allStates = stateProvince === 'All';
  const allCities = city === 'All';
  const newsIds = JSON.parse(req.query.newspaperResults);
  const magIds = JSON.parse(req.query.magazineResults);
  const socialMediaIds = JSON.parse(req.query.socialMediaResults);
  const radioIds = JSON.parse(req.query.radioResults);
  const televisionIds = JSON.parse(req.query.televisionResults);
  var fileName;
  switch (media) {
    case "Newspaper": {
      fileName = fileNameService.generateFileNameNews(searchQuery);
      break;
    }
    case "Magazine": {
      fileName = fileNameService.generateFileNameMagazine(searchQuery);
      break;
    }
    case "Television": {
      fileName = fileNameService.generateFileName(searchQuery, selectedChannel);
      break;
    }
    case "Social Media": {
      fileName = fileNameService.generateFileNameSocialMedia(searchQuery);
      break;
    }
    case "Radio": {
      fileName = fileNameService.generateFileNameRadio(searchQuery);
      break;
    }
    default: {
      fileName = fileNameService.generateFileNameAll(searchQuery);
      break;
    }
  }

  //  const {emailaddresses, magResults, newspaperResults, radioResults, tvResults, reportFormats} = req.query;
    console.log("TESTINGGGG...");

    const sendPage = () => {
      if(startDate === ''){startDate = '2000-01-01'};
      if(endDate === ''){endDate = new Date().toISOString().slice(0, 10)};	// today's date
      if(endTime === '23:59'){endTime = '23:59:59'};
      if(startTime === ''){startTime = '00:00:00'};
      if(endTime === ''){endTime = '23:59:59'};
      var htmlString2 = "";

      htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds).then((result) => {AWSEmail.sendEmail(emailaddresses, 'DigiClips Search Result', result);});
        //console.log("Here's the string: " + htmlString);
        //emailService.sendEmailForQuery2(emailaddresses, htmlString, numOfRecords, reportFormats, fileName);
        // .catch(err => {
        //         console.log(err);
        //     });
    };
    console.log(emailaddresses);
    sendPage();
    res.status(200).send("\n\Email sent.\n\n");
});

module.exports = router;
