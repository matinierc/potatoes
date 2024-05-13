const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const multer = require("multer");
const { writeFileSync } = require('fs');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});

const upload = multer({ storage });

const port = 5001;

dotenv.config();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/save", upload.any("file"), (req, res) => {
  res.send({ message: "Successfully uploaded files" });
});

app.post("/saveTracks", (req, res) => {
  console.log('>>> req', req.body);
  try {
    writeFileSync('./config/tracks.json', JSON.stringify(req.body, null, 2), 'utf8');
    console.log('Data successfully saved to disk');
    res.send({ message: "Successfully save tracks" });
  } catch (error) {
    console.log('An error has occurred ', error);
    res.send({ message: "An error has occurre" });
  }
});

app.get("/tracks", upload.any("file"), (req, res) => {
  res.send({ message: "Successfully uploaded files" });
});


app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
