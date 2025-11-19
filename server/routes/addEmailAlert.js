var express = require('express');
var db = require('./dbconnect.js');
var router = express.Router();
const passport = require('passport');

router.post('/addEmailAlert', passport.authenticate('jwt', { session: false }), function (req, res) {
  const keyword = req.body.keyword;
  const email = req.body.email;
  const media = req.body.media;
  const duration = req.body.duration;

  //DB conncection
  var connection = db.getPool();
  
  var query = 'CALL dc.Insert_Email_Alert(?,?,?,?)';
  var queryParams = [duration,
    keyword,
    media,
    email];
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
