var express = require('express');
var db = require('./dbconnect.js');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();
var _ = require('underscore');
const passport = require('passport');

var DBPASSWORD = ''; // Global variable for database root user password.

// ROUTES
// localhost:3000/tvSearch
// If the user has a valid session searches the DB based on their keywords.
router.get('/additionalcc', passport.authenticate('jwt', { session: false }), function (req, res, next) {
  console.log('SEARCH CALL');

  //DB conncection
  let connection = db.getPool();

  /*
   MP4_file_name    TEXT,
   Channel_id       INT,
   Upper_cc_num     INT,
   Lower_cc_num     INT
   */
  // Create variables for the query so it's easier to read.
  var file_name = req.query.file_name;
  var channel_id = req.query.channel_id;
  var lower_cc_num = req.query.lower_cc_num;
  var upper_cc_num = req.query.upper_cc_num;

  console.log(req.query)

  // Build the query from the variables.
  var query = 'CALL dc.additional_cc(?,?,?,?)';
  var queryParams = [file_name,
    channel_id,
    lower_cc_num,
    upper_cc_num];

  connection.query(query, queryParams, function (err, rows) {
    if (err) {
      //throw err;// uncomment to show sql errors
      console.log(err);
      res.status(500).send("Something broke!");
    } else {

      var resultSize = rows[0].length;
      console.log(rows[0]);
      var resp = '';
      rows[0].map(r => {resp += r['Result_Line'];})
      console.log(resp);
      res.status(200).send({additional_cc : resp});
    }
  });
});

module.exports = router;
