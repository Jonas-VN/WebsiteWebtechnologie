var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/tribune1', function(req, res, next) {
  res.render('tribune1', { title: 'Tribune 1' });
});

router.get('/tribune2', function(req, res, next) {
  res.render('tribune2', { title: 'Tribune 2' });
});

router.get('/auto', function(req, res, next) {
  res.render('auto', { title: 'Auto' });
});

router.get('/bus', function(req, res, next) {
  res.render('bus', { title: 'Bus' });
});

router.get('/Ticketverkoop',function(req, res, next) {
  res.render('Ticketverkoop', {title: 'Ticketverkoop'})  
});
router.get('/Busverkoop', function(req, res, next) {
    res.render('busverkoop', {title: 'Bus'})
});

module.exports = router;
