var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

const {promisify} = require('util')
const exec= promisify(require('child_process').exec);
var tmp = require('tmp');
const { type } = require('jquery');
tmp.setGracefulCleanup();

/* 
Video editor to both trim and stitch. 
*/

router.get('/videoEditor', async (req, res) => {
    const file_name = decodeURIComponent(req.query.file)
    const reso = decodeURIComponent(req.query.resolution)
    const fileForm = decodeURIComponent(req.query.fileFormat)
    var file_type = '';
    // gets the suffix of the file
	switch(fileForm) {
    case '.mp4':
        file_type = 'video/mp4';
        break;
    case 'mov':
        file_type = 'video/mov';
        break;
    case '.avi':
        file_type = 'video/avi';
        break;
    case '.webm':
        file_type = 'video/webm';
        break;
    case '.mkv':
        file_type = 'video/mkv';
        break;
    case '.vtt':
        file_type = 'text/vtt';
        break;
    case '.wav':
        file_type = 'audio/wav';
        break;
	}
    // Split the start and end times into arrays
    var startTimes = req.query.start.split(",");
    var endTimes = req.query.end.split(",");

    var promiseArray = []
    var allArgs = []
    var tempFiles = []
    var inputPaths = []
    // Start loop
    // Creates a temporary file for each video to be cut into
    // create the arguments for each ffmpeg call
    for await(const i of startTimes.keys()){
        const name = tmp.fileSync({postfix: fileForm});
        var args = 
            '-i ' + file_name +
            ' -vf scale=' + reso +
            ' -ss ' + startTimes[i] +              
            ' -to ' + endTimes[i] + 
            ' -y ' +              
            ' ' + name.name
        allArgs.push(args)
        tempFiles.push(name)
    }
    
    // Loop to cut all videos. Must be a asynchronous.
    for await (const i of allArgs.keys()){
        // creates a new promise for each of the ffmpeg calls
        promiseArray.push(await new Promise(async (resolve, reject) => {
            try{
                // makes the ffmpeg call
                await exec("ffmpeg " + allArgs[i], async (error, stdout, stderr) => {
                    if(error){
                        reject(new Error ("ERROR", error))
                    }
                    else{
                        // adds each clipped video into an array to be used in the concat command
                        inputPaths.push(`file ${path.resolve(tempFiles[i].name)}`)
                        resolve("Success")
                    }
                })
                
            }
            catch(err){
                console.log(err)
                reject(err)
            }
        }))
        
    }

    // Wait to finish all promises (cutting videos) before stitching all cut videos together
    await Promise.all(promiseArray)
    .then(()=> {
        tmp.file({postfix: '.txt'}, async (err, tempTXT, fd, txtcleanupCallback) =>{    // Temp file to hold our file arguments
            tmp.file({postfix: fileForm}, async (err, tempFinal, fd, finalcleanupCallback) =>{  // Temp file to hold our final video
                fs.writeFile(tempTXT, inputPaths.join('\n'), 'utf8' ,(err) =>{  // Write all our file names into the temp txt file
                    exec(`ffmpeg -y -f concat -safe 0 -i ${tempTXT} ${tempFinal}`, async (error, stdout, stderr) => {   // Concatanate/Stitch videos together using arguments inside the txt file and output final video into the temp final video file
                        if(error) throw error          
                        const stat = fs.statSync(tempFinal);					
                        const fileSize = stat.size;
                        const range = req.headers.range;
                        /* Stream video to the front end */
                        if (range) {
                            const parts = range.replace(/bytes=/, "").split("-");
                            const start = parseInt(parts[0], 10);
                            const end = parts[1]
                                ? parseInt(parts[1], 10)
                                : fileSize-1;
                            const chunksize = (end-start)+1;
                            const file = fs.createReadStream(tempFinal, {start : start, end : end});
                            const head = {
                                'Content-Range': 'bytes '+ start + '-'+ end +'/' + fileSize,
                                'Accept-Ranges': 'bytes',
                                'Content-Length': chunksize,
                                'Content-Type': file_type
                            };
                            res.writeHead(206, head);
                            file.pipe(res);
                        } 
                        else{
                            const head = {
                                'Content-Length': fileSize,
                                'Content-Type': file_type
                            };
                            res.writeHead(200, head);
                            fs.createReadStream(tempFinal).pipe(res)
                        }
                        /* Cleanup all temp files aka delete them */
                        txtcleanupCallback()
                        finalcleanupCallback()
                        tempFiles.forEach(file => { file.removeCallback(); })
                    })
                    return tempFinal
                })
            })
        })
    })
    .catch((err) => {
        console.log("ERROR", err)
    }) 
    
})


module.exports = router;