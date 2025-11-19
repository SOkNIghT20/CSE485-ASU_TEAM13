var fs = require('fs');
var express = require('express');
var router = express.Router();
var thumbler = require('video-thumb');
var path = require('path');
var cashDir = path.join(__dirname,'thumbcash'); // path to store thumbnails
var noImageFile = path.join(__dirname,'noImage.jpg');
const passport = require('passport');

router.get('/thumbnail.jpeg', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var mp4File = req.query.mp4File;
    var timecode = req.query.timecode;
    var fileName = path.basename(mp4File) + '+' + timecode + '.jpeg';

    var options = {
        root:cashDir,
        dotfiles: 'deny',
        headers: {'x-timestamp':Date.now(),'x-send':true}
    };
	
    fs.stat(path.join(cashDir,fileName),function(err) {
        if(err) {
            // thumbnail doesn't exist, create it
            thumbler.extract("'" +mp4File+"'", "'" + path.join(cashDir,fileName) + "'", timecode, '200x125', function(err){
                console.log('--------------------');
                console.log(fileName + ' thumbnail created');
                if(!err){
                    // send newly created thumbnail
                    res.sendFile(fileName,options,function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                }else {
                    // cant make a thumbnail, use error image
                    res.sendFile(noImageFile);
                    console.log(err);
                }
            });
        }else{
            // send the cached image
            res.sendFile(fileName,options,function(err) {
                if(err) {
                    console.log(err);
                }
            });
        }
    });
// close route
});
module.exports = router;
