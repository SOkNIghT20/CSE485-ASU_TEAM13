"use strict";
const simpleSearchH = require('../routes/tvSearchHandler');
const newsSearchH = require('../routes/newspaperSearchHandler');
const magazineSearchH = require('../routes/magazineSearchHandler');
const radioSearchH = require('../routes/radioSearchHandler');
const socialMediaSearchH = require('../routes/socialMediaSearchHandler');
const newsFormat = require('../views/formating');
const magazineFormat = require('../views/formating');
const _ = require('underscore');
var pug = require('pug');

/**
 * Generates html of results page for the given search query
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
 * @param {string} startDate - the start date of the search
 * @param {string} endDate - the end date of the search
 * @param {string} startTime - the daily start time of the program
 * @param {string} endTime - the daily end time of the program
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
exports.generateHtml = function(searchQuery, media, selectedChannel, selectedNewspaper, selectedMagazine, selectedSocialMedia, country,
                                stateProvince, city, startDateTime, endDateTime, startDate, endDate, startTime, endTime, numOfRecords, allChannels, allPapers,
                                allMags, allCountries, allStates, allCities, newsIds, magIds, socialMediaIds, selectedRadio, radioIds, televisionIds) {
                                  if(startDate === ''){startDate = '2000-01-01'};
                                  if(endDate === ''){endDate = new Date().toISOString().slice(0, 10)};	// today's date
                                  if(endTime === '23:59'){endTime = '23:59:59'};
                                  if(startTime === ''){startTime = '00:00:00'};
                                  if(endTime === ''){endTime = '23:59:59'};
  switch (media) { // determine type of report based on media selected
    case "Television": {
      return simpleSearchH.getSimpleSearchResults(searchQuery, selectedChannel, allChannels, numOfRecords, startDate, endDate, startTime, endTime)
          .then(rows => {
              return exports.generateTVHtmlWithResults(searchQuery, rows, true, televisionIds);
          })
          .catch(err => {
              console.log(err);
              throw err;
          });
      break;
    }
    case "Radio": {
      return radioSearchH.getSearchResults(searchQuery, selectedRadio, allPapers, country,
        allCountries, stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
          .then(rows => {
            var radioRows = rows;
            if (radioIds === 'All'){
              radioRows = rows[0];
            }
              return exports.generateRadioHtmlWithResults(searchQuery, radioRows, true, radioIds);
          })
          .catch(err => {
              console.log(err);
              throw err;
          });
      break;
    }
    case "Newspaper": {
      return newsSearchH.getSearchResults(searchQuery, selectedNewspaper, allPapers, country, allCountries,
          stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
          .then(rows => {
              return exports.generateNewspaperHtmlWithResults(searchQuery, rows[0], newsIds, true)
                .replace(/&apos;|’/gi, "&#39;");
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
              return exports.generateMagazineHtmlWithResults(searchQuery, rows[0], magIds, true)
                .replace(/&apos;|’/gi, "&#39;");
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
                return exports.generateSocialMediaHtmlWithResults(socialMediaResults, searchQuery, socialMediaIds);
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
        break;
    }

    default: { // all media (currently just TV) TODO figure out how to integrate all into one report
       return simpleSearchH.getSimpleSearchResults(searchQuery, selectedChannel, allChannels, numOfRecords, startDate, endDate, startTime, endTime)
           .then(rows => {
             var tvString = exports.generateTVHtmlWithResults(searchQuery, rows, false, televisionIds);
             return newsSearchH.getSearchResults(searchQuery, selectedNewspaper, allPapers, country, allCountries,
               stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
               .then(rows => {
                   var newsString = exports.generateNewspaperHtmlWithResults(searchQuery, rows[0], newsIds, true)
                     .replace(/&apos;|’/gi, "&#39;");
                   // remove closing tags from header
                   newsString = newsString.slice(0, newsString.length - 14);
                   return magazineSearchH.getSearchResults(searchQuery, selectedMagazine, allMags, country, allCountries,
                     stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
                     .then(rows => {
                       var magazineString = exports.generateMagazineHtmlWithResults(searchQuery, rows[0], magIds, false)
                         .replace(/&apos;|’/gi, "&#39;");
                         //return newsString + magazineString + tvString + "</div></body></html>";
                         return radioSearchH.getSearchResults(searchQuery, selectedRadio, allPapers, country,
                           allCountries, stateProvince, allStates, city, allCities, startDateTime, endDateTime, numOfRecords)
                           .then(rows => {
                               var radioRows = rows;
                               if (radioIds === 'All'){
                                 radioRows = rows[0];
                               }
                               var radioString = exports.generateRadioHtmlWithResults(searchQuery, rows[0], true, radioIds)
                                 .replace(/&apos;|’/gi, "&#39;");
                                    return newsString + magazineString + radioString + tvString + "</div></body></html>";
                                   // return socialMediaSearchH.getSearchResults(searchQuery, numOfRecords, startDateTime, endDateTime, selectedSocialMedia)
                                   // .then(rows => {
                                     // var socialMediaString = exports.generateSocialMediaHtmlWithResults(rows, searchQuery, socialMediaIds)
                                       // .replace(/&apos;|’/gi, "&#39;");
                               // concatenate different media HTML strings, add header closing tags ** ADD SOCIAL MEDIA WHEN WORKING
                                     
                                   // })
                                   // .catch(err => {
                                     // console.log("htmlService.js, 1");
                                     // throw err;
                                   // });
                            })
                           .catch(err => {
                             console.log("htmlService.js, 2");
                             throw err;
                           });
                     })
                     .catch(err => {
                       console.log("3");
                       throw err;
                     })
               })
               .catch(err => {
                 console.log("4");
                 throw err;
               })
           })
           .catch(err => {
               console.log("5");
               throw err;
        //      })
        //    })
        // .catch(err => {
        //     console.log("5");
        //     throw err;
           });
           break;
         }
     }
 };


/**
 * Generates html of results page given TV results
 * @param {string} searchQuery - the keywords and phrases of the search
 * @param {object} searchResults - search results from simpleSearch
 * @param {boolean} header - option to include HTML header
 * @param {array} tvIds - list of selected tvIds
 */
exports.generateTVHtmlWithResults = function (searchQuery, searchResults, header, tvIds) {
    // Get the selected tv results
    let downloadableList = []; // The list of all checked results
    for (let key in searchResults) {
      if (tvIds.includes(searchResults[key].Mp4_File_Name)){
        downloadableList.push(searchResults[key]);
      }
    }
    if (tvIds !== 'All'){
      searchResults=downloadableList;
    }
    // console.log(searchResults);


    const rowsByFilename = _.groupBy(searchResults, 'Mp4_File_Name');
    let htmlString = "";
    var first = true;

    if (searchResults.length == 0){
      if (header && first) {
        layout_path = "views/tvlayout.pug"
      } else if (first) {
        layout_path = "views/headlessfirsttvlayout.pug"
      } else {
        layout_path = "views/headlesstvlayout.pug"
      }
      // generate and return HTML
      return pug.renderFile(layout_path, {
        key: searchQuery,
        results: searchResults
      });
    }
    else {
    for (let key in rowsByFilename) {
      const groupData = rowsByFilename[key];
      //push contents into array to pass to Pug template
      const cc = [];
      for (let i in groupData) {
        cc.push(groupData[i].Result_Line);
      }
      // format keyword for use in regular expression for highlighting

//    console.log("htmlService.js: ", searchQuery);	//Debug
      const keyword = searchQuery.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
//	console.log("htmlService.js: ", searchQuery);	//Debug
      const thumbnail_path = "views/placeholder_thumbnail.svg";
      // include HTML header if requested
      var layout_path;
      if (header && first) {
        layout_path = "views/tvlayout.pug"
      } else if (first) {
        layout_path = "views/headlessfirsttvlayout.pug"
      } else {
        layout_path = "views/headlesstvlayout.pug"
      }

      // generate HTML
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

      // remove closing header tags if header was included
      if (header && first) {
        htmlString = htmlString.slice(0, htmlString.length - 20);
      }
      first = false;
    }
    // add closing header tags if header was included
    if (header) {
      htmlString += "</div></body></html>";
    }
    return htmlString;
  }
};

/**
 * Generates html of results page given newspaper results
 * @param {string} keyword - search keyword or phrase
 * @param {array} searchResults - search results from newspaper simpleSearch
 * @param {array} newsIds - the IDs of the selected results
 * @param {boolean} header - option to include HTML header
 */
exports.generateNewspaperHtmlWithResults = function(keyword, searchResults, newsIds, header) {
  // build the selected results array
  var selectedResults = [];
  if (newsIds !== 'All'){
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
  }
  else{
    selectedResults = searchResults;
  }

  var layout_path;
  // include HTML header if requested
  if (header) {
    layout_path = "views/newspaperlayout.pug"
  } else {
    layout_path = "views/headlessnewspaperlayout.pug";
  }

  // format keyword for use in regular expression for highlighting
  keyword = keyword.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  // generate and return HTML
  return pug.renderFile(layout_path, {
    key: keyword,
    results: selectedResults
  });
};

/**
 * Generates html of results page given Radio results
 * @param {string} searchQuery - the keywords and phrases of the search
 * @param {object} searchResults - search results from simpleSearch
 * @param {boolean} header - option to include HTML header
 * @param {array} radioIds - The selected radio checkboxes
 */
exports.generateRadioHtmlWithResults = function (searchQuery, searchResults, header, radioIds) {
  // Get all the selected results
  var selectedResults = [];
  if (selectedResults.length > 0) {
    for (var i = 0; i < searchResults[0].length; i++) {
      var idInList = false;
      for (var j = 0; j < radioIds.length && !idInList; j++) {
        if (searchResults[0][i].ID == radioIds[j]) {
          idInList = true;
          selectedResults.push(searchResults[0][i]); // add to selected results
        }
      }
    }
  }
  if (radioIds !== 'All'){
    searchResults=selectedResults;
  }

  const rowsByFilename = _.groupBy(searchResults, 'FName');
  let htmlString = "";
  var first = true;


    // format keyword for use in regular expression for highlighting
  const keyword = searchQuery.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");

    // include HTML header if requested
  var layout_path;
  if (header) {
    layout_path = "views/radiolayout.pug"
  } else {
    layout_path = "views/headlessradiolayout.pug";
  }


  // format keyword for use in regular expression for highlighting
  searchQuery = searchQuery.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  // generate and return HTML
  return pug.renderFile(layout_path, {
    key: searchQuery,
    results: searchResults
  });
};


/**
 * Generates html of results page given magazine results
 * @param {string} keyword - search keyword or phrase
 * @param {array} searchResults - search results from magazine simpleSearch
 * @param {array} magIds - the IDs of the selected results
 * @param {boolean} header - option to include HTML header
 */
exports.generateMagazineHtmlWithResults = function(keyword, searchResults, magIds, header) {
  // build the selected results array
  var selectedResults = [];
  if (magIds !== 'All'){
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
  }
  else{
    selectedResults = searchResults;
  }

  var layout_path;
  // include HTML header if requested
  if (header) {
    layout_path = "views/magazinelayout.pug";
  } else {
    layout_path = "views/headlessmagazinelayout.pug";
  }

  // format keyword for use in regular expression for highlighting
  keyword = keyword.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
  // generate and return HTML
  return pug.renderFile(layout_path, {
    key: keyword,
    results: selectedResults
  });
};

/**
 * Generates html of results page given social media results
 * @param {socialMediaResults} keyword - ?
 * @param {searchQuery} keyword - ?
 * @param {socialMediaIds} keyword - ?
 */
exports.generateSocialMediaHtmlWithResults = function (socialMediaResults, searchQuery, socialMediaIds) {
    // build the selected results array
    // let searchResults = JSON.parse(socialMediaResults.socialMediaResults);
    let searchResults = [];
    for (let result of JSON.parse(socialMediaResults.socialMediaResults)) {
        searchResults.push(result);
    }
    var selectedResults = [];
    if (socialMediaIds !== 'All'){
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
    }
    else{
      selectedResults = searchResults;
    }

    //set up header for html
    var htmlString = "";
    const header = pug.renderFile("views/header.pug");

    const layout_path = "views/socialmedialayout.pug";
    const keyword = searchQuery.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
    htmlString += pug.renderFile(layout_path, {
        key: keyword,
        results: selectedResults
    });

    return htmlString;
};
