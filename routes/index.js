var express = require('express');
var router = express.Router();

const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', controller.index);


router.get('/ticketverkoop', controller.ticket_verkoop_get);

router.post('/ticketverkoop', controller.ticket_verkoop_post);


router.get('/busverkoop', controller.bus_verkoop_get);

router.post('/busverkoop', controller.bus_verkoop_post);

module.exports = router;
