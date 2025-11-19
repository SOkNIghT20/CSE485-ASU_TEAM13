"use strict";
const simpleSearchH = require('../routes/tvSearchHandler');
const newsSearchH = require('../routes/newspaperSearchHandler');
const newsFormat = require('../views/formating');
const _ = require('underscore');
const radioSearchH = require('../routes/radioSearchHandler');
var pug = require('pug');

/**
 * Generates html of results page for the given search query
 * @param {string} searchQuery - the keywords and phrases of the search
 * @param {string} media - the media type of the search
 * @param {string} selectedChannel - the channels covered by the search
 * @param {string} selectedNewspaper - the selected newspaper by the search
 * @param {string} selectedMagazine - the selected magazine by the search
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
 */
exports.generateHtml = function (searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, country,
                                 stateProvince, city, startDateTime, endDateTime, numOfRecords, allChannels, allPapers,
                                 allMags, allCountries, allStates, allCities, newsIds, magIds) {
    switch (media) {
      case "Newspaper": {
        return newsSearchH.getSearchResults(searchQuery, selectedNewspaper, allPapers, country, allCountries,
            stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
            .then(rows => {
                return exports.generateNewspaperHtmlWithResults(searchQuery, rows[0], newsIds);
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        break;
      }
      case "Radio": {
        radioSearchH.getSearchResults(searchQuery, selectedRadio, allRadios, country,
          allCountries, stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
            .then(rows => {
                return exports.generateRadioHtmlWithResults(searchQuery, rows[0], newsIds);
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        break;
      }
      case "Television": {
        return simpleSearchH.getSimpleSearchResults(searchQuery, selectedChannel, allChannels, numOfRecords)
          .then(rows => {
            const rowsByFilename = _.groupBy(rows, 'Mp4_File_Name');
            //set up header for html
            var htmlString = "";
            var header = pug.renderFile("views/header.pug");

            for (let key in rowsByFilename) {
              var groupData = rowsByFilename[key];

              //push contents into array to pass to Pug template
              var cc = [];
              for (let i in groupData) {
                var line = groupData[i].Result_Line;
                cc.push(groupData[i].Result_Line);
              }

              var keyword = searchQuery.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
              //get html for result (with appropriate format)
              htmlString += "<p style = \"page-break-inside: avoid; clear:both;\">";
              var thumbnail_path = "views/placeholder_thumbnail.svg";
              var layout_path = "views/docxlayout.pug";
              htmlString += pug.renderFile(layout_path, {
                channel_name: groupData[0].Channel_Name,
                channel_id: groupData[0].Channel_Id,
                file_name: key,
                groupData: groupData,
                results: cc,
                thumbnail: thumbnail_path,
                date: groupData[0].Created_at,
                key: keyword
              });
              htmlString += "</p>";
              // htmlString += "<br style=\"page-break-after: always; clear:both;\" >";
            }
            return  htmlString;
          })
          .catch(err => {
              console.log(err);
            throw err;
          });
        break;
      }
      default: { // all media (currently just TV) TODO figure out how to integrate all into one report
        return simpleSearchH.getSimpleSearchResults(searchQuery, selectedChannel, allChannels, numOfRecords,startDate,endDate,startTime,endTime)
          .then(rows => {
            const rowsByFilename = _.groupBy(rows, 'Mp4_File_Name');
            //set up header for html
            var htmlString = "";
            //var header = pug.renderFile("views/header.pug");

            for (let key in rowsByFilename) {
              var groupData = rowsByFilename[key];

              //push contents into array to pass to Pug template
              var cc = [];
              for (let i in groupData) {
                var line = groupData[i].Result_Line;
                cc.push(groupData[i].Result_Line);
              }

              var keyword = searchQuery.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
              //get html for result (with appropriate format)
              htmlString += "<p style = \"page-break-inside: avoid; clear:both;\">";
              var thumbnail_path = "views/placeholder_thumbnail.svg";
              var layout_path = "views/docxlayout.pug";
              htmlString += pug.renderFile(layout_path, {
                channel_name: groupData[0].Channel_Name,
                channel_id: groupData[0].Channel_Id,
                file_name: key,
                groupData: groupData,
                results: cc,
                thumbnail: thumbnail_path,
                date: groupData[0].Created_at,
                key: keyword
              });
              htmlString += "</p>";
              // htmlString += "<br style=\"page-break-after: always; clear:both;\" >";
            }
            return  htmlString;
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
 * Generates html of results page given the results
 * @param {string} keyword - search keyword or phrase
 * @param {array} searchResults - search results from newspaper simpleSearch
 * @param {array} newsIds - the IDs of the selected results
 */
exports.generateNewspaperHtmlWithResults = function(keyword, searchResults, newsIds) {
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

  //set up header for html
  var htmlString = "";
  const header = pug.renderFile("views/header.pug").replace("</html>","");

  const layout_path = "views/newspaperlayout.pug";
  keyword = keyword.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  htmlString += pug.renderFile(layout_path, {
    key: keyword,
    results: selectedResults
  });

  return header + htmlString;
};


/**
 * Generates html of results page given the results
 * @param {string} keyword - search keyword or phrase
 * @param {array} searchResults - search results from radio simpleSearch
 */
exports.generateRadioHtmlWithResults = function(keyword, searchResults) {

  //set up header for html
  var htmlString = "";
  const header = pug.renderFile("views/header.pug").replace("</html>","");

  const layout_path = "views/radiolayout.pug";
  keyword = keyword.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  htmlString += pug.renderFile(layout_path, {
    key: searchQuery,
    results: searchResults
  });
  return header + htmlString;
};
