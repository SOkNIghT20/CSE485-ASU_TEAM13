"use strict";
const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const fileNameService = require('../services/fileNameService');
const htmlService = require('../services/htmlService');
const passport = require('passport');

router.get('/sendForm', passport.authenticate('jwt', { session: false }), (req, res) => {

  const email = req.query.email;
  const info = req.query.info;

    console.log("TESTINGGGG5...");
    console.log("Email isssss: ", email);
    console.log("Info issssss: ", info);

    function sendForm(emailAddress, body) {

    emailService.sendForm(emailAddress, body);
    };

    sendForm(email, info);
    res.status(200).send("\n\Email sent.\n\n");
});

module.exports = router;
