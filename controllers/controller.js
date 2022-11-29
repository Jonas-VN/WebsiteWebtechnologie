const Tribune = require('../models/tribune');
const Person = require('../models/person');
const Ticket = require('../models/ticket');
const { body, validationResult } = require('express-validator');

exports.index = function(req, res, next) {
  Tribune.find()
    .exec(function (err, list_tribunes) {
      if (err) {
        return next(err);
    }
    console.log(list_tribunes)
    // Successful, so render
    res.render('index', {
      title: 'Home',
      tribunes: list_tribunes,
      });
    });
};

exports.ticket_verkoop_get = function(req, res, next) {
  Tribune.find()
    .exec(function (err, list_tribunes) {
      if (err) {
        return next(err);
    }
    // Successful, so render
    res.render('ticketverkoop', {
      title: 'Ticketverkoop',
      tribunes: list_tribunes,
      });
    });
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
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      res.render('ticketverkoop', {
        title: 'Ticketverkoop',
        tribunes: req.body.tribunes,
        errors: errors.array(),
      });
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
        res.redirect('/');
    });
  })}
]