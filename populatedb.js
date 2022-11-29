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
var Person = require('./models/person')
var Tribune = require('./models/tribune')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var persons = [];
var tribunes = [];

function personCreate(first_name, family_name, d_birth, mail, cb) {
  persondetail = {first_name:first_name , family_name: family_name, date_of_birth: d_birth, email: mail}
  
  var person = new Person(persondetail);
       
  person.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Person: ' + person);
    persons.push(person)
    cb(null, person)
  }  );
}

function tribuneCreate(nr, desc, pr, im, cb) {
  tribunedetail = {number: nr, description: desc, price: pr, image: im}

  var tribune = new Tribune(tribunedetail);
       
  tribune.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Tribune: ' + tribune);
    persons.push(tribune)
    cb(null, tribune)
  }  );
} 


function createPersons(cb) {
    async.series([
        function(callback) {
          personCreate('Patrick', 'Rothfuss', '1973-06-06', 'patje@gmail.com', callback);
        },
        function(callback) {
          personCreate('Ben', 'Bova', '1932-11-8', 'ben.bove@hotmail.com', callback);
        },
        ],
        // optional callback
        cb);
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



async.series([
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



