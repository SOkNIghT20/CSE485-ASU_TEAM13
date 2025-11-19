const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const passport = require('passport');
const fs = require('fs');
const path = require('path');

router.post('/dlmedia', passport.authenticate('jwt', { session: false }), (req, res) => {
  const request = req.body;
  console.log("Download request:", request);

  const scriptPath = "/home/node/app/services/download";
  const outputName = `${request.fileName}_${request.startTime}_${request.endTime}.${request.format}`;
  const outputPath = `/home/node/app/services/downloads/${outputName}`;

  const skipTrim = (request.startTime === '00:00:00' && request.endTime === '00:00:00');

  let command; 

  if (skipTrim) {
    // Full file download: just copy the original .mp4 to the downloads folder
    command = `cp "${request.routeToFile}${request.fileName}.mp4" "${outputPath}"`;
  } else {
    // Trimmed clip: call the download shell script with all parameters
    command = `${scriptPath} ${request.routeToFile} ${request.fileName} ${request.format} ${request.startTime} ${request.endTime}`;
  }
  
  // Execute the download script
  exec(command, { cwd: '/home/node/app/services' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error generating video clip');
    }

    console.log('FFmpeg finished. Checking for file:', outputPath);
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);

    if (!fs.existsSync(outputPath)) {
      console.error("File not found after FFmpeg:", outputPath);
      return res.status(404).send("Generated file not found");
    }

    res.setHeader('Content-Disposition', `attachment; filename="${outputName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(outputPath);
    fileStream.pipe(res);

    fileStream.on('error', err => {
      console.error('File stream error:', err);
      res.status(500).send('Failed to stream video');
    });
  });
});

module.exports = router;

/*


try {
	var execute = new ffmpeg(request.routeToFile + request.fileName + ".mp4");
	execute.then(function (video) {
		
		video.setVideoFormat(request.format)
		video.setVideoCodec(request.format)
		video.setVideoStartTime('00:' + request.startTime + ':00')
		//video.setVideoEndTime('00:' + request.endTime + ':00')
		video.save(request.fileName + '_' + request.startTime + '_' + request.endTime + '.' + request.format, function (error, file) {
			if (!error)
				console.log('Video file: ' + file);
		});

	}, function (err) {
		console.log('Error: ' + err);
	});
} catch (e) {
	console.log(e.code);
	console.log(e.msg);
}
 
 
*/
    
    
    
    
    /*
    const request = JSON.parse(req.query.file);
	
	var getFile = new Promise(function(resolve, reject) {

        console.log(request);
        console.log(request.fileName);
        console.log(request.format);
        console.log(request.startTime);
        console.log(request.endTime);
        console.log(request.routeToFile);

        exec("chmod 777 /home/henry/front/front/server/services/download");
        var execute = "/home/henry/front/front/server/services/download";
        execute += " " + request.routeToFile
        execute += " " + request.fileName;
        execute += " " + request.format;
        execute += " " + request.startTime;
        execute += " " + request.endTime;
        exec(execute, (error, stdout, stderr) => 
        {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          console.error(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
    });
	
	console.log("lll");
	getFile.then(function() {
		console.log("fff");
        res.setHeader('Content-Disposition', 'attachment; filename=' + request.fileName + '_' + request.startTime + '_' + request.endTime + '.' + request.format);
        res.end()
    }, function() {}); 
      
     */

//module.exports = router;