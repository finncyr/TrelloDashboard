// server/index.js

// Includes
const express = require("express");
const path = require('path');
const Trello = require("trello");
const dotenv = require('dotenv');
const { brotliCompress } = require("zlib");
const { toUSVString } = require("util");

// Configuartions
dotenv.config();
const PORT = process.env.PORT || 3001;
var trello = new Trello(process.env.POWER_UP_API_KEY, process.env.POWER_UP_TOKEN);
const app = express();

// Constants
const URL = "https://trello.com/b/W3JXKZYD/test";

// Global Variables
let boardid = "5f07168df739986764e3405c"; //global id of current trello board

// ------------------------


// -----------------------

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));


// TODO: Fix Handling, returns "undefined"
app.post("/api/setboard", (req, res) => {
  console.log(req.body);
  console.log(JSON.parse(req.body));
  res.json(req.body);
});

// Get title from Board-URL
//HACK: Only Works with full url, not short version
app.get("/api/title", (req, res) => {
  var URLsplit = URL.split("/");
  res.json({message: URLsplit[URLsplit.length - 1]});
});

// ---- COUNTS ----

// /api/counts/opentasks
app.get("/api/counts/opentasks", (req, res) => {
  trello.getListsOnBoard(boardid)
    .then((lists) => {
      const list = lists.filter(function(el){
        return el.name == "DONE";
      });

      trello.getCardsOnList(list[0]['id'])
        .then((cards) => {
          res.json(cards.length);
        });
    });
});

// Returns count of all tasks
app.get("/api/counts/alltasks", (req, res) => {
  trello.getCardsOnBoard(boardid)
    .then((cards) => res.json(cards.length));
});

// ---- CARDS ----

app.get("/api/cards", (req, res) => {
  trello.getCardsOnBoard(boardid)
    .then((cards) => res.json(cards));
});

app.get("/api/cards/:cardid", (req, res) => {
  trello.getCard(boardid, req.params.cardid)
    .then((card) => res.json(card));
});

// Returns the Duration of a Task in Minutes
app.get("/api/cards/:cardid/duration", (req, res) => {
  trello.getLabelsForBoard(boardid)
  .then((durations) => {
    trello.getCard(boardid, req.params.cardid)
    .then((card) => {
      for(var label of card['labels']){
        const dur_label = durations.filter(function (duration) {
          return duration['id'] == label['id'];
        });
        res.json(parseInt(dur_label[0]['name']));
      }
    });
  });
});

// ---- METRICS ----

app.get("/api/metrics/spi", (req, res) => {
  //TODO SPI Metric
});

app.get("/api/metrics/sv", (req, res) => {
  //TODO SV Metric
});

app.get("/api/metrics/ru", (req, res) => {
  //TODO RU Metric
});

// ---- TESTING ----

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

// --------------------

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Listen Routine
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});