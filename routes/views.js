var express = require('express');
var router = express.Router();

router.get('/index', function(req, res, next) {
  res.render('index/index-ctrl');
});

router.get('/components/currency-analyser/ratio-analyser-dir', function(req, res, next) {
  res.render('components/currency-analyser/ratio-analyser-dir');
});



module.exports = router;