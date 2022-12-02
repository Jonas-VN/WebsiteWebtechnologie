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

  
module.exports = router;
