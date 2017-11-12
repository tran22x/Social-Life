var ObjectID = require('mongodb').ObjectID;

var databaseName = "social-life";
// Put the initial mock objects here.
var initialData = {
  "events": {
    "1": {
      "_id": new ObjectID("000000000000000000000001"),
      "name": "Hack Holyoke",
      "organizer": "MLH",
      "contact": "decent people",
      "date": 1453668480000,
      "start-time": 1453668480000,
      "end-time": 1453668480000,
      "fee": 0,
      "tag": "Sport",
      "description": "Helloo this is Hack Holyoke hahahahaha",
      "link": "http://hackholyoke.com/",
      "url": "https://tinyurl.com/y7kk6279"
    },
    "2": {
      "_id": new ObjectID("000000000000000000000002"),
      "name": "Vietnamese Coffee Workshop",
      "organizer": "VSA",
      "contact": "other decent people",
      "date": 1453668490000,
      "start-time": 1453668490000,
      "end-time": 1453668490000,
      "fee": 0,
      "tag": "Cultural",
      "description": "Is it the midterm week? Ye come have some coffee",
      "link": "https://www.facebook.com/events/132083817503639/?notif_t=aymt_add_missing_info_to_event_tip&notif_id=1510461599828503",
      "url": "https://scontent.fzty2-1.fna.fbcdn.net/v/t31.0-8/23406081_1731666650177280_7787262046586546869_o.jpg?oh=435d101dc4abfcf06e821d6c9ff69c24&oe=5A677B36"
    },
    "3": {
      "_id": new ObjectID("000000000000000000000003"),
      "name": "Christmas",
      "organizer": "Santa Claus",
      "contact": "elf",
      "date": 1453668470000,
      "start-time": 1453668470000,
      "end-time": 1453668470000,
      "fee": 500,
      "tag": "Local",
      "description": "Nice or naughty?",
      "link": "https://www.yourchristmascountdown.com/",
      "url": "https://tinyurl.com/yacz7mnj"
    }
  }
};

/**
* Adds any desired indexes to the database.
*/
function addIndexes(db, cb) {
  db.collection('events').createIndex({ "contents.contents": "text" }, null, cb);
}

/**
* Resets a collection.
*/
function resetCollection(db, name, cb) {
  // Drop / delete the entire object collection.
  db.collection(name).drop(function() {
    // Get all of the mock objects for this object collection.
    var collection = initialData[name];
    var objects = Object.keys(collection).map(function(key) {
      return collection[key];
    });
    // Insert objects into the object collection.
    db.collection(name).insertMany(objects, cb);
  });
}

/**
* Reset the MongoDB database.
* @param db The database connection.
*/
function resetDatabase(db, cb) {
  // The code below is a bit complex, but it basically emulates a
  // "for" loop over asynchronous operations.
  var collections = Object.keys(initialData);
  var i = 0;

  // Processes the next collection in the collections array.
  // If we have finished processing all of the collections,
  // it triggers the callback.
  function processNextCollection() {
    if (i < collections.length) {
      var collection = collections[i];
      i++;
      // Use myself as a callback.
      resetCollection(db, collection, processNextCollection);
    } else {
      addIndexes(db, cb);
    }
  }

  // Start processing the first collection!
  processNextCollection();
}

// Check if called directly via 'node', or required() as a module.
// http://stackoverflow.com/a/6398335
if(require.main === module) {
  // Called directly, via 'node src/resetdatabase.js'.
  // Connect to the database, and reset it!
  var MongoClient = require('mongodb').MongoClient;
  var url = 'mongodb://localhost:27017/' + databaseName;
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw new Error("Could not connect to database: " + err);
    } else {
      console.log("Resetting database...");
      resetDatabase(db, function() {
        console.log("Database reset!");
        // Close the database connection so NodeJS closes.
        db.close();
      });
    }
  });
} else {
  // require()'d.  Export the function.
  module.exports = database;
}
