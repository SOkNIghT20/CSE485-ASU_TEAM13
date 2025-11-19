var express = require('express');
var db = require('./dbconnect.js');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();
const passport = require('passport');

router.post("/orderForm", passport.authenticate('jwt', { session: false }), function (req, res) {
    //DB conncection
    var connection = db.getPool();
    var orderForm = req.body.params.orderForm;

    //Get params from the order form
    //Customer Info Page
    var firstName = orderForm.firstName;
    var lastName = orderForm.lastName;
    var email = orderForm.email;
    var phone = orderForm.phone;
    var organization = orderForm.organization;
    var address;
    if (orderForm.address) {
        address = orderForm.address+','+orderForm.suite_num+','+orderForm.state+','+orderForm.country+','+orderForm.zipcode;
        address = address.replace(new RegExp('undefined,', 'gi'), '');
    } else {
        address = 'Not Provided';
    }


    //Clip Info Page
    var is90days = orderForm.broadcastAge == 'Yes' ? 1:0; //not relavent to db
    var broadcastDate = orderForm.broadcastDate;
    var broadcastTime = orderForm.broadcastTime;

    var market = orderForm.market;
    var channel = orderForm.callsign.replace(/,/g, '');
    

    var programname = orderForm.programName;
    var subjectPhrases = orderForm.clipSubject;

    var cliptype = orderForm.clipType;

    var PCtype = orderForm.computerType;
    var reportType = orderForm.transcriptChoice;

    var query = 'INSERT INTO dc.Orders  (firstName, lastName, email, phone, organization, address, is90days, broadcastDate, broadcastTime, coveragetype, channel, programname, subjectPhrases, cliptype, PCtype, reportType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    var queryParams =                   [firstName, lastName, email, phone, organization, address, is90days, broadcastDate, broadcastTime, market, channel, programname, subjectPhrases, cliptype, PCtype, reportType];

    console.log("\n\n\n" + queryParams + "\n\n\n");
    connection.query(query, queryParams, function (err, rows, fields) {
        if (err) {
            res.status(500).send("Failed to place order");
            throw err;
        } else {
            res.status(200).send("Order placement successful.");
        }
    });
});

router.get("/admin/orders", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    //DB conncection
    var connection = db.getPool();
    var query = 'SELECT * FROM dc.Orders WHERE fulfilled = 0';

    connection.query(query, function (err, rows, fields) {
        if (err) {;
            res.status(500).send("Failed to place order");
        } else {
            res.status(200).send(rows);
        }
    });
});

router.post("/admin/orders", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    //DB conncection
    var connection = db.getPool();
    var orderid = req.body.params.orderid;

    var query = 'UPDATE dc.Orders SET fulfilled = 1 WHERE id = ?';

    connection.query(query, orderid, function (err, rows, fields) {
        if (err) {
            res.status(500).send("Failed to place order");
        } else {
            res.status(200).send("Order has been marked as fulfilled. Refresh to reflect this change.");
        }
    });
});

router.get("/admin/ordersOld", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    //DB conncection
    var connection = db.getPool();

    var query = 'SELECT * FROM dc.Orders WHERE fulfilled = 1';

    connection.query(query, function (err, rows, fields) {
        if (err) {
            res.status(500).send("Failed to place order");
        } else {
            res.status(200).send(rows);
        }
    });
});

router.get("/orderform/markets", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    //DB conncection
    var connection = db.getPool();
    var query = 'SELECT * FROM dc.Markets';

    connection.query(query, function (err, rows, fields) {
        if (err) {
            res.status(500).send("Failed to get markets");
        } else {
            res.status(200).send(rows);
        }
    });
});

router.get("/orderform/markets/channels", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    //DB conncection
    var connection = db.getPool();

    var query = 'SELECT * FROM dc.Channels';

    connection.query(query, function (err, rows, fields) {
        if (err) {
            res.status(500).send("Failed to get channels");
        } else {
            res.status(200).send(rows);
        }
    });
});

//helpers
// For converting a javascript datetime to mysql datetime
function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}
Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

module.exports = router;
