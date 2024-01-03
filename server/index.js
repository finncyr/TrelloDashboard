// server/index.js

// Includes
const express = require("express");
const path = require('path');
const Trello = require("trello");
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');
const cookieParser = require('cookie-parser');

// Configuartions
dotenv.config();
const PORT = process.env.PORT || 3001;
var trello = new Trello(process.env.POWER_UP_API_KEY, process.env.POWER_UP_TOKEN);
const app = express();

// ------------------------

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

// server Swagger-Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middlewares
app.use(express.json()); //JSON Parser for POST/PUT Requests
app.use(cookieParser()); //Cookie Parser for BoardID


// ---- ROUTES ----

app.post("/api/setboard", (req, res) => {
  // #swagger.description = 'Sets the boardid to be used for all other requests'
  /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'URL or BoardID of the Trello Board to be used',
            schema: {
                $url: 'https://trello.com/b/W3JXKZYD/test'
            }
    } */
  let regex = /https:\/\/trello\.com\/b\/[A-Za-z0-9]+\/[A-Za-z0-9]+/i;
  if(req.body['url'] != null && req.body['url'] != "" && regex.test(req.body['url'])) {
    var urljson = req.body['url'] + ".json";
    fetch(urljson)
      .then((trellores) => {
        console.log("Trello answered with: " + trellores.status);
        if(trellores.status == 200) {
          return trellores.json();
        }
        else {
          return null;
        }
      })
      .then((board) => {
        if (board == null) {
          res.status(404).send("Error: Board not found on Trello!");
          console.log("Board not found on Trello!");
          // #swagger.responses[404] = { description: 'Board not found on Trello' }
        }
        else if(board['id'] != null && board['id'] != "") {
          boardid = board['id'];
          res.cookie("boardid", board['id']).cookie("url", req.body['url']).send("Board ID changed to: " + board['id']);
          console.log("Session changed to: " + board['id']);
        }
      });
  }
  else if(!regex.test(req.body['url'])) {
    res.status(400).send("Error: Invalid URL!");
    console.log("Invalid URL!");
    // #swagger.responses[400] = { description: 'No matching URL provided' }
  }
  else {
    res.status(500).send("Case not handled!");
    console.log("Case not handled!");
    // #swagger.responses[500] = { description: 'Internal Server Error' }
  }
});

// ---- TITLE ----

app.get("/api/title", (req, res) => {
  /* 
   #swagger.description = 'Returns the title of the board'
   #swagger.responses[200] = {
            description: 'Title of the board as string',
            schema: "Example Board"
    } 
  */
  if (req.cookies.url == null) {
    res.json({ message: "" });
  }
  else {
    var URLsplit = req.cookies.url.split("/");
    res.json({ message: URLsplit[URLsplit.length - 1] });
  }
});

// ---- COUNTS ----

app.get("/api/counts/", async (req, res, next) => {
  const [alllists, cards] = await Promise.all([
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
  const infolistid = (alllists.filter((el) => el.name == "INFO"))[0]['id']; //get id of done list
  var counts = {
    alltasks: 0,
    closedtasks: 0,
    opentasks: 0
  };

  cards.forEach(el => {
    if((el['idList'] != infolistid && el['due'] != null)) { //ignore cards in info list
      counts.alltasks++;
      if(el['dueComplete']) { //ignore cards in info list & done cards
        counts.closedtasks++;
      }
    }
  });
  counts.opentasks = counts.alltasks - counts.closedtasks;
  res.json(counts);
});

app.get("/api/counts/opentasks", async (req, res, next) => {
  // #swagger.description = 'Returns the amount of all open tasks on the board'
  /* #swagger.responses[200] = {
            description: 'Amount of open tasks as integer',
            schema: 22
    } */
  const [alllists, cards] = await Promise.all([
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
  const infolistid = (alllists.filter((el) => el.name == "INFO"))[0]['id']; //get id of done list
  var opentasks = 0;
  cards.forEach(el => {
    if((el['idList'] != infolistid) && !el['dueComplete'] && el['due'] != null) { //ignore cards in info list & done cards
      opentasks++;
    }
  });
  res.json(opentasks);
});

app.get("/api/counts/closedtasks", async (req, res, next) => {
  // #swagger.description = 'Returns the amount of all closed tasks on the board'
  /* #swagger.responses[200] = {
            description: 'Amount of closed tasks as integer',
            schema: 11
    } */
  const [alllists, cards] = await Promise.all([
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
  const infolistid = (alllists.filter((el) => el.name == "INFO"))[0]['id']; //get id of done list
  var closedtasks = 0;
  cards.forEach(el => {
    if((el['idList'] != infolistid) && el['dueComplete'] && el['due'] != null) { //ignore cards in info list & done cards
      closedtasks++;
    }
  });
  res.json(closedtasks);
});

app.get("/api/counts/alltasks", async (req, res, next) => {
  // #swagger.description = 'Returns the amount of all tasks on the board'
  /* #swagger.responses[200] = {
            description: 'Amount of all tasks as integer',
            schema: 33
    } */
  const [alllists, cards] = await Promise.all([
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
  const infolistid = (alllists.filter((el) => el.name == "INFO"))[0]['id']; //get id of done list
  var alltasks = 0;
  cards.forEach(el => {
    if((el['idList'] != infolistid)) { //ignore cards in info list
      alltasks++;
    }
  });
  res.json(alltasks);
});

// ---- CARDS ----

app.get("/api/cards", (req, res, next) => {
  // #swagger.description = 'Returns all cards on the board'
  /* #swagger.responses[200] = {
            description: 'Array of all cards on the board',
            schema: [
                { $ref: '#/definitions/Card' }
            ]
    } */
  trello.getCardsOnBoard(req.cookies.boardid)
    .then((cards) => res.json(cards))
    .catch((err) => next(err));
});

app.get("/api/cards/:cardid", (req, res, next) => {
  // #swagger.description = 'Returns a specific card on the board'
  /* #swagger.responses[200] = {
            description: 'Specific card on the board',
            schema: { $ref: '#/definitions/Card' }
    } */
  trello.getCard(req.cookies.boardid, req.params.cardid)
    .then((card) => res.json(card))
    .catch((err) => next(err));
});

app.get("/api/cards/:cardid/duration", (req, res) => {
  // #swagger.description = 'Returns the duration of a specific card on the board in minutes'
  /* #swagger.responses[200] = {
            description: 'Duration of a specific card on the board in minutes',
            schema: 15
    } */
  trello.getLabelsForBoard(req.cookies.boardid)
  .then((durations) => {
    trello.getCard(req.cookies.boardid, req.params.cardid)
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

app.get("/api/cards/:cardid/due", (req, res) => {
  // #swagger.description = 'Returns the due time of a specific card on the board in ms since 1970-01-01'
  /* #swagger.responses[200] = {
            description: 'Due time of a specific card on the board in ms since 1970-01-01',
            schema: 1704380400000
    } */
  trello.getCard(req.cookies.boardid, req.params.cardid)
    .then((card) => {
      res.json(Date.parse(card['due']));
    })
    .catch((err) => next(err));
});


// Negative Values mean the card is overdue by that amount of milliseconds
app.get("/api/cards/:cardid/overdue", (req, res) => {
  // #swagger.description = 'Returns the overtime of a specific card on the board in ms. Negative Values mean the card is overdue by that amount of milliseconds. Positive Values mean the card is due in that amount of milliseconds'
  /* #swagger.responses[200] = {
            description: 'Overtime of a specific card on the board in ms',
            schema: 900000
    } */
  trello.getCard(req.cookies.boardid, req.params.cardid)
    .then((card) => {
      res.json((Date.parse(card['due']) - Date.now()));
    })
    .catch((err) => next(err));
});

app.get("/api/criticaltasks", async (req, res, next) => {
  // #swagger.description = 'Returns a list of all tasks marked with a "CRITICAL" label on the board'
  /* #swagger.responses[200] = {
            description: 'Array of all critical tasks on the board',
            schema: [
              { $ref: '#/definitions/Card' }
            ]
    } */
  const [alllists, cards] = await Promise.all([
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
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
});

app.get("/api/cards/:cardid/:value", (req, res, next) => {
  // #swagger.description = 'Returns a specific value of a card on the board'
  trello.getCard(req.cookies.boardid, req.params.cardid)
    .then((card) => res.json(card[req.params.value]))
    .catch((err) => next(err));
});

// ---- LISTS ----

app.get("/api/lists", (req, res, next) => {
  // #swagger.description = 'Returns all lists on the board'
  /* #swagger.responses[200] = {
            description: 'Array of all lists on the board',
            schema: [
              { $ref: '#/definitions/List' }
            ]
    } */
  trello.getListsOnBoard(req.cookies.boardid)
    .then((lists) => {
      res.json(lists);
    })
    .catch((err) => next(err));
});

app.get("/api/lists/:listid", async (req, res, next) => {
  // #swagger.description = 'Returns a specific list on the board'
  /* #swagger.responses[200] = {
            description: 'Specific list on the board',
            schema: { $ref: '#/definitions/List' }
    } */
  var listname = "";
  var countall = 0;
  var countclosed = 0;
  var listmembers = [];
  var criticaltask = 0;
  var criticalopen = 0;
  var overtimed = 0;
  const [lists, cards] = await Promise.all([
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnList(req.params.listid)
  ]).catch((err) => next(err));

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
    if(Date.parse(el['due']) - Date.now() < 0 && !el['dueComplete']) {
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
});

app.get("/api/lists/:listid/name", (req, res, next) => {
  // #swagger.description = 'Returns the name of a specific list on the board'
  /* #swagger.responses[200] = {
            description: 'Specific list name on the board as string',
            schema: "To Do"
    } */
  trello.getListsOnBoard(req.cookies.boardid)
    .then((lists) => {
      res.json(lists.filter(el => el['id'] == req.params.listid)[0]['name']);
    })
    .catch((err) => next(err));
});

app.get("/api/lists/:listid/countall", (req, res, next) => {
  // #swagger.description = 'Returns the amount of all cards on a specific list on the board'
  /* #swagger.responses[200] = {
            description: 'Amount of all cards on a specific list on the board as integer',
            schema: 8
    } */
  trello.getCardsOnList(req.params.listid)
    .then((cards) => {
      res.json(cards.length);
    })
    .catch((err) => next(err));
});

app.get("/api/lists/:listid/countclosed", (req, res, next) => {
  // #swagger.description = 'Returns the amount of all cards with a due marked as complete on a specific list on the board'
  /* #swagger.responses[200] = {
            description: 'Amount of all closed cards on a specific list on the board as integer',
            schema: 4
    } */
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
  // #swagger.description = 'Returns an array of all member id's on a specific list on the board'
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


app.get("/api/lists/:listid/overtimed", (req, res, next) => {
  // #swagger.description = 'Returns an array of all overtimed cards on a specific list on the board. Complete cards are included.'
  /* #swagger.responses[200] = {
            description: 'Array of all overtimed cards on a specific list on the board',
            schema: [
              { $ref: '#/definitions/Card' }
            ]
    } */
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

app.get("/api/lists/:listid/anyovertimed", (req, res, next) => {
  // #swagger.description = 'Returns true if any card on a specific list on the board is overtimed'
  /* #swagger.responses[200] = {
            description: 'True if any card on a specific list on the board is overtimed',
            schema: true
    } */
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

app.get("/api/lists/:listid/sv", async (req, res, next) => {
  // #swagger.description = 'Returns the summed Schedule Variance of a specific list on the board in minutes'
  /* #swagger.responses[200] = {
            description: 'Summed and rounded Schedule Variance of a specific list on the board in minutes',
            schema: 14
    } */
  const [durations, cards] = await Promise.all([
    trello.getLabelsForBoard(req.cookies.boardid), 
    trello.getCardsOnList(req.params.listid)
  ]).catch((err) => next(err));
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
});

app.get("/api/lists/:listid/:value", async (req, res, next) => {
  // #swagger.description = 'Tries to returns a specific value of a specific list on the board'
  trello.getListsOnBoard(req.cookies.boardid)
    .then((lists) => {
      const list = (lists.filter((el) => el.id == req.params.listid))[0]; //get requested list
      res.json(list[req.params.value]);
    })
    .catch((err) => next(err));
});


// ---- BOARD ----

app.get("/api/board/sv", async (req, res, next) => {
  // #swagger.description = 'Returns the average Schedule Variance per card of the whole board in remaining minutes'
  /* #swagger.responses[200] = {
            description: 'Average Schedule Variance per card of the whole board in rounded remaining minutes',
            schema: 16
    } */
  const [durations, alllists, cards] = await Promise.all([
    trello.getLabelsForBoard(req.cookies.boardid), 
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
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
  res.json(Math.round((sv/60000)/cards.length)); //return sv in minutes
});


app.get("/api/board/ru", async (req, res, next) => {
  // #swagger.description = 'Returns the summed Resource Utilization of the whole board in decimal notation'
  /* #swagger.responses[200] = {
            description: 'Decimal Resource Utilization of the whole board',
            schema: 0.85
    } */
  const [durations, alllists, members, cards] = await Promise.all([
    trello.getLabelsForBoard(req.cookies.boardid), 
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getBoardMembers(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
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
        timeplanned += parseInt(dur_label[0]['name']) * el['idMembers'].length;
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
});

app.get("/api/board/spi", async (req, res, next) => {
  // #swagger.description = 'Returns the summed Schedule Performance Index of the whole board in decimal notation'
  /* #swagger.responses[200] = {
            description: 'Decimal Schedule Performance Index of the whole board',
            schema: 0.90
    } */
  const [durations, alllists, cards] = await Promise.all([
    trello.getLabelsForBoard(req.cookies.boardid),
    trello.getListsOnBoard(req.cookies.boardid),
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));

  var donetime = 0;
  var timeplanned = 0;

  const infolistid = (alllists.filter((el) => el.name == "INFO"))[0]['id']; //get id of info list

  cards.forEach(card => {
    if ((Date.parse(card['due']) - Date.now()) <= 0 && //if card is due
      !card['name'].includes("TIMECARD") &&            //and not a timecard
      card['idList'] != infolistid) {                  //and not in info list
      var cardduaration = 0;
      for (var label of card['labels']) {
        const dur_label = durations.filter(function (duration) { //get duration of card by label
          return duration['id'] == label['id'];
        });
        cardduaration = parseInt(dur_label[0]['name']);
        break;
      }
      if (card['dueComplete']) { //if card is marked as done
        donetime += cardduaration;
      }
      timeplanned += cardduaration;
    }
  });
  res.json(donetime / timeplanned); //return spi (Efficiency)
});

// ---- MEMBERS ----

app.get("/api/members", async (req, res, next) => {
  // #swagger.description = 'Returns all compact array of all members on the board'
  /* #swagger.responses[200] = {
            description: 'Array of all members on the board in a compacted array',
            schema: [
                { $ref: '#/definitions/CompactMember' }
            ]
    } */
  const [durations, alllists, members, cards] = await Promise.all([
    trello.getLabelsForBoard(req.cookies.boardid), 
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getBoardMembers(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));

  const infolistid = (alllists.filter((el) => el.name == "INFO"))[0]['id'];
  var timemembers = [];

  members.forEach(el => {
    var availabletime = 0;
    var usedtime = 0;
    cards.forEach(card => {
      if(card['idMembers'].includes(el['id']) && card['name'].includes("TIMECARD")) {
        availabletime += parseInt(card['desc']);
      }
      if(card['idList'] != infolistid && !card['name'].includes("TIMECARD")){ //ignore cards in info list and timecards
        for(var label of card['labels']){
          const dur_label = durations.filter((duration) => duration['id'] == label['id']); //get duration of card by label
          const cardmembers = members.filter((member) => card['idMembers'].find((f) => f == member['id'])); //get members of card by id
          if(cardmembers.find(member => member['id'] == el['id'])) {
            usedtime += parseInt(dur_label[0]['name']);
          }
          break;
        }
      }
    });
    timemembers.push({id: el['id'], fullName: el['fullName'], username: el['username'], availabletime: availabletime, usedtime: usedtime});
  });
  res.json(timemembers);
});

app.get("/api/members/:memberid", (req, res, next) => {
  // #swagger.description = 'Returns a detailed specific member on the board'
  /* #swagger.responses[200] = {
            description: 'Detailed specific member on the board',
            schema: { $ref: '#/definitions/Member' }
    } */
  trello.getMember(req.params.memberid)
    .then((member) => {
      res.json(member);
    })
    .catch((err) => next(err));
});

app.get("/api/members/:memberid/availabletime", (req, res, next) => {
  // #swagger.description = 'Returns the available time of a specific member on the board'
  /* #swagger.responses[200] = {
            description: 'Available time of a specific member on the board in minutes',
            schema: 120
    } */
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

app.get("/api/members/:memberid/:value", (req, res, next) => {
  // #swagger.description = 'Returns a value of a specific member on the board'
  trello.getMember(req.params.memberid)
    .then((member) => {
      res.json(member[req.params.value]);
    })
    .catch((err) => next(err));
});

// ---- TIMEVALUES ----

app.get("/api/timecards", (req, res) => {
  // #swagger.description = 'Returns an array of all timecards on the board'
  /* #swagger.responses[200] = {
            description: 'Array of all cards including "TIMECARD" in their name on the board',
            schema: [ 
              { $ref: '#/definitions/Card' }
            ]
    } */
  trello.getCardsOnBoard(req.cookies.boardid)
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

app.get("/api/timeplanned", async (req, res, next) => {
  // #swagger.description = 'Returns the planned time (PV) of the whole board in minutes'
  /* #swagger.responses[200] = {
            description: 'Planned time (PV) of the whole board in rounded minutes',
            schema: 450
    } */
  const [durations, alllists, cards] = await Promise.all([
    trello.getLabelsForBoard(req.cookies.boardid), 
    trello.getListsOnBoard(req.cookies.boardid), 
    trello.getCardsOnBoard(req.cookies.boardid)
  ]).catch((err) => next(err));
  var plannedtime = 0;
  const infolistid = (alllists.filter((el) => el.name == "INFO"))[0]['id']; //get id of done list

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