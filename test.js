const assert = require('assert');
const fs = require('fs');
const readline = require('readline');
const TwilioMediaStreamSaveAudioFile = require('.');

describe('TwilioMediaStreamSaveAudioFile', () => {
  it('saves a twilio media stream to a local audio file in wav format', async () => {
    const rl = readline.createInterface({
      input: fs.createReadStream(`${__dirname}/fixtures/hello-world.txt`),
    });

    const mediaStreamSaver = new TwilioMediaStreamSaveAudioFile({
      saveLocation: __dirname,
      saveFilename: "my-twilio-media-stream-output",
      onSaved: () => console.log("File was saved!"),
    });

    for await (const line of rl) {
      const msg = JSON.parse(line);
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
    }

    const { filename, writeStreamPath } = mediaStreamSaver;

    const stats = await fs.promises.stat(filename);
    assert.equal(stats.size, 58138);

    await fs.promises.unlink(writeStreamPath);
  });
});
