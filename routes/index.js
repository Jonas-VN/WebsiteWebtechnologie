var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var csrf = require('csurf');

const controller = require('../controllers/controller');

var csrfProtect = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })

/* GET home page. */
router.get('/', controller.index);


router.get('/ticketverkoop', csrfProtect, controller.ticket_verkoop_get);

router.post('/ticketverkoop', parseForm, csrfProtect, controller.ticket_verkoop_post);


router.get('/busverkoop', csrfProtect, controller.bus_verkoop_get);

router.post('/busverkoop', parseForm, csrfProtect, controller.bus_verkoop_post);


router.get('/cookiepolicy', function(req, res, next) {
	res.render('cookiepolicy', { title: 'Cookie Policy' });
  });

router.get('/privacypolicy', function(req, res, next) {
	res.render('privacypolicy', { title: 'Privacy Policy' });
  });

module.exports = router;
