const Tribune = require('../models/tribune');
const Person = require('../models/person');
const Ticket = require('../models/ticket');
const Bus = require('../models/bus');
const BusTicket = require('../models/busTicket');
const async = require("async");
const { body, validationResult } = require('express-validator');
var { randomBytes } = require('crypto');
const tribune = require('../models/tribune');


exports.index = function(req, res, next) {
  // Set session token on first visit
  if (req.session.csrf === undefined) {
    req.session.csrf = randomBytes(100).toString('base64'); // convert random data to a string
  }

  async.parallel(
    {
      list_tribunes(callback) {
        Tribune.find({}, callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('index', {
        title: 'Home',
        tribunes: results.list_tribunes,
      });
    }
  );
};

exports.ticket_verkoop_get = function(req, res, next) {
  async.parallel(
    {
      list_tribunes(callback) {
        Tribune.find({}, callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('ticketverkoop', {
        title: 'Ticketverkoop',
        tribunes: results.list_tribunes,
        csrfToken: req.session.csrf,
      });
    }
  );
};

exports.ticket_verkoop_post = [
  // Validate and sanitize fields
  body('tribune', 'Tribune mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('first_name', 'Voornaam mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Familienaam mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'Email mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('birth_date', 'Geboortedatum mag niet leeg zijn.')
    .isISO8601()
    .toDate(),
  body('policy', 'Je moet akkoord gaan met onze voorwaarden')  // checked = 'on', niet checked = ''
    .isLength({ min: 2 })
    .escape(),
	body('g-recaptcha-response', 'ReCaptcha mag niet leeg zijn.') // '' als niet gedaan, anders lange string
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty() || !req.body.csrf || req.body.csrf !== req.session.csrf) {
      async.parallel(
        {
          list_tribunes(callback) {
            Tribune.find({}, callback)
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render('ticketverkoop', {
            title: 'Ticketverkoop',
            tribunes: results.list_tribunes,
            csrfToken: req.session.csrf,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // From is valid.
    Person.findOne({
      first_name: req.body.first_name,
      family_name: req.body.last_name,
      email: req.body.email,
      date_of_birth: req.body.birth_date,
    })
    .exec(function (err, person) {
      if (err) {
        return next(err);
      }
      // Persoon zit nog niet in DB -> toevoegen
      if (person == null) {
        person = new Person({
          first_name: req.body.first_name,
          family_name: req.body.last_name,
          email: req.body.email,
          date_of_birth: req.body.birth_date,
        });
  
        person.save((err) => {
          if (err) {
            return next(err);
          }
        })
      }
      const ticket = new Ticket({
        person: person,
        tribune: req.body.tribune,
      })
  
      ticket.save((err) => {
        if (err) {
          return next(err);
        }

        async.parallel(
          {
            tribune(callback) {
              Tribune.findById(req.body.tribune).exec(callback);
            }
          },
          (err, results) => {
            if (err) {
              return next(err);
            }
            res.render('tribuneticket', { 
              title: 'Ticket',
              name: person.first_name, 
              tribune: results.tribune,
            });
          }
        )
        
       
    });
  })}
]

exports.bus_verkoop_get = function(req, res, next) {
  async.parallel(
    {
      list_busses(callback) {
        Bus.find({}, callback)
      }
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('busverkoop', {
        title: 'Busverkoop',
        busses: results.list_busses,
        csrfToken: req.session.csrf,
      });
    }
  );
};

exports.bus_verkoop_post = [
  // Validate and sanitize fields
  body('yes_no', 'Drank + snack mag niet leeg zijn')
    .escape(),
  body('bus', 'Bus mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('first_name', 'Voornaam mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Familienaam mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('email', 'Email mag niet leeg zijn.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('birth_date', 'Geboortedatum mag niet leeg zijn.')
    .isISO8601()
    .toDate(),
  body('policy', 'Je moet akkoord gaan met onze voorwaarden')  // checked = 'on', niet checked = ''
    .isLength({ min: 2 })
    .escape(),
  body('g-recaptcha-response', 'ReCaptcha mag niet leeg zijn.') // '' als niet gedaan, anders lange string
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    // Als er errors zijn, als de form geen csrf token bevat of als de tokens niet overeen komen -> opnieuw
    if (!errors.isEmpty() || !req.body.csrf || req.body.csrf !== req.session.csrf) {
      async.parallel(
        {
          list_busses(callback) {
            Bus.find({}, callback)
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render('busverkoop', {
            title: 'Busverkoop',
            busses: results.list_busses,
            csrfToken: req.session.csrf,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // From is valid.
    Person.findOne({
      first_name: req.body.first_name,
      family_name: req.body.last_name,
      email: req.body.email,
      date_of_birth: req.body.birth_date,
    })
    .exec(function (err, person) {
      if (err) {
        return next(err);
      }
      // Persoon zit nog niet in DB -> toevoegen
      if (person == null) {
        person = new Person({
          first_name: req.body.first_name,
          family_name: req.body.last_name,
          email: req.body.email,
          date_of_birth: req.body.birth_date,
        });
  
        person.save((err) => {
          if (err) {
            return next(err);
          }
        })
      }

      var checked = false;
      if (req.body.yes_no == 'on') {
        checked = true;
      }

      const busticket = new BusTicket({
        snacksIncluded: checked,
        person: person,
        bus: req.body.bus,
      })
  
      busticket.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
    });
  })}
]