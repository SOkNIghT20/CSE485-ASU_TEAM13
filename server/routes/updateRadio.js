var express = require('express');
var db = require('./dbconnect.js');
var router = express.Router();
const passport = require('passport');

router.get('/updateRadio', passport.authenticate('jwt', { session: false }), function (req, res) {
  const country = req.query.country;
  const state = req.query.state;
  const city = req.query.city;
  const allCountries = country === 'All';
  const allStates = state === 'All';
  const allCities = city === 'All';

  //DB conncection
  var connection = db.getPool();

  // Call the stored procedure based on selection and update types
  var query = 'CALL dc.Update_Radio(?,?,?,?,?,?)';
  var queryParams = [country,
    state,
    city,
    allCountries,
    allStates,
    allCities];


  connection.query(query, queryParams, function (err, rows) {
    if (err) {
      console.log(err);
      res.status(500).send("Something broke!");
    } else {
      res.status(200).send(rows[0]);
    }
  });
});

module.exports = router;
