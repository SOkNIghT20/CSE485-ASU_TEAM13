"use strict";
const express = require("express");
const router = express.Router();
const _ = require("underscore");
const tvSearchHandler = require("./tvSearchHandler");
const newsSearchH = require("./newspaperSearchHandler");
const magSearchH = require("./magazineSearchHandler");
const radioSearchH = require("./radioSearchHandler");
const socialMediaSearchH = require("./socialMediaSearchHandler");
const passport = require("passport");
const db = require("./dbconnect.js");
// const key = 'YOUR_YANDEX_TRANSLATE_API_KEY_HERE'; // Add your API key in environment variable
// var translate = require('yandex-translate')(key);

router.get(
  "/simpleSearch",
  passport.authenticate("jwt", { session: false }),
  async (req, res) =>{
    // Get the client's IP address
    const clientIP = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress;
    
    // Check if user is a guest by checking the email from the JWT
    const isGuest = req.user && req.user.email === 'guest@digimedia.com';
    
    // Max searches allowed for guest users
    const MAX_GUEST_SEARCHES = 5;
    let searchesLeft = MAX_GUEST_SEARCHES;
    
    // If the user is a guest, we need to check their search limit
    if (isGuest) {
      const connection = db.getPool();
      
      try {
        // Get current search count
        const searchCountResult = await new Promise((resolve, reject) => {
          connection.query(
            'SELECT search_count FROM dc.guest_searches WHERE ip_address = ?',
            [clientIP],
            function(err, results) {
              if (err) {
                console.error('Error getting guest search count:', err);
                reject(err);
                return;
              }
              resolve(results);
            }
          );
        });
        
        // Default search count is 0 if no record exists
        let searchCount = 0;
        if (searchCountResult && searchCountResult.length > 0) {
          searchCount = searchCountResult[0].search_count;
        }
        
        // If user has reached the limit, return an error
        if (searchCount >= MAX_GUEST_SEARCHES) {
          return res.status(403).json({
            error: 'Search limit reached',
            message: 'You have reached your limit of 5 free searches. Please register for full access.',
            searchesLeft: 0
          });
        }
        
        // Otherwise, increment the search count
        await new Promise((resolve, reject) => {
          connection.query(
            'INSERT INTO dc.guest_searches (ip_address, search_count) VALUES (?, 1) ' +
            'ON DUPLICATE KEY UPDATE search_count = search_count + 1, last_search_time = CURRENT_TIMESTAMP',
            [clientIP],
            function(err, result) {
              if (err) {
                console.error('Error updating guest search count:', err);
                reject(err);
                return;
              }
              resolve(result);
            }
          );
        });
        
        // Calculate searches left for the response
        searchesLeft = MAX_GUEST_SEARCHES - (searchCount + 1);
      } catch (err) {
        console.error('Error handling guest search:', err);
        // Continue with the search anyway
      }
    }

    const language = req.query.language;
    var searchQuery = req.query.searchQuery;

    switch (language)   {
      case "English": {
        // translate.translate(searchQuery, { to: 'en' }, function(err, result)
        {
          // console.log("Translated to English query: " + result.text);
          // searchQuery = result.text;
          // console.log("searchQuery:" + searchQuery);
          const mediaTypeHash = JSON.parse(req.query.mediaType);
          console.log("mediaTypeHash: 👌👌👌👌👌👌👌👌👌" + JSON.stringify(mediaTypeHash));
          const selectedChannel = req.query.selectedChannel;
          const selectedNewspaper = req.query.selectedNewspaper;
          const selectedMagazine = req.query.selectedMagazine;
          const selectedSocialMedia = req.query.selectedSocialMedia;
          const selectedRadio = req.query.selectedRadio;
          const country = req.query.country;
          const stateProvince = req.query.stateProvince;
          const city = req.query.city;
          const startDateTime = req.query.startDateTime;
          const endDateTime = req.query.endDateTime;

          var startDate = req.query.startDate;
          var endDate = req.query.endDate;
          var startTime = req.query.startTime;
          var endTime = req.query.endTime;

          const numOfRecords = req.query.numOfRecords;
          const allChannels = selectedChannel === "All";
          const allPapers = selectedNewspaper === "All";
          const allMags = selectedMagazine === "All";
          const allRadios = selectedRadio === "All";
          const allCountries = country === "All";
          const allStates = stateProvince === "All";
          const allCities = city === "All";

          if (startDate === "") {
            // startDate = "2000-01-01";
            let today = new Date();
            let pastDate = new Date();
            pastDate.setDate(today.getDate() - 30);
            startDate = pastDate.toISOString().slice(0, 10);
          }
          if (endDate === "") {
            endDate = new Date().toISOString().slice(0, 10);
          } // today's date
          if (endTime === "23:59") {
            endTime = "23:59:59";
          }
          if (startTime === "") {
            startTime = "00:00:00";
          }
          if (endTime === "") {
            endTime = "23:59:59";
          }

          // console.log(
          //   "simpleSearch.js: ",
          //   startDate,
          //   "-",
          //   endDate,
          //   " ",
          //   startTime,
          //   "-",
          //   endTime
          // ); //Debug
          // console.log("simpleSearch.js: ", endTime);		//Debug

          const shouldFilter = Object.values(mediaTypeHash).filter(Boolean).length > 0;

          // console.log("The filteredValue: " + shouldFilter);

          const responseObject = {
            results: [],
            tvResultsSize: 0,
            RrowsByFilenameErr: null,
            newsResults: [],
            newsResultsError: null,
            radioResults: [],
            radioResultsError: null,
            magResults: [],
            magResultsError: null,
            // socialMediaResults: [],
          };

          console.log(mediaTypeHash);
          
          const shouldFetchTV = shouldFilter ? mediaTypeHash['television'] : true;
          const shouldFetchRadio = shouldFilter ? mediaTypeHash['radio'] : true;
          const shouldFetchMagazine = shouldFilter ? mediaTypeHash['magazine'] : true;
          const shouldFetchSocialMedia = shouldFilter ? mediaTypeHash['socialMedia'] : true;
          const shouldFetchNewspaper = shouldFilter ? mediaTypeHash['newspaper'] : true;

          console.log({shouldFetchMagazine, shouldFetchRadio, shouldFetchMagazine, shouldFetchSocialMedia, shouldFetchNewspaper});
          
          if (shouldFetchTV) {
            await tvSearchHandler
              .getSimpleSearchResults(
                searchQuery,
                selectedChannel,
                allChannels,
                numOfRecords,
                startDate,
                endDate,
                startTime,
                endTime
              )
              .then(
                (rows) => {
                  responseObject.results = _.groupBy(rows, 'Mp4_File_Name');
                  responseObject.tvResultsSize = Object.keys(responseObject.results).length;
                },
                (err) => {
                  responseObject.RrowsByFilenameErr = err.message;
                }
              );
            
          }

          if (shouldFetchNewspaper) {
            await newsSearchH
              .getSearchResults(
                searchQuery,
                selectedNewspaper,
                allPapers,
                country,
                allCountries,
                stateProvince,
                allStates,
                city,
                allCities,
                startDateTime,
                endDateTime,
                numOfRecords
              )
              .then(
                (rows) => {
                  responseObject.newsResults = rows[0];
                },
                (err) => {
                  responseObject.newsResultsError = err.message;
                }
              )
            
          }

          if (shouldFetchMagazine) {
            await magSearchH
              .getSearchResults(
                searchQuery,
                selectedMagazine,
                allMags,
                country,
                allCountries,
                stateProvince,
                allStates,
                city,
                allCities,
                startDateTime,
                endDateTime,
                numOfRecords
              )
              .then(
                (rows) => {
                  responseObject.magResults = rows[0];
                },
                (err) => {
                  responseObject.magResultsError = err.message;
                }
              )
          
          }

            // TODO fix social media
            // Social Media isn't working right now
            //if(shouldFetchSocialMedia) {
            // 
              // socialMediaSearchH
              //   .getSearchResults(
              //     searchQuery, 
              //     numOfRecords, 
              //     startDateTime, 
              //     endDateTime, 
              //     selectedSocialMedia
              //   )
              //   .then(resultsSocial => {
                //     responseObject.resultsSocial = resultsSocial.message;
                //   },
                //   err => {
                //     console.log(err);
                //   }
              //   )
              //);
            //}
            
          if(shouldFetchRadio) {   
            await radioSearchH
              .getSearchResults(
                searchQuery,
                selectedRadio,
                allRadios,
                country,
                allCountries,
                stateProvince,
                allStates,
                city,
                allCities,
                startDateTime,
                endDateTime,
                numOfRecords
              )
              .then(
                (rows) => {
                  responseObject.radioResults = rows[0];
                },
                (err) => {
                  responseObject.radioResultsError = err.message;
                }
              );
          
          }
           
          // console.log("Sending back a response: " + JSON.stringify(responseObject));
          
          // Add the searches left to the response for guest users
          if (isGuest) {
            responseObject.searchesLeft = searchesLeft;
          }
          
          res.status(200).send(responseObject);         
        }
      }
    
    }
});

module.exports = router;
