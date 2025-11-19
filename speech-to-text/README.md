# Speech to Text Recognition

This project aims to get speech-to-text recoginition from video source files.


## Prerequisites
1. [Google Speech-to-text API](https://cloud.google.com/text-to-speech/docs)

	The following tutorial should provide enough details on how to set up the API properly.
	
	* [Google Speech-to-text API with Node.js](https://www.youtube.com/watch?v=naZ8oEKuR44)

2. [FFmpeg](https://www.ffmpeg.org/download.html)
   
   FFmpeg needs to be installed on your local machine. If you are using a Mac, I recommended using [Brew](https://brew.sh/) to complete the installation.

3. [Node.js](https://nodejs.org/en/)
   
   Install the latest version of Node.js.

## Running the program

run ```npm install``` to install all required node modules.

### Get Audio Track from Video
In order to successfully get the speech-to-text recoginition result from a video file, the user first needs to extract the audio track from the video file using ```extractAudio.js```.

Sample usage:

```
var tools = require("./extractAudio.js");
```

```
tools. extractAudio("./input.mp4", "./output.mp3");
```

The output.mp3 will be automatically saved in your current directory.

### Get Text Recognition from Audio
To get the text recoginition from the audio track, simply call the ```speechToText()``` function in the ```audioToText.js``` with your audio track file path as the parameter.

Sample usage:

```
speechToText("./audio.mp3");
```

## Future Work Needed

In order to accomplish the project, the future team needs to make the code keep searching all the video in the target directory and repeat the processing for each of videos to get the speech-to-text recognition.
