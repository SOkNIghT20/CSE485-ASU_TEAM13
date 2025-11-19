var express = require('express');
var db = require('./dbconnect.js');
var router = express.Router();
const passport = require('passport');

router.get('/getNewspapers', passport.authenticate('jwt', { session: false }), function (req, res) {
  //DB conncection
  var connection = db.getPool();

  var query = 'CALL dc.Get_Newspapers()';

  connection.query(query, function (err, rows) {
    if (err) {
      console.log(err);
      res.status(500).send("Something broke!");
    } else {
      res.status(200).send(rows[0]);
    }
  });
});

module.exports = router;
