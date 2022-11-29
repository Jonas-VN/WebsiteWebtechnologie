var express = require('express');
var router = express.Router();

const controller = require('../controllers/controller');

/* GET home page. */
router.get('/', controller.index);


router.get('/ticketverkoop', function(req, res, next) {
  res.render('ticketverkoop', {title: 'Ticketverkoop'})  
});


router.get('/busverkoop', function(req, res, next) {
    res.render('busverkoop', {title: 'Bus'})
});

module.exports = router;
