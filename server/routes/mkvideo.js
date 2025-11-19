var fs = require('fs');
var tmp = require('tmp');
var express = require('express');
var router = express.Router();
var exec = require('child_process').execFile;
var path = require('path');
const expand = 3.0;
const passport = require('passport');

function qargs(args) {
    res = '';
    for (i in args) {
        res += "'" + args[i] + "' ";
    }
    return res;
}

router.get('/mkvideo', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    var mp4File = req.query.mp4File;
/*
    var start = req.query.start
    var stop = req.query.stop
*/
    var starta = req.query.start.split(':');
    var stopa = req.query.stop.split(':');

    var start = Math.round((starta[0] * 60*60) + (starta[1] *60) + (starta[2] *1));
    var stop = Math.round((stopa[0] * 60*60) + (stopa[1] *60) + (stopa[2] *1));
    var length = stop -start + expand;
    
    console.log('starta:',starta);
    console.log('stopa:',stopa);
    console.log('start:',start);
    console.log('stop:',stop);
    var fmt = 'mp4';
    if(req.query.fmt){
        fmt = req.query.fmt;
    }
    
    tmp.tmpName({postfix: '.'+fmt}, function(err,tmpf) {
        if (err) {
            console.log('cannor make tmp file');
            res.status(500).send('Unable to make tmp file');
            return;
        }
	var args = [
                      '-ss', start,
                      '-i', mp4File, 
                      '-t', length,
                      '-y',
                      '-strict',
                      '-2',
                      '-f', fmt,
                      //'-loglevel', 'quiet',
                      tmpf
                     ];
        console.log('$ffmpeg ' + qargs(args));

        exec('ffmpeg',args, function(err,stdout,stderr) {
                if(err) {
                    res.status(500).send(stdout + '\n' + stderr);
                }else {
                    res.status(200).send({filepath:tmpf,fmt:fmt});
                }
        });
        //cleanup();
    });

});
module.exports = router;
