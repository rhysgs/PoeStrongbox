var express = require('express');
var router = express.Router();
var package = require('../package.json');

var locals = {
  VERSION: package.version,
  CLIENT_ROOT: `/client/${package.version}`
};

router.get('/**', function (req, res, next) {
  res.render('layout', locals);
});

module.exports = router;