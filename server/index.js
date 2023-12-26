// server/index.js

// Includes
const express = require("express");
const path = require('path');
const Trello = require("trello");
const dotenv = require('dotenv');
const { brotliCompress } = require("zlib");
const { toUSVString } = require("util");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

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

// server Swagger-Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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
app.get("/api/counts/opentasks", (req, res, next) => {
  trello.getListsOnBoard(boardid)
    .then((lists) => {
      const list = lists.filter(function(el){
        return el.name == "DONE";
      });
      trello.getCardsOnList(list[0]['id'])
        .then((cards) => {
          var opentasks = 0;
          cards.forEach(el => {
            if(!(el['name'].includes("TIMECARD"))) {
              opentasks++;
            }
          });
          res.json(opentasks);
        });
    });
});

// Returns count of all tasks
app.get("/api/counts/alltasks", (req, res, next) => {
  trello.getCardsOnBoard(boardid)
    .then((cards) => {
      var alltasks = 0;
      cards.forEach(el => {
        if(!(el['name'].includes("TIMECARD"))) {
          alltasks++;
        }
      });
      res.json(alltasks);
    })
    .catch((err) => next(err));
});

// ---- CARDS ----

app.get("/api/cards", (req, res) => {
  trello.getCardsOnBoard(boardid)
    .then((cards) => res.json(cards))
    .catch((err) => next(err));
});

app.get("/api/cards/:cardid", (req, res, next) => {
  trello.getCard(boardid, req.params.cardid)
    .then((card) => res.json(card))
    .catch((err) => next(err));
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
    })
    .catch((err) => next(err));
  })
  .catch((err) => next(err));
});

// Returns the due time of a card in UNIX-Timecode
app.get("/api/cards/:cardid/due", (req, res) => {
  trello.getCard(boardid, req.params.cardid)
    .then((card) => {
      res.json(Date.parse(card['due']));
    })
    .catch((err) => next(err));
});

// Returns the overtime of a card in UNIX-Timecode
// Negative Values mean the card is overdue by that amount of milliseconds
app.get("/api/cards/:cardid/overdue", (req, res) => {
  trello.getCard(boardid, req.params.cardid)
    .then((card) => {
      res.json((Date.parse(card['due']) - Date.now()));
    })
    .catch((err) => next(err));
});

// ---- LISTS ----

// Returns all overtimed cards on a list
app.get("/api/lists/:listid/overtimed", (req, res) => {
  trello.getCardsOnList(req.params.listid)
    .then((cards) => {
      var overtimed = [];
      cards.forEach(el => {
        if(Date.parse(el['due']) < Date.now()) {
          overtimed.push(el);
        }
      });
      res.json(overtimed);
    })
    .catch((err) => next(err));
});

// Returns true if any card on a list is overtimed
app.get("/api/lists/:listid/anyovertimed", (req, res) => {
  trello.getCardsOnList(req.params.listid)
    .then((cards) => {
      var overtimed = false;
      cards.forEach(el => {
        if(Date.parse(el['due']) < Date.now()) {
          overtimed = true;
        }
      });
      res.json(overtimed);
    })
    .catch((err) => next(err));
});

// Returns the summed Schedule Variance of a list in minutes
app.get("/api/lists/:listid/sv", (req, res) => {
  trello.getLabelsForBoard(boardid)
  .then((durations) => {
    trello.getCardsOnList(req.params.listid)
      .then((cards) => {
        var sv = 0;
        cards.forEach(el => {
          var cardduaration = 0;
          for(var label of el['labels']){
            const dur_label = durations.filter(function (duration) {
              return duration['id'] == label['id'];
            });
            cardduaration = parseInt(dur_label[0]['name']);
            break;
          }
          sv += (Date.parse(el['due']) - cardduaration * 60000) - Date.now();
        });
        res.json(Math.round(sv/60000));
      })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// ---- BOARD ----

// Returns the summed Schedule Variance of the whole board in minutes
app.get("/api/board/sv", (req, res) => {
  trello.getLabelsForBoard(boardid)  //load all required data
  .then((durations) => {
    trello.getListsOnBoard(boardid)
    .then((alllists) => {
      trello.getCardsOnBoard(boardid)
        .then((cards) => {
          var sv = 0;
          const donelist = alllists.filter(function(el){
            return el.name == "DONE";
          });
          const donelistid = donelist[0]['id']; //get id of done list
          cards.forEach(el => {
            if(el['idList'] != donelistid){ //ignore cards in done list
              var cardduaration = 0;
              for(var label of el['labels']){
                const dur_label = durations.filter(function (duration) { //get duration of card by label
                  return duration['id'] == label['id'];
                });
                cardduaration = parseInt(dur_label[0]['name']);
                break;
              }
              sv += (Date.parse(el['due']) - cardduaration * 60000) - Date.now(); //calculate sv
            }
          });
          res.json(Math.round(sv/60000)); //return sv in minutes
        })
        .catch((err) => next(err));
      })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

app.get("/api/board/ru", (req, res, next) => {
  trello.getLabelsForBoard(boardid)  //load all required data
  .then((durations) => {
    trello.getListsOnBoard(boardid)
    .then((alllists) => {
      trello.getBoardMembers(boardid)
      .then((members) => {
        trello.getCardsOnBoard(boardid)
          .then((cards) => {
            var ru = 0;
            const donelist = alllists.filter(function(el){
              return el.name == "DONE";
            });
            const donelistid = donelist[0]['id']; //get id of done list
            var timeplanned = 0;
            var timeavailable = 0;
            cards.forEach(el => {
              if(el['idList'] != donelistid){ //ignore cards in done list
                for(var label of el['labels']){
                  const dur_label = durations.filter(function (duration) { //get duration of card by label
                    return duration['id'] == label['id'];
                  });
                  timeplanned += parseInt(dur_label[0]['name']);
                  break;
                }
              }
              else if(el['name'].includes("TIMECARD")) {
                members.forEach(member => {
                  if(el['idMembers'].includes(member['id'])) {
                    timeavailable += parseInt(el['desc']);
                  }
                });
              }
            });
            res.json(timeplanned / timeavailable); //return ru in percent
          })
          .catch((err) => next(err));
        })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
  })
  .catch((err) => next(err));
});

//TODO: Implement SPI Metric

// ---- MEMBERS ----

app.get("/api/members", (req, res, next) => {
  trello.getBoardMembers(boardid)
    .then((members) => {
      res.json(members);
    })
    .catch((err) => next(err));
});

app.get("/api/members/:memberid", (req, res, next) => {
  trello.getMember(req.params.memberid)
    .then((member) => {
      res.json(member);
    })
    .catch((err) => next(err));
});

app.get("/api/members/:memberid/availabletime", (req, res, next) => {
  trello.getMemberCards(req.params.memberid)
    .then((cards) => {
      var availabletime = 0;
      cards.forEach(el => {
        if(el['name'].includes("TIMECARD")) {
          availabletime += parseInt(el['desc']);
        }
      });
      res.json(availabletime);
    })
    .catch((err) => next(err));
});

// ---- TIMEVALUES ----

app.get("/api/timemembers", (req, res, next) => {
  trello.getBoardMembers(boardid)
  .then((members) => {
    trello.getCardsOnBoard(boardid)
    .then((cards) => {
      var timecards = [];
      cards.forEach(el => {
        if(el['name'].includes("TIMECARD")) {
          timecards.push(el);
        }
      });
      var timemembers = [];
      members.forEach(el => {
        var availabletime = 0;
        timecards.forEach(card => {
          if(card['idMembers'].includes(el['id'])) {
            availabletime += parseInt(card['desc']);
          }
        });
        timemembers.push({id: el['id'], fullName: el['fullName'], username: el['username'], availabletime: availabletime});
      });
      res.json(timemembers);
    })
    .catch((err) => next(err));
  })
  .catch((err) => next(err));
});

// Returns an array of all timecards
app.get("/api/timecards", (req, res) => {
  trello.getCardsOnBoard(boardid)
    .then((cards) => {
      var timecards = [];
      cards.forEach(el => {
        if(el['name'].includes("TIMECARD")) {
          timecards.push(el);
        }
      });
      res.json(timecards);
    });
});

app.get("/api/timeplanned", (req, res, next) => {
  trello.getLabelsForBoard(boardid)  //load all required data
  .then((durations) => {
    trello.getListsOnBoard(boardid)
    .then((alllists) => {
      trello.getCardsOnBoard(boardid)
        .then((cards) => {
          var plannedtime = 0;
          const donelist = alllists.filter(function(el){
            return el.name == "DONE";
          });
          const donelistid = donelist[0]['id']; //get id of done list
          cards.forEach(el => {
            if(el['idList'] != donelistid && !el['name'].includes("TIMECARD")){ //ignore cards in done list
              var cardduaration = 0;
              for(var label of el['labels']){
                const dur_label = durations.filter(function (duration) { //get duration of card by label
                  return duration['id'] == label['id'];
                });
                cardduaration = parseInt(dur_label[0]['name']);
                break;
              }
              plannedtime += cardduaration; 
            }
          });
          res.json(plannedtime); //return planned time in minutes
        })
        .catch((err) => next(err));
      })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
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