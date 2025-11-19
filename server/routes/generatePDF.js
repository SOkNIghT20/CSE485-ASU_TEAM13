"use strict";
const fileNameService = require('../services/fileNameService');
const htmlService = require('../services/htmlService');
var express = require('express');
var router = express.Router();
var pdf = require('./generatePDFHandler');
const passport = require('passport');
//
router.get('/pdf',  passport.authenticate('jwt', { session: true }), (req, res) => {
  const searchQuery = req.query.searchQuery;
  const media = req.query.mediaType;
  const selectedChannel = req.query.selectedChannel;
  const selectedNewspaper = req.query.selectedNewspaper;
  const selectedMagazine = req.query.selectedMagazine;
  const selectedSocialMedia = req.query.selectedSocialMedia;
  const selectedRadio = req.query.selectedRadio;
  const country = req.query.country;
  const stateProvince = req.query.stateProvince;
  const city = req.query.city;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const startDateTime = req.query.startDateTime;
  const endDateTime = req.query.endDateTime;
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
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

  htmlService.generateHtml(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
                                  stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime, endTime, numOfRecords, allChannels, allPapers,
                                  allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds)
    .then(htmlString => {

      pdf.generatePDF(htmlString).then(buff => {
        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName + '.pdf');
        res.send(buff)
      },
      err => {
        console.log(err);
        res.status(500).send("Something broke!");
      });
  });
});

module.exports = router;
