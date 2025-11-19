"use strict";
const simpleSearchH = require('../routes/tvSearchHandler');
const newsSearchH = require('../routes/newspaperSearchHandler');
const magazineSearchH = require('../routes/magazineSearchHandler');
const socialMediaSearchH = require('../routes/socialMediaSearchHandler');
const newsFormat = require('../views/formating');
const radioSearchH = require('../routes/radioSearchHandler');
const magazineFormat = require('../views/formating');
const _ = require('underscore');
const excelbuilder = require('msexcel-builder');
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const xlsxGenerator = require('../services/generateXlsx')

/**
 * Generates an excel file of results page for the given search query
 * @param {string} searchQuery - the keywords and phrases of the search
 * @param {string} media - the media type of the search
 * @param {string} selectedChannel - the channels covered by the search
 * @param {string} selectedNewspaper - the selected newspaper by the search
 * @param {string} selectedMagazine - the selected magazine by the search
 * @param {array} selectedRadio - the list of selected Radios
 * @param {string} country - the selected country by the search
 * @param {string} stateProvince - the selected state or province by the search
 * @param {string} city - the selected city by the search
 * @param {string} startDateTime - the start date and time of the search
 * @param {string} endDateTime - the end date and time of the search
 * @param {number} numOfRecords - the number of results requested by the search
 * @param {boolean} allChannels - true iff 'All' selected for tv station
 * @param {boolean} allPapers - true iff 'All' selected for newspaper
 * @param {boolean} allMags - true iff 'All' selected for magazine
 * @param {boolean} allCountries - true iff 'All' selected for the country
 * @param {boolean} allStates - true iff 'All' selected for the state/province
 * @param {boolean} allCities - true iff 'All' selected for the city
 * @param {array} newsIds - the list of selected newspaper result IDs
 * @param {array} magIds - the list of selected magazine result IDs
 * @param {array} socialMediaIds - the list of selected social media result IDs
 * @param {array} radioIds - the list of selected radio result IDs
 * @param {array} televisionIds - the list of selected tv result IDs
 */
exports.generateXlsx = function (searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
                                 stateProvince, city, startDateTime, endDateTime, startDate, endDate, startTime, endTime, numOfRecords, allChannels, allPapers,
                                 allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds) {
                                   if(startDate === ''){startDate = '2000-01-01'};
                                   if(endDate === ''){endDate = new Date().toISOString().slice(0, 10)};	// today's date
                                   if(endTime === '23:59'){endTime = '23:59:59'};
                                   if(startTime === ''){startTime = '00:00:00'};
                                   if(endTime === ''){endTime = '23:59:59'};
  switch (media) {
    case "Newspaper": {
      return newsSearchH.getSearchResults(searchQuery, selectedNewspaper, allPapers, country, allCountries,
          stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
        .then(rows => {
          return exports.generateXlsxWithNewsResults(rows[0], newsIds);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
      break;
    }
    case "Magazine": {
      return magazineSearchH.getSearchResults(searchQuery, selectedMagazine, allMags, country, allCountries,
          stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
        .then(rows => {
          return exports.generateXlsxWithMagazineResults(rows[0], magIds);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
      break;
    }
    case "Social Media": {
      return socialMediaSearchH.getSearchResults(searchQuery, numOfRecords, startDateTime, endDateTime, selectedSocialMedia)
        .then(socialMediaResults => {
          console.log("Reached excel generation. ------------------------------------------------------");
          console.log(socialMediaResults);
          var resultsParsed = JSON.parse(socialMediaResults.socialMediaResults);
          return exports.generateXlsxWithSocialMediaResults(resultsParsed, socialMediaIds);
      })
      .catch(err => {
          console.log(err);
          throw err;
      });
      break;
    }
    case "Television": {
      return simpleSearchH.getSimpleSearchResults(searchQuery, selectedChannel, allChannels, numOfRecords, startDate, endDate, startTime, endTime)
        .then(rows => {
          return exports.generateXlsxWithTVResults(rows, televisionIds);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
      break;
    }
    case "Radio": {
      return radioSearchH.getSearchResults(searchQuery, selectedRadio, allPapers, country, allCountries, stateProvince, allStates, city,
        allCities, startDateTime, endDateTime, numOfRecords)
        .then(rows => {
          return exports.generateXlsxWithRadioResults(rows[0], radioIds);
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
      break;
    }
    default: { // all media
      return newsSearchH.getSearchResults(searchQuery, selectedNewspaper, allPapers, country, allCountries,
          stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
        .then(rows => {
          const newsResults = rows[0];
          return magazineSearchH.getSearchResults(searchQuery, selectedMagazine, allMags, country, allCountries,
            stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
              .then(rows => {
                const magResults = rows[0];
                return radioSearchH.getSearchResults(searchQuery, selectedRadio, allPapers, country, allCountries, stateProvince, allStates, city,
                  allCities, startDateTime, endDateTime, numOfRecords)
                  .then(rows => {
                    const radioResults = rows[0];
                    return simpleSearchH.getSimpleSearchResults(searchQuery, selectedChannel, allChannels, numOfRecords, startDate, endDate, startTime, endTime)
                      .then(rows => {
                        return exports.generateXlsxWithAllResults(newsResults, magResults, radioResults, rows, newsIds, magIds, radioIds, televisionIds);
                  })
                  .catch(err => {
                      console.log(err);
                      throw err;
                  });
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
      })
      .catch(err => {
          console.log(err);
          throw err;
      });
      break;
    }
  }
};

/**
 * Generates excel file using given search results
 * @param {object} searchResults - search results from simpleSearch
 * @param {array} televisionIds - the IDs of the selected results
 */
exports.generateXlsxWithTVResults = function (searchResults, televisionIds) {
  // Get all of the currently checked tv results
  let downloadableList = []; // The list of all checked results
  for (let key in searchResults) {
    if (tvIds.includes(searchResults[key].Mp4_File_Name)){
      downloadableList.push(searchResults[key]);
    }
  }
  searchResults=downloadableList;

  var workbook = xlsxGenerator.generateXlsxWorkbook([], [], [], [], searchResults);

  return new Promise((resolve,reject)=>{
    return resolve(workbook);
  });
};

/**
 * Generates excel file using given search results
 * @param {object} searchResults - search results from simpleSearch
 * @param {array} radioIds - the IDs of the selected results
 */
exports.generateXlsxWithRadioResults = function (searchResults, radioIds) {
  // Get all the selected results
  var selectedResults = [];
  for (var i = 0; i < searchResults[0].length; i++) {
    var idInList = false;
    for (var j = 0; j < radioIds.length && !idInList; j++) {
      if (searchResults[0][i].ID == radioIds[j]) {
        idInList = true;
        selectedResults.push(searchResults[0][i]); // add to selected results
      }
    }
  }
  searchResults=selectedResults;

  var workbook = xlsxGenerator.generateXlsxWorkbook([], [], searchResults, [], []);

  return new Promise((resolve,reject)=>{
    return resolve(workbook);
  });
};

/**
 * Generates excel file using newspaper search results
 * @param {array} searchResults - newspaper search results from simpleSearch
 * @param {array} newsIds - the IDs of the selected results
 */
exports.generateXlsxWithNewsResults = function (searchResults, newsIds) {
  // build the selected results array
  var selectedResults = [];
  for (var i = 0; i < searchResults.length; i++) {
    var idInList = false;
    for (var j = 0; j < newsIds.length && !idInList; j++) {
      if (searchResults[i].ID === newsIds[j]) {
        searchResults[i].PublishDate = newsFormat.formatDate(searchResults[i].PublishDate);
        searchResults[i].Author = newsFormat.formatAuthor(searchResults[i].Author);
        idInList = true;
        selectedResults.push(searchResults[i]); // add to selected results
      }
    }
  }

  var workbook = xlsxGenerator.generateXlsxWorkbook([], selectedResults, [], [], []);

  return new Promise((resolve,reject)=>{
    return resolve(workbook);
  });
};

/**
 * Generates excel file using magazine search results
 * @param {array} searchResults - magazine search results from simpleSearch
 * @param {array} magIds - the IDs of the selected results
 */
exports.generateXlsxWithMagazineResults = function (searchResults, magIds) {
  // build the selected results array
  var selectedResults = [];
  for (var i = 0; i < searchResults.length; i++) {
    var idInList = false;
    for (var j = 0; j < magIds.length && !idInList; j++) {
      if (searchResults[i].ID === magIds[j]) {
        searchResults[i].PublishDate = magazineFormat.formatDate(searchResults[i].PublishDate);
        searchResults[i].Author = magazineFormat.formatAuthor(searchResults[i].Author);
        idInList = true;
        selectedResults.push(searchResults[i]); // add to selected results
      }
    }
  }

  var workbook = xlsxGenerator.generateXlsxWorkbook(selectedResults, [], [], [], []);

  return new Promise((resolve,reject)=>{
    return resolve(workbook);
  });
};

/**
 * Generates excel file using all search results
 * @param {array} newsResults - Newspaper search results from simpleSearch
 * @param {array} magResults - Magazine search results from simpleSearch
 * @param {array} radioResults - Radio search results from simpleSearch // TODO - NEED TO ADD SOCIAL MEDIA
 * @param {array} tvResults - Television search results from simpleSearch
 * @param {array} newsIds - The Ids of the selected newspapers
 * @param {array} magIds - The Ids of the selected Magazine
 * @param {array} radioIds - The Ids of the selected Radio
 * @param {array} televisionIds - The Ids of the selected Television
 */
exports.generateXlsxWithAllResults = function (newsResults, magResults, radioResults, tvResults, newsIds, magIds, radioIds, televisionIds) {
  // build the selected results array for newspapers
  var selectedNewsResults = [];
  if (newsIds !== 'All'){
    for (var i = 0; i < newsResults.length; i++) {
      var idInList = false;
      for (var j = 0; j < newsIds.length && !idInList; j++) {
        if (newsResults[i].ID === newsIds[j]) {
          newsResults[i].PublishDate = newsFormat.formatDate(newsResults[i].PublishDate);
          newsResults[i].Author = newsFormat.formatAuthor(newsResults[i].Author);
          idInList = true;
          selectedNewsResults.push(newsResults[i]); // add to selected results
        }
      }
    }
  }
  else{
    selectedNewsResults = newsResults;
  }
  // build the selected results array for magazines
  var selectedMagazineResults = [];
  if (magIds !== 'All'){
    for (var i = 0; i < magResults.length; i++) {
      var idInList = false;
      for (var j = 0; j < magIds.length && !idInList; j++) {
        if (magResults[i].ID === magIds[j]) {
          magResults[i].PublishDate = magazineFormat.formatDate(magResults[i].PublishDate);
          magResults[i].Author = magazineFormat.formatAuthor(magResults[i].Author);
          idInList = true;
          selectedMagazineResults.push(magResults[i]); // add to selected results
        }
      }
    }
  }
  else{
    selectedMagazineResults = magResults;
  }

  // Get all the selected results
  var selectedRadioResults = [];
  if (radioIds !== 'All'){
    for (var i = 0; i < radioResults.length; i++) {
      var idInList = false;
      for (var j = 0; j < radioIds.length && !idInList; j++) {
        if (radioResults[i].ID == radioIds[j]) {
          idInList = true;
          selectedRadioResults.push(radioResults[i]); // add to selected results
        }
      }
    }
  }
  else{
    selectedRadioResults = radioResults;
  }

  let selectedTelevisionResults = []; // The list of all checked results
  if (televisionIds !== 'All'){
    for (let key in tvResults) {
      if (televisionIds.includes(tvResults[key].Mp4_File_Name)){
        selectedTelevisionResults.push(tvResults[key]);
      }
    }
  }
  else{
    selectedTelevisionResults = tvResults;
  }

  var workbook = xlsxGenerator.generateXlsxWorkbook(selectedMagazineResults, selectedNewsResults, selectedRadioResults, [], selectedTelevisionResults); // TODO - ADD SOCIAL MEDIA

  return new Promise((resolve,reject)=>{
    return resolve(workbook);
  });

};


/**
 * Generates excel file using given search results
 * @param {array} searchResults - social media search results from simpleSearch
 */
exports.generateXlsxWithSocialMediaResults = function (socialMediaResults, socialMediaIds) {
  // build the selected results array
  let searchResults = socialMediaResults;
  // console.log(searchResults);
  var selectedResults = [];
  for (var i = 0; i < searchResults.length; i++) {
    var idInList = false;
    for (var j = 0; j < socialMediaIds.length && !idInList; j++) {
      if (searchResults[i].id === socialMediaIds[j]) {
      //   searchResults[i].PublishDate = newsFormat.formatDate(searchResults[i].PublishDate);
      //   searchResults[i].Author = newsFormat.formatAuthor(searchResults[i].Author);
        idInList = true;
        selectedResults.push(searchResults[i]); // add to selected results
      }
    }
  }

  // Create workbook file in current working-path
  const workbook = excelbuilder.createWorkbook('./', 'sample.xlsx');
  // Create worksheet with 10 columns and rows.length number of rows
  const sheet1 = workbook.createSheet('sheet1', 10, selectedResults.length + 1);

  // set the column widths
  sheet1.width(1, 10);
  sheet1.width(2, 40);
  sheet1.width(3, 70);
  sheet1.width(4, 25);
  sheet1.width(5, 13);

  // Fill some data
  const header = ["Social Media", "Link", "Text", "Author", "Attributes"];
  for (let i = 1; i < header.length + 1; i++) {
    sheet1.set(i, 1, header[i - 1]);
  }

  let row = 2;
  for (let i = 0; i<selectedResults.length; i++) {
    console.log("Loop: " + selectedResults[i]);
    sheet1.set(1, row, selectedResults[i].source);
    sheet1.set(2, row, selectedResults[i].url);
    sheet1.set(3, row, selectedResults[i].text);
    sheet1.set(4, row, selectedResults[i].author);
    var attributesString = "";
    if (selectedResults[i].source == "youtube") {
      attributesString += "Views: " + selectedResults[i].attributes.views + "\n";
      attributesString += "Likes: " + selectedResults[i].attributes.likes + "\n";
      attributesString += "Dislikes: " + selectedResults[i].attributes.dislikes + "\n";
    } else if (selectedResults[i].source == "twitter") {
      // attributesString += "Hashtags: " + selectedResults[i].attributes.hashtags + "\n";
      attributesString += "Retweets: " + selectedResults[i].attributes.retweets + "\n";
      attributesString += "Favorites: " + selectedResults[i].attributes.favorites + "\n";
    }
    sheet1.set(5, row, attributesString);
    sheet1.wrap(1, row, 'true');
    sheet1.wrap(2, row, 'true');
    sheet1.wrap(3, row, 'true');
    sheet1.wrap(4, row, 'true');
    sheet1.wrap(5, row, 'true');

    row++;
  }
  return new Promise((resolve,reject)=>{
    workbook.save((err) => {
      if (!err) {
        //Load the xlsx file as a binary
        const content = fs.readFileSync(path.resolve('./', 'sample.xlsx'),
          'binary');
        const zip = new JSZip(content);
        const buf = zip.generate({type: 'nodebuffer'});
        resolve(buf);
        fs.unlinkSync('./sample.xlsx');
      } else {
        workbook.cancel();
        console.log('Excel workbook creation failed.');
        reject();
      }
    });
  });
};
