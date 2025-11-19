const express = require('express');
const db = require('./dbconnect.js');
const crypto = require('crypto');
const router = express.Router();
const jwt = require('../services/jwt');
const passport = require('passport');
const emailService = require('../services/emailService');
const multer = require("multer");
// upload file path
const FILE_PATH = './uploads/';

// configure multer

var storage = multer.diskStorage(
    {
        destination: FILE_PATH,
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb( null, file.originalname);
        }
    }
);
var upload = multer( { storage: storage } );

// ROUTES
// localhost:3000/login
// Checks for an email and password combination in the DB.
// Creates a session token on success.
router.post("/login", function (req, res) {
    var connection = db.getConnection(function(err) {
        if(err) {
            console.log(err);
            console.error('Error connecting to Database');
        }
    });

    console.log("ips");
	console.log(req.ip);
	console.log(req.connection.remoteAddress);
	console.log(req.headers);
	console.log(req.headers["X-Forwarded-For"]);

    var loginIP = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress;	
    //Get email and password from request
    var email = req.body.email;
    var password = req.body.password;
    // Search for admin with that email
    connection.query('SELECT * FROM dc.admins WHERE Email = ?', email, function (err, rows, fields) {
      // Catch a sql error
      if (err) {
          console.log(err);
          res.status(500).send("Something went wrong!");
          connection.end();
          return;
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
                  var theData = {email: rows[0].email, firstName: rows[0].firstName, lastName: rows[0].lastName, role: 'Admin', token: genRandomString(16)};
                  res.status(202).send(theData);
              } else {
                  res.status(401).send("You have entered an incorrect password or email");
              }
          } else {

            // Email is not in the admin table
            // Search for user with that email
            connection.query('SELECT * FROM dc.users WHERE Email = ?', email, function (err, rows, fields) {
                // Catch a sql error
                if (err) {
                    console.log(err);
                    res.status(500).send("Something went wrong!");
                    connection.end();
                    return;
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
			    if (rows[0].isVerified != 1) {
				res.status(401).send("Please wait for a verification email");
			    }
			    else {
				// Create session information
				const tokenObject = jwt.issueJWT({
				    sub: rows[0].email,
				    email: rows[0].email,
				    role: 'User'
				});
				var theData = {
				    email: rows[0].email, 
				    firstName: rows[0].firstName, 
				    lastName: rows[0].lastName, 
				    role: 'User', 
				    token: tokenObject.token, 
				    expiresIn: tokenObject.expires
				};
				res.status(202).send(theData);
			    }
			} else {
			    res.status(401).send("You have entered an incorrect password or email");
			}
                    } else {
                        res.status(401).send("You have entered an incorrect password or email");
                    }
                }
            });
          }
      }
      connection.end();
    });
});

  router.post('/uploadTermsAndServices', upload.single('fileKey'),(req, res) => {
	try {
		console.log(req.file);
        const avatar = req.file;

        // make sure file is available
        if (!avatar) {
            res.status(400).send({
                status: false,
                data: 'No file is selected.'
            });
        } else {
            // send response
            res.send({
                status: true,
                message: 'File is uploaded.',
                data: {
                    name: avatar.originalname,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }

    } catch (err) {
        res.status(500).send(err);
    }
  })


// localhost:3000/signup
// Creates a salt and passhash for a given user email and password.
router.post("/signup", function (req, res) {
    //DB conncection
    var connection = db.getPool();
    console.log(req.body)
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    var password = req.body.password;

    if (!firstName || !lastName || !email || !password) {
    	res.status(500).send("Invalid inputs");
	return;
    }
    var passHash = saltHashPassword(password);
    password = passHash.passwordHash;
    var salt = passHash.salt;

    // Catch a sql error
    connection.query('SELECT * FROM dc.users WHERE Email = ?', email, function (err, rows, fields) {
		if(err){
			res.status(500).send(err);
		}
		else{
			if(rows[0]){
				res.status(400).send("Email already exists in the database");
			}
			else {
				 var query = 'INSERT INTO dc.users (firstName, lastName, email, password, salt, isVerified, previouslyVerified) VALUES (?, ?, ?, ?, ?, ?, ?)';
				 var queryParams = [firstName, lastName, email, password, salt, 0, 0];
				 connection.query(query, queryParams, function (err, result) {
					if (err) {
						res.status(500).send(err);
					} 
					else {
						res.status(200).send("User registration successful. Please wait for a system administrator to send you a verification email");
						emailService.sendEmailPendingUser(email).catch(err =>
						{
							console.log(err);
						});
					}
				});
			}
    }
    });


    
});

router.post("/changepassword", passport.authenticate('jwt', { session: false }), function (req, res) {
  //DB conncection
  var connection = db.getConnection(function(err) {
    if(err) {
      console.log(err);
      res.status(500).send('Error connecting to Database');
    }
  });
  var email = req.body.email;
  var password = req.body.password;

  var newPassword = req.body.newPassword;
  var newPassHash = saltHashPassword(newPassword);
  newPassword = newPassHash.passwordHash;
  var newPassSalt = newPassHash.salt;

  connection.query('SELECT * FROM dc.users WHERE Email = ?', email, function (err, rows, fields) {
    // Catch a sql error
    if (err) {
      console.log(err);
      res.status(500).send("Something went wrong!");
      connection.end();
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

          const query = 'CALL dc.Update_Password(?,?,?)';
          var queryParams = [email, newPassword, newPassSalt];

          connection.query(query, queryParams, function (err, result) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send("User password update successful.");
            }
          });

        } else {
          res.status(400).send("You have entered an incorrect password");
        }
      } else {
        res.status(400).send("You have entered an incorrect password");
      }
    }
  });
  connection.end();
});


router.get("/isVerified", function(req,res) {
        var email = req.query.email;
        console.log("isVerified  " + email);
        ret = {};
        ret['isVerified'] = false;

        // Special handling for guest users
        if (email === 'guest@digimedia.com') {
            ret['isVerified'] = true;
            res.status(200).send(ret);
            return;
        }

        if (email == undefined) {
                res.status(200).send(ret);
                return;
        }

        var connection = db.getPool()
        // Search for admin with that email
        connection.query('SELECT * FROM dc.admins WHERE Email = ?', email, function (err, rows, fields) {
        // Catch a sql error
        if (err) {
                console.log(err);
                res.status(500).send(ret);
                return;
        }
        else {
        // If an email was found...
                if (rows[0]) {
                        ret['isVerified'] = true;
                        res.status(200).send(ret);
                } else {

                        // Email is not in the admin table
                        // Search for user with that email
                        connection.query('SELECT * FROM dc.users WHERE Email = ? AND isVerified = 1', email, function (err, rows, fields) {
                                // Catch a sql error
                                if (err) {
                                        console.log(err);
                                        res.status(500).send(ret);
                                        return;
                                }
                                else {
                                        // If an email was found...
                                        if (rows[0]) {
                                                ret['isVerified'] = true;
                                                res.status(200).send(ret);
                                        } else {
                                                res.status(200).send(ret);
                                        }
                                }
                        });
                }
        }
   });
});

router.get("/checkEmail", function (req, res) {
    const emailToCheck = req.query.email;
    var connection = db.getConnection(function(err) {
        if(err) {
            console.error('Error connecting to Database');
            return res.status(500).send("Database connection error");
        }
    });

    connection.query('SELECT COUNT(*) AS count FROM dc.users WHERE Email = ?', emailToCheck, function (err, rows) {
        connection.end();
        if (err) {
            console.error(err);
            return res.status(500).send("Database query error");
        }
        if (rows[0].count > 0) {
            // Email exists
            res.send({ exists: true });
        } else {
            // Email does not exist
            res.send({ exists: false });
        }
    });
});

// localhost:3000/registerGuest
// Registers a guest user token
router.post("/registerGuest", function (req, res) {
    try {
        const email = req.body.email;
        console.log('Registering guest user with email:', email);

        if (!email) {
            return res.status(400).send("Email is required");
        }

        // For guest users, we'll validate the email
        if (email !== 'guest@digimedia.com') {
            return res.status(400).send("Invalid guest email");
        }

        // Generate JWT token for guest user
        const tokenObject = jwt.issueJWT({ 
            sub: email,
            role: 'Public',
            email: email  // for backward compatibility
        });

        console.log('Generated token object:', {
            token: tokenObject.token.substring(0, 50) + '...',
            expires: tokenObject.expires,
            payload: { sub: email, role: 'Public', email: email }
        });

        // Return success response with token
        res.status(200).send({
            status: "success",
            message: "Guest user registered successfully",
            token: tokenObject.token,
            expiresIn: tokenObject.expires
        });
    } catch (err) {
        console.error('Error registering guest user:', err);
        res.status(500).send("Internal server error");
    }
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
