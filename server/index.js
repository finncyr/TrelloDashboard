// server/index.js

const express = require("express");
const path = require('path');
const Trello = require("trello");
const dotenv = require('dotenv');

dotenv.config();
const PORT = process.env.PORT || 3001;

const URL = "https://trello.com/b/W3JXKZYD/test.json";
const boardid = "5f07168df739986764e3405c";

var trello = new Trello(process.env.POWER_UP_API_KEY, process.env.POWER_UP_TOKEN);

const app = express();

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Handle GET requests to /api route
app.get("/api/title", (req, res) => {
  res.json({ message: "SAMPLE PROJECT" });
});

app.get("/api/json", (req, res) => {
  res.redirect(URL);
});

// --- TESTING ---

app.get("/api/test/trello", (req, res) => {
  trello.getCardsOnBoard(boardid)
    .then((cards) => res.json(cards.length));
});

app.get("/api/test/alltasks", (req, res) => {
  fetch("https://api.trello.com/1/boards/" + boardid + "/cards?key=" + process.env.POWER_UP_API_KEY + "&token=" + process.env.POWER_UP_TOKEN)
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    }
  ).then((data) => res.json(data.length));
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

//------------------------
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});