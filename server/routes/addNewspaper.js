var express = require('express');
var db = require('./dbconnect.js');
var router = express.Router();
const passport = require('passport');

router.post('/addNewspaper', passport.authenticate('jwt', { session: false }), function (req, res) {
  const newspaperName = req.body.name;
  const homeURL = req.body.homeURL;
  const rssFeed = req.body.rssFeed;
  const country = req.body.country;
  const stateProvince = req.body.stateProvince;
  const city = req.body.city;

  //DB conncection
  var connection = db.getPool();

  var query = 'CALL dc.Insert_Newspaper(?,?,?,?,?,?)';
  var queryParams = [newspaperName,
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
