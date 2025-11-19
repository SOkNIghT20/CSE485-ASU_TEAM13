var express = require('express');
var db = require('./dbconnect.js');
var router = express.Router();
const passport = require('passport');

router.post('/addMagazine', passport.authenticate('jwt', { session: false }), function (req, res) {
  const magazineName = req.body.name;
  const homeURL = req.body.homeURL;
  const rssFeed = req.body.rssFeed;
  const country = req.body.country;
  const stateProvince = req.body.stateProvince;
  const city = req.body.city;

  //DB conncection
  let connection = db.getPool();

  var query = 'CALL dc.Insert_Magazine(?,?,?,?,?,?)';
  var queryParams = [magazineName,
    homeURL,
    rssFeed,
    country,
    stateProvince,
    city];
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
