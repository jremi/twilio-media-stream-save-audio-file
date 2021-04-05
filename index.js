const { openSync, writeSync, createWriteStream } = require("fs");

class TwilioMediaStreamSaveAudioFile {
  constructor(options) {
    this.saveLocation = options.saveLocation || __dirname;
    this.saveFilename = options.saveFilename || Date.now();
    this.onSaved = options.onSaved || null;
    this.websocket = null;
  }

  get filename() {
    return `${this.saveFilename}.wav`;
  }

  get writeStreamPath() {
    return `${this.saveLocation}/${this.filename}`;
  }

  setWebsocket(websocket) {
    this.websocket = websocket;
  }

  twilioStreamStart() {
    this.websocket.wstream = createWriteStream(this.writeStreamPath, {
      encoding: "binary",
    });
    // This is a mu-law header for a WAV-file compatible with twilio format
    this.websocket.wstream.write(
      Buffer.from([
        0x52,
        0x49,
        0x46,
        0x46,
        0x62,
        0xb8,
        0x00,
        0x00,
        0x57,
        0x41,
        0x56,
        0x45,
        0x66,
        0x6d,
        0x74,
        0x20,
        0x12,
        0x00,
        0x00,
        0x00,
        0x07,
        0x00,
        0x01,
        0x00,
        0x40,
        0x1f,
        0x00,
        0x00,
        0x80,
        0x3e,
        0x00,
        0x00,
        0x02,
        0x00,
        0x04,
        0x00,
        0x00,
        0x00,
        0x66,
        0x61,
        0x63,
        0x74,
        0x04,
        0x00,
        0x00,
        0x00,
        0xc5,
        0x5b,
        0x00,
        0x00,
        0x64,
        0x61,
        0x74,
        0x61,
        0x00,
        0x00,
        0x00,
        0x00, // Those last 4 bytes are the data length
      ])
    );
  }

  twilioStreamMedia(mediaPayload) {
    // decode the base64-encoded data and write to stream
    this.websocket.wstream.write(Buffer.from(mediaPayload, "base64"));
  }

  twilioStreamStop() {
    // Now the only thing missing is to write the number of data bytes in the header
    this.websocket.wstream.write("", () => {
      let fd = openSync(this.websocket.wstream.path, "r+"); // `r+` mode is needed in order to write to arbitrary position
      let count = this.websocket.wstream.bytesWritten;
      count -= 58; // The header itself is 58 bytes long and we only want the data byte length
      writeSync(
        fd,
        Buffer.from([
          count % 256,
          (count >> 8) % 256,
          (count >> 16) % 256,
          (count >> 24) % 256,
        ]),
        0,
        4, // Write 4 bytes
        54 // starts writing at byte 54 in the file
      );
      if (this.onSaved) {
        this.onSaved();
      }
    });
  }
}

module.exports = TwilioMediaStreamSaveAudioFile;
