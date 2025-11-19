var express = require('express');
var db = require('./dbconnect.js');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();
var _ = require('underscore');
const passport = require('passport');

var DBPASSWORD = 'DropIn12'; // Global variable for database root user password.

// ROUTES
// localhost:3000/tvSearch
// If the user has a valid session searches the DB based on their keywords.
router.get('/tvSearch', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log('SEARCH CALL');
    //DB conncection
    var connection = db.getPool();

    // Create variables for the query so it's easier to read.
    var searchForm = JSON.parse(req.query.searchForm);
    var days = searchForm.days.join(',');

    var startTime1 = new Date(searchForm.startTime1);
    var endTime1 = new Date(searchForm.endTime1);

    var momentStartTime = moment(startTime1);
    var momentEndTime = moment(endTime1);

    var diff = momentEndTime.diff(momentStartTime, 'seconds');
    var epoch = moment('1970-01-01 00:00:00');

    var epochDiff = momentStartTime.diff(epoch, 'seconds');

    var startDate = moment(new Date(searchForm.startDate));
    var endDate = moment(new Date(searchForm.endDate));

    startDate = new Date(startDate.add(epochDiff, 'seconds').format('LLL'));
    endDate = new Date(endDate.add(epochDiff, 'seconds').format('LLL'));

    var channels = '';

    var wcll = searchForm.wcll;
    var wcmh = searchForm.wcmh;

    //Channels should be maintained in the tv search engine controller
    //Their values should be what we are going to query in the db (what they are named in the SRT table)
    //Get all channels. For each channel, check if it is true. If true, then add to arguments.


    if (wcll == true) {
        channels += "WCLL-CD ";
    }


    if (wcmh == true) {
        channels += "WCMH-DT ";
    }

    // Build the query from the variables.
    var query = 'CALL dc.Search_Engine(?,?,?,?,?,?,?,?)';
    var queryParams = [startDate.toMysqlFormat(), endDate.toMysqlFormat(), startTime1.toMysqlFormat(), endTime1.toMysqlFormat(), days, channels, searchForm.searchQuery, searchForm.numOfRecords];
    console.log(channels);
    // query = 'CALL dc.Simple_Search(?,?)';
    // queryParams = [searchForm.searchQuery,searchForm.numOfRecords];

    connection.query(query, queryParams, function (err, rows) {
        if (err) {
            //throw err;// uncomment to show sql errors
            console.log(err);
            res.status(500).send("Something broke!");
        } else {
            //rows[0].sort(function(x, y) {
            //  var filenameCmp = x.Mp4_File_Name.localeCompare(y.Mp4_File_Name);
             // if(filenameCmp !== 0) {
              //  return filenameCmp;
             // }

           //   return x.CC_Num - y.CC_Num;
          //  }); 

            var resultSize = rows[0].length;
            var rowsByFilename = _.groupBy(rows[0], 'Mp4_File_Name');
            console.log(rowsByFilename);
            res.status(200).send([rowsByFilename, resultSize]);
        }
    });
});

module.exports = router;
