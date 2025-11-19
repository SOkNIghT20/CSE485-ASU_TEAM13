var express = require('express');
var crypto = require('crypto');
var moment = require('moment');
var router = express.Router();

var db = require('./dbconnect.js');
const passport = require('passport');


// ROUTES
// localhost:3000/admin/login
router.post("/admin/login", passport.authenticate('jwt', { session: false }), function (req, res) {
    //DB conncection
    var connection = db.getConnection(function(err) {
        if(err) { 
            console.log(err);
            res.status(500).send('Error connecting to Database').end();
        }
    });

    //Get email and password from request
    var email = req.body.email;
    var password = req.body.password;
    // Search for user with that email
    connection.query('SELECT * FROM dcUsers.admins WHERE Email = ?', email, function (err, rows, fields) {
        // Catch a sql error
        if (err) {
            console.log(err);
            res.status(500).send("Something went wrong with out server!");
        }
        else {
            // If an email was found...
            if (rows[0]) {
                // get the salt from the record, hash it with the user submitted password
                var salt = rows[0].salt;
                var passHash = sha512(password, salt);
                password = passHash.passwordHash;
                // Compare submitted pass to saved pass
                if (password == rows[0].password) {
                    // Create session information
                    var theData = {access_token: genRandomString(16)};
                    var now = new Date();
                    now = now.toMysqlFormat();
                    // Save session information
                    connection.query('INSERT INTO dcUsers.sessions (session, expiresOn) VALUES (?, ?)', [theData.access_token, now], function(err, result) {
                        if (err) {
                            res.status(500).send("Something went wrong when creating the session. Please try again!");
                        } else {
                            // Send data if session successfully created
                            res.status(202).send(theData);
                        }
                    });
                } else {
                    res.status(400).send("You have entered an incorrect password");
                }
            } else {
                res.status(400).send("User with that email not found");
            }
        }

        connection.end();
    });
});

// HELPERS
// For converting a javascript datetime to mysql datetime
function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}
Date.prototype.toMysqlFormat = function () {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

// functions for creating user salt and password hashes
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};
/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};
function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    return passwordData;
}

module.exports = router;
