#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Tribune = require('./models/tribune')
var Bus = require('./models/bus')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var tribunes = [];
var busses = [];

function tribuneCreate(nr, desc, pr, im, cb) {
  tribunedetail = {number: nr, description: desc, price: pr, image: im}

  var tribune = new Tribune(tribunedetail);
       
  tribune.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Tribune: ' + tribune);
    tribunes.push(tribune)
    cb(null, tribune)
  }  );
} 

function busCreate(nr, dep, cb) {
  busdetail = {number: nr, departure: dep};

  var bus = new Bus(busdetail);

  bus.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Bus: ' + bus);
    busses.push(bus)
    cb(null, bus)
  }  );
}

function createTribunes(cb) {
  async.series([
      function(callback) {
        tribuneCreate(1, 'Overdekte zitplaatsen met een goed zicht op de spelers en het volledige veld.', 50, 'assets/imgs/stadion_tribune_1.png', callback);
      },
      function(callback) {
        tribuneCreate(2, 'Overdekte zitplaatsen achter de goal.', 35, 'assets/imgs/stadion_tribune_2.png', callback);
      },
      ],
      // optional callback
      cb);
}

function createBus(cb) {
  async.series([
    function(callback) {
      busCreate(1, '2023-03-22T12:00:00', callback)
    },
    function(callback) {
      busCreate(2, '2023-03-22T13:00:00', callback)
    },
    function(callback) {
      busCreate(3, '2023-03-22T14:00:00', callback)
    },
    function(callback) {
      busCreate(4, '2023-03-22T15:00:00', callback)
    },
    function(callback) {
      busCreate(5, '2023-03-22T16:00:00', callback)
    },
  ],
  cb);

}



async.series([
  createBus,
  createTribunes,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances:');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



