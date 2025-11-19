var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();
var _ = require('underscore');
const passport = require('passport');

// ROUTES
// localhost:3000/getChannels
// If the user has a valid session searches the DB based on their keywords.
router.get('/getChannels', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log('CSV CALL');
    //DB conncection

    csvfile = 

    connection.query(query, function (err, rows) {
        if (err) {
            console.log(err);
            res.status(500).send("Something broke!");
        } else {
            /*
            var resultSize = rows[0].length;
            var rowsByFilename = _.groupBy(rows[0], 'Mp4_File_Name');
            console.log(rowsByFilename);
            res.status(200).send([rowsByFilename, resultSize]);
            */
            res.status(200).send(rows[0]);
        }
    });

    connection.end();
});

module.exports = router;
