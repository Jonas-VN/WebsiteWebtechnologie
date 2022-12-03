var express = require('express');
var router = express.Router();
const controller = require('../controllers/controller');


/* GET home page. */
router.get('/', controller.index);

router.get('/ticketverkoop', controller.ticket_verkoop_get);
router.post('/ticketverkoop', controller.ticket_verkoop_post);


router.get('/busverkoop', controller.bus_verkoop_get);
router.post('/busverkoop', controller.bus_verkoop_post);

router.get('/cookiepolicy', function(req, res, next) {
	res.render('cookiepolicy', { title: 'Cookie Policy' });
});

router.get('/privacypolicy', function(req, res, next) {
	res.render('privacypolicy', { title: 'Privacy Policy' });
});

router.get('/tribuneticket', function(req, res, next) {
	res.render('tribuneticket', { title: 'Ticket' });
});

router.get('/busticket', function(req, res, next) {
	res.render('busticket', { title: 'Bus Ticket' });
});

router.get('/signup', controller.sign_up_get);
router.post('/signup', controller.sign_up_post);

//router.get('/signin', controller.sign_in_get);
//router.post('/signin', controller.sign_in_post);
 
module.exports = router;
