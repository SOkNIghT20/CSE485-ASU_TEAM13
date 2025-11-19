"use strict";

//import {videoSource} from "../../src/app/services/search.component";
/*
REFERENCE MATERIAL https://medium.com/@daspinola/video-stream-with-node-js-and-html5-320b3191a6b6
 */
var fs = require('fs');
var express = require('express');
var router = express.Router();
var path = require('path');
const passport = require('passport');

router.get('/stream'/*, passport.authenticate('jwt', { session: false })*/, function (req, res, next) {
	//var fileName = path.basename(req.query.file);
	var file_name = req.query.file;
	console.log("streamVideo.js file_name:", file_name);
		
	//once we know where files will be located we can switch it out from the /assets folder
	//const path = file_name; //'assets/sample.mp4';
	
	var ext_name = path.extname(file_name);
	var file_type = '';
	
	switch(ext_name) {
    case '.mp4':
        file_type = 'video/mp4';
        break;
    case '.vtt':
        file_type = 'text/vtt';
        break;
    case '.wav':
        file_type = 'audio/wav';
        break;
	}
	//console.log("streamVideo.js ext:", ext_name);
	console.log("looking");

	// Asynchronously check if the file exists and get its stats
	fs.stat(file_name, (err, stat) => {
		if (err) {
			console.log("error in lebron:", err);
			// Provide more specific error messages based on the error code
			if (err.code === 'ENOENT') {
				// File not found
				return res.status(404).send(`Sorry: Video no longer archived - file not found at "${file_name}".`);
			} else if (err.code === 'EACCES') {
				// Permission denied
				return res.status(403).send(`Sorry: Video no longer archived - permission denied to access "${file_name}".`);
			} else {
				// Other errors
				return res.status(500).send(`Sorry: Video no longer archived - an unexpected error occurred while accessing "${file_name}".`);
			}
		}

		console.log("found " + file_name);
		const fileSize = stat.size;
		const range = req.headers.range;
		if (range) {
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1]
				? parseInt(parts[1], 10)
				: fileSize - 1;
			const chunksize = (end - start) + 1;
			console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);	//DEBUG
			const file = fs.createReadStream(file_name, { start: start, end: end });
			const head = {
				'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunksize,
				'Content-Type': file_type
			};
			res.writeHead(206, head);
			file.pipe(res);
		} else {
			const head = {
				'Content-Length': fileSize,
				'Content-Type': file_type
			};
			res.writeHead(200, head);
			fs.createReadStream(file_name).pipe(res);
		}
	});
});
module.exports = router;
