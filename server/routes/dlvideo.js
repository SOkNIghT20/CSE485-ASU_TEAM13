var fs = require('fs');
var express = require('express');
var router = express.Router();
var path = require('path');
const passport = require('passport');

router.get('/dlvideo.:ext', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var fileName = path.basename(req.query.file);
    /*
    console.log('-----HEADDERS----------');
    console.log(req.headers);
    console.log('----MOD-HEADDERS--------');
    console.log(req.headers);
    console.log('-----------------------');
    */
    var options = {
        root:'/tmp',
        dotfiles: 'deny',
        headers: {
                   'x-timestamp':Date.now(),
                   'x-send':true,
                   'Content-type':'application/octet-stream',
                   'Content-disposition':'attachment;filename=video.'+req.params.ext,
        }
    };

    res.sendFile(fileName,options,function(err) {
        console.log(res["_headers"]);
        if(err) {
            console.log(err);
        }
    });

});
module.exports = router;
