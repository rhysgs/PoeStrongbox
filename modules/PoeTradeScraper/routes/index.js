const express = require('express');
const router = express.Router();
const Config = require('../../Config');
const moment = require('moment');
const PoeTradeScraper = require('../index');
const Db = require('../../Db');

function get_currencies(req, res) {
  res.send(Config.Currencies.currencies);
}

function get_leagues(req, res) {
  res.send(Config.Leagues.leagues);
}

function get_leagues_pull(req, res) {
  var leagueId = parseInt(req.params.leagueId);
  PoeTradeScraper.Get.Pull(leagueId, null, (error, pull) => {
    if (error) {
      return res.status(500).send({
        message: error.message
      });
    }
    PoeTradeScraper.Scrape.ScrapeIfExpired(pull.league, () => {});
    res.send(pull);
  });
}

function get_search_summary(req, res) {
  const sql = `
    SELECT *
      FROM poe_currency.v_search_summary
  `;
  Db.Query('poe', sql, null, (error, results) => {
    if (error) {
      return res.status(500).send({
        message: 'Failed to fetch search summary.'
      });
    }
    res.send(results);
  });
}

router.get('/currencies', get_currencies);
router.get('/leagues', get_leagues);
router.get('/leagues/:leagueId/pull', get_leagues_pull);
router.get('/currencies/search/summary', get_search_summary);
module.exports = router;