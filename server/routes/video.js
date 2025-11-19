var fs = require('fs');
var tmp = require('tmp');
var express = require('express');
var router = express.Router();
var exec = require('child_process').execFile;
var path = require('path');
const passport = require('passport');

// adtional time to pad video with
const expand = 10.0;


router.get('/video', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    
    var mp4File = req.query.mp4File;
    // options for responce headers
    var options = {}
    // extrat and pad times
    var starta = req.query.start.split(':');
    var stopa = req.query.stop.split(':');

    var start = Math.round((starta[0] * 60*60) + (starta[1] *60) + (starta[2] *1));
    var stop = Math.round((stopa[0] * 60*60) + (stopa[1] *60) + (stopa[2] *1));
    var length = stop -start + expand;
    start -= expand;
    
    console.log('starta:',starta);
    console.log('stopa:',stopa);
    console.log('start:',start);
    console.log('stop:',stop);
    // mp4 is default format
    var fmt = 'mp4';
    if(req.query.fmt){
        fmt = req.query.fmt;
    }

    // set new headers for downloads vs streams
    if (req.query.download){
        options = {
            headers: {
                'x-timestamp':Date.now(),
                'x-send':true,
                'Content-type':'application/octet-stream',
                'Content-disposition':'attachment;filename=video.'+fmt,
            }
        }
    }

    console.log('fmt:',fmt);
    
// get new tmp file note: name determines how ffmpeg will encode it
    tmp.tmpName({postfix: '.'+fmt}, function(err,tmpf) {
        if (err) {
            console.log('cannot make tmp file');
            res.status(500).send('Unable to make tmp file');
            return;
        }
    	// ffmpeg arguments
        var args = [
                    '-ss', start,  // start time
                    '-i', mp4File, // input file
                    '-t', length,  // stopt time - start time
                    '-y',          // force overwrite
                    '-strict',     //
                    '-2',          //^these two ags are needed for older version of ffmpeg
                    '-f', fmt,     // set format
                    '-s', 'vga',   // video resolution
                    '-b', '200000',// bitrate (change to trade quality for filesize)
                    '-avoid_negative_ts','1', // just incase
                    //'-loglevel', 'quiet',
                    tmpf
                   ];
        console.log('$ffmpeg '+args);

        exec('ffmpeg',args, function(err,stdout,stderr) {
                if(err) {
	            // send the stdout and stderr to browser something weird happened
                    res.status(500).send("#"+stdout + '\r\n\r\n' + stderr+'\n' + err);
                }else {
	  	    // send video with headers
                    res.sendFile(tmpf,options,function(err) {
                        if (err) {
                            console.log(err);
                        }
			// cleanup
                        fs.unlink(tmpf,function(){console.log('removed '+tmpf);});
                    });
                }
//close braces
        });

        exec('ffmpeg -codecs', )
    });

});
module.exports = router;
