var express = require('express');
var router = express.Router();

const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', controller.index);


router.get('/ticketverkoop', controller.ticket_verkoop);


router.get('/busverkoop', function(req, res, next) {
    res.render('busverkoop', {title: 'Bus'})
});

module.exports = router;
