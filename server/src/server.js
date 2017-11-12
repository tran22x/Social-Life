var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var url = require("url");
var fs = require('fs');
var path = require("path");
var app = express();
// var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_IVORY_URI || process.env.MONGOHQ_URL || 'mongodb://trailer-nailer.herokuapp.com/movies';
var mongoUri = process.env.MONGODB_URI || process.env.MONGOLAB_IVORY_URI || process.env.MONGOHQ_URL || 'mongodb://localhost';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
  db = databaseConnection;
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var urlencodedParser = bodyParser.urlencoded({ extended: true })

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.set('Content-Type', 'text/html');
  //TODO: ask Olive for shit
  response.sendFile(__dirname + '/index.html');
});

app.get('/create', function(request, response) {
  response.set('Content-Type', 'text/html');
  response.sendFile(__dirname + '/EventForm.html');
});

app.get('/css/style.css', function(request, response) {
  response.set('Content-Type', 'text/css');
  response.sendFile(__dirname + '/css/style.css');
});

app.get('/css/__codepen_io_andytran_pen.css', function(request, response) {
  response.set('Content-Type', 'text/css');
  response.sendFile(__dirname + '/css/__codepen_io_andytran_pen.css');
});

//TODO: event-page/????
app.get('/event-page', function(request, response) {
  //TODO: request has to be id - check with Olive
  var id = request.query.id;
  if (id == undefined || id == '') {
    db.collection('events', function(er, col) {
      if (er) {
        response.sendStatus(500);
      } else {
        col.find().toArray(function(error, result) {
          if (error) {
            response.sendStatus(500);
          } else {
            response.send(result);
          }
        });
      }
    });
  } else {
    db.collection('events', function(er, col) {
      if (er) {
        response.sendStatus(500);
      } else {
        col.find({"id": id}).toArray(function(error, result) {
          if (error) {
            response.sendStatus(500);
          } else {
            if (result.length > 0) {
              response.send(result);
            } else {
              col.find({}).toArray(function(e,r) {
                if (e) {
                  response.sendStatus(500);
                } else {
                  response.send(r);
                }
              });
            }
          }
        })
      }
    });
  }
});

app.post('/testdb', function(request, response) {
  var name = request.body.name;
  console.log(name);
  toInsert = {"name":name};
  db.collection('test', function(err, col) {
    if (err) {
      response.send(500);
    } else {
      col.insert(toInsert, function(error, saved) {
        if (error) {
          response.send(500);
        } else {
          response.send(200);
        }
      });
    }
  });
});

app.post('/add-event', function(request, response) {
  console.log("POST /add-event");
  var query = request.body;
  if (typeof query['name'] == undefined || typeof query['organizer'] == undefined || typeof query['contact'] == undefined
  || typeof query['date'] == undefined || typeof query['start-time'] == undefined || typeof query['end-time'] == undefined
  || typeof query['fee'] == undefined || typeof query['tag'] == undefined || typeof query['description'] == undefined
  || typeof query['link'] == undefined) {
    response.send('Pleaseee send a valid query!!!');
  } else {
    var name = query['name'];
    var organizer = query['organizer'];
    var contact = query['contact'];
    var date = query['date'];
    var starttime = query['start-time'];
    var endtime = query['end-time'];
    var fee = query['fee'];
    var tag = query['tag'];
    var description = query['description'];
    var link = query['link'];

    var toInsert = {
      "name" : name,
      "organizer" : organizer,
      "contact" : contact,
      "date" : date,
      "start-time" : starttime,
      "end-time" : endtime,
      "fee" : fee,
      "tag" : tag,
      "description" : description,
      "link" : link
    };
    db.collection('events', function(err, col) {
      if (err) {
        response.send(500);
      } else {
        col.insert(toInsert, function(error, saved) {
          if (error) {
            response.send(500);
          } else {
            response.send(200);
          }
        });
      }
    });
  }
});

app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});
