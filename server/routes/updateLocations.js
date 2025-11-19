var express = require('express');
var db = require('./dbconnect.js');
var router = express.Router();
const passport = require('passport');

router.get('/updateLocations', passport.authenticate('jwt', { session: false }), function (req, res) {
  const selectionType = req.query.selectionType;
  const selection = req.query.selection;
  const updateType = req.query.updateType;

  //DB conncection
  var connection = db.getPool();

  // Call the stored procedure based on selection and update types
  var query = '';
  var queryParams = [];
  if (selectionType === 'country') {
    if (updateType === 'state') {
      query = 'CALL dc.Update_States_With_Country(?)';
      queryParams = [selection];
    }
    if (updateType === 'city') {
      query = 'CALL dc.Update_Cities_With_Country(?)';
      queryParams = [selection];
    }
  }
  if (selectionType === 'state') {
    if (updateType === 'country') {
      query = 'CALL dc.Update_Countries_With_State(?)';
      queryParams = [selection];
    }
    if (updateType === 'city') {
      query = 'CALL dc.Update_Cities_With_State(?)';
      queryParams = [selection];
    }
  }
  if (selectionType === 'city') {
    if (updateType === 'country') {
      query = 'CALL dc.Update_Countries_With_City(?)';
      queryParams = [selection];
    }
    if (updateType === 'state') {
      query = 'CALL dc.Update_States_With_City(?)';
      queryParams = [selection];
    }
  }

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
