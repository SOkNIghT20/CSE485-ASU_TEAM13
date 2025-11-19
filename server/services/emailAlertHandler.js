"use strict";
var express = require('express');
var db = require('../routes/dbconnect.js');
var moment = require('moment');
const emailService = require('./emailService');
const cronJobService = require('./cronJobService');

const reportFormats = '';
const selectedChannel = 'All';
const selectedNewspaper = 'All';
const selectedMagazine = 'All';
const selectedSocialMedia = 'All';
const selectedRadio = 'All';
const country = 'All';
const stateProvince = 'All';
const city = 'All';
var startDate = '2000-01-01';
var endDate = new Date().toISOString().slice(0, 10);
var startDateTime = ' ';
var endDateTime = ' ';
var startTime = '00:00:00'
var endTime = '23:59:59';
const allChannels = selectedChannel === 'All';
const allPapers = selectedNewspaper === 'All';
const allMags = selectedMagazine === 'All';
const allCountries = country === 'All';
const allStates = stateProvince === 'All';
const allCities = city === 'All';
const newsIds = 'All';
const magIds = 'All';
const socialMediaIds = 'All';
const radioIds = 'All';
const televisionIds = 'All';




exports.emailAlerts = function(interval, lastDate, callback) {

  var connection = db.getPool();

  var query = 'SELECT * FROM dc.emailAlerts WHERE realTimeAlerts = "' + interval + '";';

  connection.query(query, function (err, rows, fields) {
    if (err) {
    } else {
      for (let i in rows) {
        const data = rows[i];
        var reportFormats = "";
        if (data.formatEmail > 0) {
            reportFormats += 'email ';
        }
        if (data.formatDoc > 0) {
          reportFormats += 'doc ';
        }
        if (data.formatExcel > 0) {
          reportFormats += 'excel ';
        }
        if (data.formatPDF > 0) {
          reportFormats += 'pdf ';
        }
        if (data.formatHTML > 0) {
          reportFormats += 'html ';
        }
        const emailaddresses = data.emails;
        const numOfRecords = data.numOfResults;
        const media = data.denverTelevision;
        const fileName = 'Report';
        var searchQuery = '/&&/\"' + data.keywords_string + '\" \"\" -\"\"';
        if (data.startDate) {
          startDate = data.startDate;
        }
        if (data.endDate) {
          endDate = data.endDate;
        }
        if (data.startTime) {
          startTime = data.startTime;
        }
        if (data.endTime) {
          endTime = data.endTime;
        }
        startDateTime = `${startDate} ${startTime}`;
        endDateTime = `${endDate} ${endTime}`;
 //       emailService.sendEmailForCronJob(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country, stateProvince, city, startDateTime, endDateTime, startDate, endDate,startTime,endTime, numOfRecords, allChannels, allPapers, allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds, emailaddresses, reportFormats, fileName);
        lastDate = new Date();
      }
    }
  });
};
