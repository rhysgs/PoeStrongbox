const express = require('express');
const router = express.Router();
const Config = require('../../Config');
const moment = require('moment');
const Visitors = require('../index');


function get_visitor(req, res) {
  Visitors.Create.Visitor((error, results) => {
    if (error) {
      return res.status(500).send({
        error: error.message
      });
    }
    res.send(results);
  });
}

function patch_visit(req, res) {
  var visitorId = req.params.visitorId;
  if (!visitorId || isNaN(visitorId)) {
    res.end();
  }
  Visitors.Create.Visit(visitorId, (error, results) => {
    if (error) {
      return res.status(500).send({
        error: error.message
      });
    }
    res.send(results);
  });
}

function post_search(req, res) {
  var search = req.body;
  Visitors.Create.Search(search, (error, results) => {
    if (error) {
      return res.status(500).send({
        error: error.message
      });
    }
  });
  res.end();
}

router.get('/visitor', get_visitor);
router.patch('/visitor/:visitorId/visit', patch_visit);
router.post('/visitor/:visitorId/search', post_search);

module.exports = router;