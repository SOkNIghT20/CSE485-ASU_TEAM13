"use strict";
const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const cronJobService = require('../services/cronJobService');
const passport = require('passport');

router.get('/sendEmail', passport.authenticate('jwt', { session: false }), (req, res) => {
    const {searchQuery, selectedChannel, numOfRecords, realTimeAlerts, emailaddresses, reportFormats} = req.query;
    let lastDate = new Date(0);
    const sendEmail = () => {
        emailService.sendEmailForQuery(searchQuery, selectedChannel, numOfRecords, emailaddresses, reportFormats, lastDate)
            .catch(err => {
                console.log(err);
            });
        lastDate = new Date();
    };
    const minuteInterval = parseInt(realTimeAlerts);
    if (minuteInterval > 0) {
        cronJobService.createCronJob(sendEmail, minuteInterval);
    }
    sendEmail();
    res.status(200).send("\n\nSending email.\n\n");
});

module.exports = router;
