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
  .then((alllists) => {
    trello.getCardsOnBoard(boardid)
      .then((cards) => {
        const infolist = alllists.filter(function(el){
          return el.name == "INFO";
        });
        const infolistid = infolist[0]['id']; //get id of done list
        var opentasks = 0;
        cards.forEach(el => {
          if((el['idList'] != infolistid) && !el['dueComplete'] && el['due'] != null) { //ignore cards in info list & done cards
            opentasks++;
          }
        });
        res.json(opentasks);
      })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

app.get("/api/counts/closedtasks", (req, res, next) => {
  trello.getListsOnBoard(boardid)
  .then((alllists) => {
    trello.getCardsOnBoard(boardid)
      .then((cards) => {
        const infolist = alllists.filter(function(el){
          return el.name == "INFO";
        });
        const infolistid = infolist[0]['id']; //get id of done list
        var closedtasks = 0;
        cards.forEach(el => {
          if((el['idList'] != infolistid) && el['dueComplete'] && el['due'] != null) { //ignore cards in info list & done cards
            closedtasks++;
          }
        });
        res.json(closedtasks);
      })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// Returns count of all tasks
app.get("/api/counts/alltasks", (req, res, next) => {
  trello.getListsOnBoard(boardid)
  .then((alllists) => {
    trello.getCardsOnBoard(boardid)
      .then((cards) => {
        const infolist = alllists.filter(function(el){
          return el.name == "INFO";
        });
        const infolistid = infolist[0]['id']; //get id of done list
        var alltasks = 0;
        cards.forEach(el => {
          if((el['idList'] != infolistid)) { //ignore cards in info list
            alltasks++;
          }
        });
        res.json(alltasks);
      })
      .catch((err) => next(err));
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

// Returns all critical tasks
app.get("/api/criticaltasks", (req, res, next) => {
  trello.getCardsOnBoard(boardid)
    .then((cards) => {
      trello.getListsOnBoard(boardid)
        .then((alllists) => {
        var criticaltasks = [];

        cards.forEach(el => {
          el['labels'].forEach(label => {
            if(label['name'] == "CRITICAL") {
              var listname = "";
              alllists.filter(function(list){
                if(list['id'] == el['idList']) {
                  listname = list['name'];
                }
              });
              criticaltasks.push({
                id: el['id'], 
                name: el['name'], 
                listname: listname, 
                due: el['due'],
                dueComplete: el['dueComplete'],
                assignees: el['idMembers']
              });
            }
          });
        });
        res.json(criticaltasks);
      })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// ---- LISTS ----

app.get("/api/lists", (req, res, next) => {
  trello.getListsOnBoard(boardid)
    .then((lists) => {
      res.json(lists);
    })
    .catch((err) => next(err));
});

app.get("/api/lists/:listid", (req, res, next) => {
  var listname = "";
  var countall = 0;
  var countclosed = 0;
  var listmembers = [];
  var criticaltask = 0;
  var criticalopen = 0;
  var overtimed = 0;

  trello.getListsOnBoard(boardid)
  .then((lists) => {
      trello.getCardsOnList(req.params.listid)
      .then((cards) => {
        countall = cards.length;
        const list = lists.filter(function(el){
          return el['id'] == req.params.listid;
        });
        listname = list[0]['name'];
        var members = [];
        cards.forEach(el => {
          if(el['dueComplete']) {
            countclosed++;
          }
          if(Date.parse(el['due']) - Date.now() < 0) {
            overtimed++;
          }
          members = members.concat(el['idMembers']);
          el['labels'].forEach(label => {
            if(label['name'] == "CRITICAL") {
              criticaltask++;
              if(!el['dueComplete']) {
                criticalopen++;
              }
            }
          });
        });
        listmembers = [...new Set(members)];

        res.json({
          id: req.params.listid, 
          name: listname, 
          allcards: countall, 
          closedcards: countclosed, 
          listmembers: listmembers, 
          criticaltask: criticaltask, 
          criticalopen: criticalopen,
          overtimed: overtimed
        });
    })
    .catch((err) => next(err));
  })
  .catch((err) => next(err));
});

app.get("/api/lists/:listid/name", (req, res, next) => {
  trello.getListsOnBoard(boardid)
    .then((lists) => {
      const list = lists.filter(function(el){
        return el['id'] == req.params.listid;
      });
      res.json(list[0]['name']);
    })
    .catch((err) => next(err));
});

app.get("/api/lists/:listid/countall", (req, res, next) => {
  trello.getCardsOnList(req.params.listid)
    .then((cards) => {
      res.json(cards.length);
    })
    .catch((err) => next(err));
});

app.get("/api/lists/:listid/countclosed", (req, res, next) => {
  trello.getCardsOnList(req.params.listid)
    .then((cards) => {
      var closed = 0;
      cards.forEach(el => {
        if(el['dueComplete']) {
          closed++;
        }
      });
      res.json(closed);
    })
    .catch((err) => next(err));
});

app.get("/api/lists/:listid/members", (req, res, next) => {
  trello.getCardsOnList(req.params.listid)
    .then((cards) => {
      var members = [];
      cards.forEach(el => {
          members = members.concat(el['idMembers']);
      });
      res.json([...new Set(members)]);
    })
    .catch((err) => next(err));
});


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
app.get("/api/board/sv", (req, res, next) => {
  trello.getLabelsForBoard(boardid)  //load all required data
  .then((durations) => {
    trello.getListsOnBoard(boardid)
    .then((alllists) => {
      trello.getCardsOnBoard(boardid)
        .then((cards) => {
          var sv = 0;
          const infolist = alllists.filter(function(el){
            return el.name == "INFO";
          });
          const infolistid = infolist[0]['id']; //get id of info list
          cards.forEach(el => {
            if(el['idList'] != infolistid && !el['dueComplete'] && el['due'] != null){ //ignore cards in info list and done cards
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

// Returns the summed Resource Utilization of the whole board in decimal notation
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
            const infolist = alllists.filter(function(el){
              return el.name == "INFO";
            });
            const infolistid = infolist[0]['id']; //get id of info list
            var timeplanned = 0;
            var timeavailable = 0;
            cards.forEach(el => {
              if(el['idList'] != infolistid && !el['dueComplete'] && el['due'] != null){ //ignore cards in info list and done cards
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

// Returns the summed Schedule Performance Index of the whole board in decimal notation
app.get("/api/board/spi", (req, res, next) => {
  trello.getLabelsForBoard(boardid)  //load all required data
  .then((durations) => {
    trello.getListsOnBoard(boardid)
    .then((alllists) => {
      trello.getCardsOnBoard(boardid)
        .then((cards) => {
          var donetime = 0;
          var timeplanned = 0;

          const infolist = alllists.filter(function(el){
            return el.name == "INFO";
          });
          const infolistid = infolist[0]['id']; //get id of done list

          cards.forEach(card => {
            if((Date.parse(card['due']) - Date.now()) <= 0 && !card['name'].includes("TIMECARD") && card['idList'] != infolistid){ //if card is due and not a timecard
              var cardduaration = 0;
              for(var label of card['labels']){
                const dur_label = durations.filter(function (duration) { //get duration of card by label
                  return duration['id'] == label['id'];
                });
                cardduaration = parseInt(dur_label[0]['name']);
                break;
              }
              if(card['dueComplete']){ //if card is done
                donetime += cardduaration;
              }
              timeplanned += cardduaration;
            }
          });
          res.json(donetime / timeplanned); //return spi (Efficiency)
        })
        .catch((err) => next(err));
      })
      .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

// ---- MEMBERS ----

app.get("/api/members", (req, res, next) => {
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
          const infolist = alllists.filter(function(el){
            return el.name == "INFO";
          });
          const infolistid = infolist[0]['id']; //get id of done list
          cards.forEach(el => {
            if(el['idList'] != infolistid && !el['name'].includes("TIMECARD") && !el['dueComplete'] && el['due'] != null){ //ignore cards in info list and done cards
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