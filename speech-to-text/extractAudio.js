var ffmpeg = require('fluent-ffmpeg');

/**
 *    input - string, path of input file
 *    output - string, path of output file     
 */
module.exports = {
    extractAudio: async function(source, output) {
        var command = ffmpeg(source)
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
        .save(output)
        .on('end', function() {
            console.log('Processing finished!');
        });
        command.kill();
    }
};



