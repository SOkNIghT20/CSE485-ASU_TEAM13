var express = require('express');
var companyName = require('./companyInfo');
var router = express.Router();
const passport = require('passport');

router.get('/getCompanyName', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.status(200).send(companyName.name);
});

router.post('/updateCompanyName', passport.authenticate('jwt', { session: false }), function (req, res) {
  companyName.name = req.companyName;
  res.status(200).send(companyName.name);
});

module.exports = router;
