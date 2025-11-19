var tools = require("./extractAudio.js");
const speech = require('@google-cloud/speech').v1p1beta1;
const fs = require('fs');

speechToText("./input.mp4");


async function speechToText(source){
// Creates a client
const client = new speech.SpeechClient();

const filename = source;
const model = 'video';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const config = {
  encoding: encoding,
  sampleRateHertz: sampleRateHertz,
  languageCode: languageCode,
  model: model,
};
const audio = {
  content: fs.readFileSync(filename).toString('base64'),
};

const request = {
  config: config,
  audio: audio,
};

// Detects speech in the audio file
const [response] = await client.recognize(request);
const transcription = response.results
  .map(result => result.alternatives[0].transcript)
  .join('\n');
console.log('Transcription: ', transcription);
}