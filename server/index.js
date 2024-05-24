const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const { writeFileSync, readFileSync, createWriteStream, existsSync } = require("fs");
// const { exec } = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const OUTPUT_DIR = "./output";
const UPLOADS_DIR = `${OUTPUT_DIR}/uploads`;
const CONVERTED_DIR = `${OUTPUT_DIR}/converted`;
const TMP_CONVERTED_DIR = `${CONVERTED_DIR}/tmp`;
const port = 5001;

ffmpeg.setFfmpegPath(ffmpegStatic);

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
});

const upload = multer({ storage });

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// utils
const fixSpaces = (value) => {
  if (value.includes(" ")) {
    return `${value} `;
  }
  return value;
};

const convertToMp3 = async (track) => {
  const input = `${UPLOADS_DIR}/${track.file}`;
  const mp3FileName = `${CONVERTED_DIR}/${track.artist} - ${track.name}.mp3`;
  const tmpMp3FileName = `${TMP_CONVERTED_DIR}/${track.id}.mp3`;
  const outStream = createWriteStream(tmpMp3FileName);

  if (!existsSync(mp3FileName)) {
    console.log('>>> convert', mp3FileName);
    await ffmpeg()
    .input(input)
    .outputOptions('-id3v2_version', '3')
    .outputOptions('-metadata', `artist=${fixSpaces(track.artist)}`)
    .outputOptions('-metadata', `title=${fixSpaces(track.name)}`)
    .outputOptions('-metadata', `album=${fixSpaces(track.album)}`)
    .outputOptions('-metadata', `date=${fixSpaces(track.date)}`)
    .outputOptions('-b:a', '128k')
    .audioCodec("libmp3lame")
    .outputFormat('mp3')
    .on("error", (error) => console.log(`Encoding Error for ${input}`, error))
    .on("end", () => {
      exec(`ffmpeg -y -i ${tmpMp3FileName} -i ${track.imageUrl} -c copy -map 0 -map 1 "${mp3FileName}"`, {cwd: './'});
      console.log(`${tmpMp3FileName} tagged on ${mp3FileName}`);
    })
    .saveToFile(outStream, { end: true });
  }
};

// actions
app.get("/convertTracks", (req, res) => {
  try {
    const tracks = JSON.parse(readFileSync("./config/tracks.json", {
      encoding: "utf8",
      flag: "r",
    }));

    (tracks || []).forEach(async (track) => {
      if (track.file) {
        await convertToMp3(track);
      }
    });

    res.send({ message: "Successfully convert" });
  } catch (error) {
    console.log("An error has occurred ", error);
    res.send({ message: "An error has occurre" });
  }
});

app.get("/deleteTemps", (req, res) => {
  try {
    const tracks = JSON.parse(readFileSync("./config/tracks.json", {
      encoding: "utf8",
      flag: "r",
    }));

    (tracks || []).forEach(async (track) => {
      if (track.file) {
        exec(`rm ${TMP_CONVERTED_DIR}/${track.id}.mp3`, {cwd: './'});
      }
    });

    res.send({ message: "Successfully clean" });
  } catch (error) {
    console.log("An error has occurred ", error);
    res.send({ message: "An error has occurre" });
  }
});

app.get("/check", (req, res) => {
  try {
    let tracks = JSON.parse(readFileSync("./config/tracks.json", {
      encoding: "utf8",
      flag: "r",
    }));
    const tracksToUpdate = [];

    tracks.forEach(async (track) => {
      if (track.status === 'PENDING') {
        if (existsSync(`${UPLOADS_DIR}/${track.id}.ogg`)) {
          tracksToUpdate.push({
            ...track,
            status: 'SUCCESS',
            file: `${track.id}.ogg`,
          });
        }
      }
      return track;
    });

    tracks = tracks.map((track) => {
      const trackToUpdate = tracksToUpdate.find(({ id }) => id === track.id);
      if (trackToUpdate) {
        return {
          ...trackToUpdate,
        }
      }
      return {
        ...track
      }
    });

    console.log(tracks);
    writeFileSync(
      "./config/tracks.json",
      JSON.stringify(tracks, null, 2),
      "utf8"
    );

    res.send(tracksToUpdate);
  } catch (error) {
    console.log("An error has occurred ", error);
    res.send({ message: "An error has occurre" });
  }
});

app.post("/saveOriginalTrack", upload.any("file"), async (req, res) => {
  // const { track } = JSON.parse(req.body.data);
  try {
    // const fileName = await convertToMp3(
    //   track,
    //   `${req.files[0].destination}/${req.files[0].originalname}`
    // );
    res.send({ status: 'SAVED' });
  } catch (error) {
    res.send({ message: "Error", error });
  }
});

app.post("/saveTracks", (req, res) => {
  try {
    writeFileSync(
      "./config/tracks.json",
      JSON.stringify(req.body, null, 2),
      "utf8"
    );
    console.log("Data successfully saved to disk");
    res.send({ message: "Successfully save tracks" });
  } catch (error) {
    console.log("An error has occurred ", error);
    res.send({ message: "An error has occurre" });
  }
});

app.get("/tracks", upload.any("file"), (req, res) => {
  const data = readFileSync("./config/tracks.json", {
    encoding: "utf8",
    flag: "r",
  });
  res.send(data);
});

app.get("/credentials", upload.any("file"), (req, res) => {
  res.send({
    clientId,
    clientSecret,
  });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
