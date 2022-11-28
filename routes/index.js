var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/ticketverkoop', function(req, res, next) {
  res.render('ticketverkoop', {title: 'Ticketverkoop'})  
});


router.get('/busverkoop', function(req, res, next) {
    res.render('busverkoop', {title: 'Bus'})
});

module.exports = router;
