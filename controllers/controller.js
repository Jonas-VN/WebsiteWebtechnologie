const Tribune = require('../models/tribune');
const Person = require('../models/person');
const Ticket = require('../models/ticket');
const Bus = require('../models/bus');
const BusTicket = require('../models/busTicket');
const User = require('../models/user');

const async = require("async");
const { body, validationResult } = require('express-validator');
var { randomBytes } = require('crypto');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const isSignedIn = function(req) {
  var token = null;
  if(req && req.cookies) {
      token = req.cookies['jwt'];
  }
  return token !== undefined;
};

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
        signedIn: isSignedIn(req),
      });
    }
  );
};

exports.ticket_verkoop_get = function(req, res, next) {
  if (isSignedIn(req)) {
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
          signedIn: isSignedIn(req),
        });
      }
    );
  }
  else {
    res.render('youmustbeloggedin', {
      title: 'Unauthorized',
      signedIn: isSignedIn(req),
    })
  }

  
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
            signedIn: isSignedIn(req),
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
              person: person, 
              tribune: results.tribune,
              signedIn: isSignedIn(req),
            });
          }
        )
        
       
    });
  })}
]

exports.bus_verkoop_get = function(req, res, next) {
  if (isSignedIn(req)) {
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
          signedIn: isSignedIn(req),
        });
      }
    );
  }
  else {
    res.render('youmustbeloggedin', {
      title: 'Unauthorized',
      signedIn: isSignedIn(req),
    })
  }
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
            signedIn: isSignedIn(req),
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

      const busticket = new BusTicket({
        snacksIncluded: req.body.yes_no == 'on',
        person: person,
        bus: req.body.bus,
      })
  
      busticket.save((err) => {
        if (err) {
          return next(err);
        }
        async.parallel(
          {
            bus(callback) {
              Bus.findById(req.body.bus).exec(callback);
            }
          },
          (err, results) => {
            if (err) {
              return next(err);
            }
            res.render('busticket', { 
              title: 'Bus Ticket',
              person: person, 
              bus: results.bus,
            });
          }
        )
    });
  })}
]

exports.sign_up_get = function(req, res, next) {
	res.render('signup', {
		title: 'Sign Up',
    signedIn: isSignedIn(req),
    csrfToken: req.session.csrf,
	})
}

exports.sign_up_post = [
  body('name', 'Naam mag niet leeg zijn').escape(),
  body('email', 'Email mag niet leeg zijn.').escape(),
  body('age', 'Leeftijd mag niet leeg zijn.').escape(),
  body('gender', 'Gender mag niet leeg zijn').escape(),
  body('password', 'Wachtwoord mag niet leeg zijn.').escape(),
  body('question', 'Veiligheidsvraag mag niet leeg zijn.').escape(),
  body('answer', 'Veiligheidsvraag antwoord mag niet leeg zijn.').escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    if (!req.body.csrf || req.body.csrf !== req.session.csrf) {
      res.render('signup', {
        title: 'Sign Up',
        signedIn: isSignedIn(req),
        csrfToken: req.session.csrf,
        error: 'Niet met de csrf token spelen aub!'
      })
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).render('signup', {
          title: 'Sign Up',
          error: 'Email wordt al gebruikt',
          csrfToken: req.session.csrf,
        })
      }

      // Email is nog niet in gebruik -> user maken
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        gender: req.body.gender,
        password: req.body.password,
        question: req.body.question,
        answer: req.body.answer
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) return next(err);
            newUser.password = hash;
            newUser.save().then(res.redirect('/login')).catch(err);
        });
      });
    });
  }
]

exports.log_in_get = function(req, res, next) {
	res.render('login', {
		title: 'Log In',
    signedIn: isSignedIn(req),
    csrfToken: req.session.csrf,
	})
}

exports.log_in_post = [
  body('email', 'Email mag niet leeg zijn.').escape(),
  body('password', 'Wachtwoord mag niet leeg zijn.').escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!req.body.csrf || req.body.csrf !== req.session.csrf) {
      res.render('login', {
        title: 'Log In',
        signedIn: isSignedIn(req),
        csrfToken: req.session.csrf,
        error: 'Niet met de csrf token spelen aub!'
      })
      return;
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
          if (err) {
            return next(err);
          }
          // Password is juist
          if (isMatch) {
            const payload = {id: user._id, name: user.name};
            jwt.sign(payload, 
              'verySecretValue',
              {expiresIn: 3600},
              (err, token) => {
                // Set session cookie
                res.cookie('jwt', token, {
                    expires: new Date(Date.now() + 3600 * 1000),
                    secure: false,
                    httpOnly: true,
                });
                res.redirect('/');
              })
          }
          // Fout passwoord
          else {
            res.render('login', {
              title: 'Log In',
              error: 'Wachtwoord is niet juist.',
              signedIn: isSignedIn(req),
              csrfToken: req.session.csrf,
            });
          }          
        })
      }
      // Foute email
      else {
        res.render('login', {
          title: 'Log In',
          error: 'Geen gebruiker gevonden met dit email.',
          signedIn: isSignedIn(req),
          csrfToken: req.session.csrf,
        });
      }
    })
  }
]

exports.log_out = function(req, res, next) {
  if (isSignedIn(req)) {
    res.clearCookie('jwt');
  }
  res.redirect('/')
}

exports.forgot_get = function(req, res, next) {
  res.render('forgot', {
		title: 'Wachtwoord vergeten',
    signedIn: isSignedIn(req),
    csrfToken: req.session.csrf,
	})
}

exports.forgot_post = [
  body('email', 'Email mag niet leeg zijn.').escape(),
  body('question', 'Veiligheidsvraag mag niet leeg zijn.').escape(),
  body('answer', 'Veiligheidsvraag antwoord mag niet leeg zijn.').escape(),
  body('password', 'Wachtwoord mag niet leeg zijn.').escape(),  

  (req, res, next) => {
    if (!req.body.csrf || req.body.csrf !== req.session.csrf) {
      res.render('forgot', {
        title: 'Wachtwoord vergeten',
        signedIn: isSignedIn(req),
        csrfToken: req.session.csrf,
        error: 'Niet met de csrf token spelen aub!'
      })
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        return res.render('forgot', {
          title: 'Wachtwoord vergeten',
          signedIn: isSignedIn(req),
          csrfToken: req.session.csrf,
          error: 'Email niet gevonden'
        });
      }

      else if (req.body.question !== user.question || req.body.answer.toLowerCase() !== user.answer.toLowerCase()) {
        return res.render('forgot', {
          title: 'Wachtwoord vergeten',
          signedIn: isSignedIn(req),
          csrfToken: req.session.csrf,
          error: 'Veiligheidsvraag fout beantwoord!'
        });
      }
      // Alles correct ingevuld
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          }
          user.password = hash;
          user.save().then(res.redirect('/login')).catch(err);
        })
      });

    })
  }
]