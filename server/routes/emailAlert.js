var express = require('express');
var db = require('./dbconnect.js');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();
const emailAlertListHandler = require('./emailAlertListHandler');
const passport = require('passport');

// Middleware to check if the email is guest@digimedia.com
function checkEmail(req, res, next) {
  const userEmail = req.query.userEmail || req.body.email;

  if (userEmail === 'guest@digimedia.com') {
      return res.status(403).json({ 
          meta: { 
              status: 403, 
              message: 'Please subscribe to access this feature.' 
          } 
      });
  }

  next();
}

router.get('/getAlerts', passport.authenticate('jwt', { session: false }), checkEmail, function (req, res, next) {
    // const userEmail = JSON.parse(localStorage.getItem('user')).email;
    let userEmail = req.query.userEmail;
    // const queryParams = [userEmail];
    console.log('ALERT CALL');
    
    //DB conncection
    var connection = db.getConnection(function(err) {
        if(err) { 
            console.log(err);
            console.log('DB ERROR');
        }
    });

    // var query = 'CALL dc.Get_Alert_List(?)';

    // connection.query(query, queryParams, function (err, rows) {
        // if (err) {
            // console.log(err);
            // res.status(500).send("Something broke!");
        // } else {
            /*
            var resultSize = rows[0].length;
            var rowsByFilename = _.groupBy(rows[0], 'Mp4_File_Name');
            console.log(rowsByFilename);
            res.status(200).send([rowsByFilename, resultSize]);
            */
            // res.status(200).send(rows[0]);
        // }
    // });

    // connection.end();
    // var email = JSON.parse(localStorage.getItem('user')).email;
    emailAlertListHandler.getAlertList(userEmail)
    .then(rows => {
        if (rows == null) {
            res.send({meta: {status: 400, message: 'Query result is empty'}});
        } else {
            res.status(200).send(rows[0]);
        }
	connection.end();
    },
     err => {
        console.log(err);
        res.status(500).send("Failed to get alert list");
	connection.end();
    });
});

router.post("/newEmailAlert", passport.authenticate('jwt', { session: false }), function (req, res) {
  //DB connection
  var alert = req.body;
  console.log("ROUTER POST EMAIL ALERT");
  console.log(alert);
  var market = null;
  var country = null;
  var mediaType = null;
  var magazineName = null;
  var newspaperName = null;
  var socialMediaName = null;
  var groupId = null;
  
  var insertAlert = function() {
    var connection = db.getPool();
    var queryParams = [alert.alertId, groupId, alert.email, alert.keywords_string, alert.denverTelevision, alert.realTimeAlerts, alert.mediaTypeTelevision,
      alert.startDate, alert.startTime, alert.endDate, alert.endTime, alert.emails, alert.numOfResults, alert.formatEmail, alert.formatDoc,
      alert.formatExcel,alert.formatPDF, alert.formatHTML, alert.digiViewType, alert.digiViewAndAnalysis, alert.textReport, alert.textReportAnalysis, alert.hitReport,
      alert.hitReportAndAnalysis, alert.positivePhrases, alert.negativePhrases, alert.phrases, market, country, mediaType, magazineName, newspaperName, socialMediaName];

    var query = 'INSERT INTO dc.emailAlerts  (alertId, groupId, email, keywords_string, denverTelevision, realTimeAlerts, mediaTypeTelevision, ' +
    'startDate, startTime, endDate, endTime, emails, numOfResults, formatEmail, formatDoc,' +
    'formatExcel,formatPDF, formatHTML, digiViewType, digiViewAndAnalysis, textReport, textReportAnalysis, hitReport, ' +
    'hitReportAndAnalysis, positivePhrases, negativePhrases, phrases, market, country, mediaType, magazineName, newspaperName, socialMediaName)' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    connection.query(query, queryParams, function (err, rows, fields) {
      if (err) {
        res.status(500).send(err);
        throw err;
      }
    });
  }
  console.log(alert.mediaFilters);
  
  alert.mediaFilters.forEach(function(filter) {
    mediaType = filter.type;

    if (filter.countries) {
      groupId = filter.groupId;
      filter.countries.forEach(function(_country) {
        country = _country;
        insertAlert();
      });
      country = null;
    } 

    if (filter.markets) {
      groupId = filter.groupId;
      filter.markets.forEach(function(_market) {
        market = _market;
        insertAlert();
      });
      market = null;
    }

    if (filter.newspaperNames) {
      groupId = filter.groupId;
      filter.newspaperNames.forEach(function(medium) {
        newspaperName = medium;
        insertAlert();
      });
      newspaperName = null;
    }

    if (filter.magazineNames) {
      groupId = filter.groupId;
      filter.magazineNames.forEach(function(medium) {
        magazineName = medium;
        insertAlert();
      });
      magazineName = null;
    }

    if (filter.socialMediaNames) {
      groupId = filter.groupId;
      filter.socialMediaNames.forEach(function(medium) {
        socialMediaName = medium;
        insertAlert();
      });
      socialMediaName = null;
    }
  });
  
  res.status(200).send("email alert successful.");
})

router.delete("/emailalert", passport.authenticate('jwt', { session: false }), function (req, res) {
  //DB conncection
  var connection = db.getPool();

  var query = 'DELETE FROM dc.emailAlerts WHERE alertId = ?';
  connection.query(query, req.query['id'], function (err, rows, fields) {
    if (err) {
      res.status(500).send("Failed to delete email alert");
      throw err;
    } else {
      res.status(200).send("email alert deletion successful.");
    }
  });
})

router.get("/emailalert/mine", passport.authenticate('jwt', { session: false }), function(req, res, next) {
  //DB conncection
  var connection = db.getPool();
  console.log(req)

  var query = 'SELECT * FROM dc.emailAlerts WHERE email = ?;';

  connection.query(query, req.query.email, function (err, rows, fields) {
    if (err) {;
      res.status(500).send(err);
    } else {
      res.status(200).send(rows);
    }
  });
});

router.post("/emailalert/edit", passport.authenticate('jwt', { session: false }), function (req, res) {
  //DB connection
  var connection = db.getPool();
  var alert = req.body;
  var query = 'UPDATE dc.emailAlerts SET email = ?, keywords_string = ?, denverTelevision = ?, realTimeAlerts = ?, mediaTypeTelevision = ?, ' +
    'country = ?, stateProv = ?, city = ?, startDate = ?, startTime = ?, endDate = ?, endTime = ?, emails = ?, numOfResults = ?, formatEmail = ?, formatDoc = ?,' +
    'formatExcel = ?,formatPDF = ?, formatHTML = ?, digiViewType = ?, digiViewAndAnalysis = ?, textReport = ?, textReportAnalysis = ?, hitReport = ?, ' +
    'hitReportAndAnalysis = ?, positivePhrases = ?, negativePhrases = ?, phrases = ? WHERE idemailAlerts = ?';
  var queryParams = [alert.email, alert.keywords_string, alert.denverTelevision, alert.realTimeAlerts, alert.mediaTypeTelevision, alert.country, alert.stateProv, alert.city, alert.startDate, alert.startTime, alert.endDate, alert.endTime, alert.emails, alert.numOfResults, alert.formatEmail, alert.formatDoc, alert.formatExcel,alert.formatPDF, alert.formatHTML, alert.digiViewType, alert.digiViewAndAnalysis, alert.textReport, alert.textReportAnalysis, alert.hitReport, alert.hitReportAndAnalysis, alert.positivePhrases, alert.negativePhrases, alert.phrases, alert.idemailAlerts];

  connection.query(query, queryParams, function (err, rows, fields) {
    if (err) {
      res.status(500).send(err);
      throw err;
    } else {
      res.status(200).send("email alert successful.");
    }
  });
})

module.exports = router;
