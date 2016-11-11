var express = require('express');
var router = express.Router();

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Overtame' });
});

/* GET test page */
router.get('/sandbox', function(req, res, next) {
  res.render('sandbox');
});

module.exports = router;
