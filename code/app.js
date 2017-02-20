var express = require('express')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var fs = require('fs');
var GoogleAuth = require('google-auth-library');
var auth = new GoogleAuth;
var obj = JSON.parse(fs.readFileSync('googlecredentials.pswd', 'utf8'));
var CLIENT_ID = obj['id'];
var CLIENT_SECRET = obj['secret'];
var client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "http://localhost:3000/");
var bodyParser = require("body-parser");
//Connection to mongodb
// Connection URL
var url = 'mongodb://localhost:27017/votacions';

// Use connect method to connect to the server and creates unique indexes
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  db.collection('users').createIndex( { "userId" : 1}, { unique: true} );
  db.collection('votes').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
  db.collection('askWithdrawal').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
  db.collection('askPrivate').createIndex( {"pollId" : 1, "userId" : 1}, { unique: true});
  console.log("Connected successfully to server");
  db.close();
});

//Creating the webserver
var app = express();

//making files in public served at /
app.use(express.static('public'))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  res.sendFile("index.html", options, function (err) {
   if (err) {
     next(err);
   } else {
     console.log('Sent:', fileName);
   }
 });
})

app.post('/getPolls', function (req, res) {
  var poll = {};
  poll['pollId'] = 254235;
  poll['pollName'] = "Bestie de la biSetmana";
  poll['pollOptions'] = ["Esteve", "Iñigo", "Arnau"];
  poll ['pollDeadline'] = 1487335573;
  poll['isPrivate'] = 0;
  poll['targetGroup'] = "members";
  var ret = [poll];
  res.json(ret);
})

app.post('/getPollsId', function (req, res) {
  var ret = [224,228,229];
  res.json(ret);
})

app.post('/getPollInfo', function (req, res) {
  var poll = {};
  poll['pollId'] = 254235;
  poll['pollName'] = "Bestie de la biSetmana";
  poll['pollOptions'] = ["Esteve", "Iñigo", "Arnau"];
  poll ["pollDeadline"] = 1487335573;
  poll['isPrivate'] = 0;
  poll['targetGroup'] = "members";
  var ret = poll;
  res.json(poll);
})

app.post('/sendVote', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/askWithdrawal', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/askPrivate', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/getResults', function (req, res) {
  var option = {};
  option['option'] = "Juanito";
  option['numberVotes'] = 25;
  option['autors'] = ["Quesito", "Berni", "Adolfo"];
  var ret = [option,option];
  res.json(ret);
})

app.post('/getMembership', function (req, res) {
  var ret = ["admin","full"];
  res.json(ret);
})

app.post('/createPoll', function (req, res) {
  var ret = {};
  ret['status'] = 0;
  res.json(ret);
})

app.post('/addMembership', function (req, res) {
  var ret = ["admin","full","member"];
  res.json(ret);
})

app.post('/revokeMembership', function (req, res) {
  var ret = ["full"];
  res.json(ret);
})


app.post('/tokensignin', function (req, res) {
  var token = req.body.idtoken;
  client.verifyIdToken(
    token,
    CLIENT_ID,
    function(e, login) {
      var payload = login.getPayload();
      MongoClient.connect(url, function(err, db) {
        var users = db.collection('users');
        var user = {};
        user['userId'] = payload['sub'];
        user['membership'] = ['all'];
        user['name'] = payload['name'];
        user['email'] = payload['email'];
        users.insertMany([user], function(err, result) {});
        db.close();
      });
    });
})

app.listen(3000, function () {
  console.log('App listening on port 3000!')
})