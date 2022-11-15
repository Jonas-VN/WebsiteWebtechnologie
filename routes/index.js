var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/info', function(req, res, next) {
  res.render('info', { title: 'Info' });
});

router.get('/tickets', function(req, res, next) {
  res.render('tickets', { title: 'Tickets' });
});

router.get('/bussen', function(req, res, next) {
  res.render('bussen', { title: 'Bussen' });
});

module.exports = router;
