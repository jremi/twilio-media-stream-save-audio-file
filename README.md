<h1 align="center">
  <img src="https://cdn.iconscout.com/icon/free/png-256/twilio-1-285957.png" />
  <br>
  Welcome to Twilio Media Stream Save Audio File<br>(For Node.js) 👋
</h1>

[![NPM](https://nodei.co/npm/twilio-media-stream-save-audio-file.png)](https://npmjs.org/package/twilio-media-stream-save-audio-file)

<p>
  <img alt="Node.js CI" src="https://github.com/jremi/twilio-media-stream-save-audio-file/workflows/Node.js%20CI/badge.svg?branch=main">
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.4-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: UNLICENSED" src="https://img.shields.io/badge/License-UNLICENSED-yellow.svg" />
  </a>
</p>

> Twilio Media Stream Save Audio File

This codebase provides a simple Node.js library class that makes it easy to save Twilio media streams to a local audio file in wav format.

## Purpose

I was playing around with the Twilio Media Streams and wanted to easily save the phone call to a local wav file after the call completed. I did a quick Google search and found someone on StackOverflow (Inspired by user @tdeo: https://stackoverflow.com/questions/58439005/is-there-any-way-to-save-mulaw-audio-stream-from-twilio-in-a-file) who had provided code snippet for writing a Mulaw header for a WAV-file compatible with twilio format. 

To make this a bit simpler I have taken this code snippet and converted it into a Node.js (CommonJS) class library for easier usage. 

If you need to save a Twilio Media Stream phone call to a local audio file when the call completes then this library should help you.

## Example Usage

```javascript

const TwilioMediaStreamSaveAudioFile = require("twilio-media-stream-save-audio-file");

const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
  saveLocation: __dirname,
  saveFilename: "my-twilio-media-stream-output",
  onSaved: () => console.log("File was saved!"),
});

wss.on("connection", (ws) => {
  console.log("New connection initiated!");

  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    switch (msg.event) {
      case "connected":
        console.log("A new call has connected");
        break;
      case "start":
        console.log(`Starting media stream...`);
        mediaStreamSaver.twilioStreamStart();
        break;
      case "media":
        console.log("Receiving audio...");
        mediaStreamSaver.twilioStreamMedia(msg.media.payload);
        break;
      case "stop":
        console.log("Call has ended");
        mediaStreamSaver.twilioStreamStop();
        break;
      default:
        break;
    }
  });
});

```

## Options

When you instantiate the library you can pass in the following options. They are not required and all optional.

- `saveLocation` - **(Optional)** Defaults to the local dir using `__dirname`. You can set any path you wish. Make sure path exists.

- `saveFilename` - **(Optional)** Defaults to the current date timestamp using `Date.now()`. You can set any filename you wish.

- `onSaved` - **(Optional)** This is a optional callback function that you can provide if you want to be notified when the audio wav file has been saved.

## Notes

- Inside the connected websocket `message` event make sure to call each of the corresponding methods for the incoming Twilio Media Stream message events: 

  ### Twilio Media Stream Message Event: `start` 
  - ` mediaStreamSaver.twilioStreamStart()`

  ### Twilio Media Stream Message Event: `media`
  - `mediaStreamSaver.twilioStreamMedia(twilioMediaPayload)`

  ### Twilio Media Stream Message Event: `stop`
  - `mediaStreamSaver.twilioStreamStop()`

For getting started on how Twilio media streams work, check out [Twilio](https://www.twilio.com/media-streams).

## Author

👤 **Jremi <jremi@jzbg.dev>**

* Website: http://stackoverflow.com/users/1062503/jremi
* Github: [@jremi](https://github.com/jremi)

***
_Made with ❤️ in San Diego_
