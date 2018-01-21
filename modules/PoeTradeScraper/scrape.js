const request = require('request');
const Config = require('../Config');
const Helpful = require('../Helpful');
const Db = require('../Db');
const moment = require('moment');

const degToRad = 180 / Math.PI;

var ratios = null;

function Scrape(league, fromId, toId, callback) {
  if (typeof callback !== 'function') return;
  fromId = parseInt(fromId);
  toId = parseInt(toId);
  if (typeof league !== 'string')
    return callback({
      message: 'Invalid league.'
    });
  if (isNaN(fromId) || isNaN(toId))
    return callback({
      message: 'Invalid fromId or toId.'
    });

  GetData(league, fromId, toId, (error, result) => {
    if (error || !result)
      return callback({
        message: 'Failed to get data from poe.trade'
      });
    var data = ExtractRatios(result);
    if (!data)
      return callback();
    CalcSinAvg(data);
    callback(null, data);
  });

}

function GetData(league, fromId, toId, callback) {
  var url = `http://currency.poe.trade/search?league=${encodeURIComponent(league)}&online=x&want=${toId}&have=${fromId}`;
  console.log(`Fetching ${url}`);
  request({
    url: url,
    method: 'GET'
  }, (error, response, body) => {
    console.log(`Recieved ${url}`)
    callback(error, body);
  });
}

function ExtractRatios(html) {
  const targetStart = '<div class=\"displayoffer-middle\">';
  const targetEnd = '</div>';
  const splitter = ' &lArr; ';
  var result = {
    ratios: [],
    avg: null,
    sum: null
  }
  if (typeof html !== 'string') return result.ratios;

  var start = null;
  var curr = null;
  var end = null;
  while ((start = html.indexOf(targetStart)) >= 0) {
    html = html.substring(start + targetStart.length);
    end = html.indexOf(targetEnd);
    if (end < 0) return result.ratios;
    curr = html.substring(0, end);
    CalcRatio(result.ratios, curr.split(splitter));
    if (!result.ratios.length) continue;
    result.sum += result.ratios[result.ratios.length - 1];
  }

  if (!result.ratios.length) return null;

  result.avg = result.sum / result.ratios.length;

  return result;
}

function CalcRatio(output, vals) {
  if (!vals || vals.length < 2) return;
  var a = parseFloat(vals[0]);
  var b = parseFloat(vals[1]);
  if (isNaN(a) || a <= 0 || isNaN(b) || b <= 0) return;
  var result = a / b;
  output.push(result);
}

function CalcSinAvg(data) {
  //the smaller the decimal the closer the curve is skewed to the start
  const offset = 0.7;
  const period = 1 * Math.PI;
  const deltaCutoff = 0.20;//difference allowed per step, 0.5 = 50%
  const lowerDeltaCutoff = (1 - deltaCutoff);//if something is less than 0.6x the average it is ignored
  const upperDeltaCutoff = 1 / (1 - deltaCutoff);//if something is greater than 1.7x the average it is ingored 
  var ratios = data.ratios;
  var start = Math.floor(ratios.length/7);

  var sum = 0;
  var factor = 0;
  CalcDirection(start, -1);
  CalcDirection(start + 1, 1);

  data.sinAvg = sum / factor;

  function CalcDirection(start, dir) {
    for (var i = start; i < ratios.length && i > 0 && start > 0; i += dir, start--) {
      var delta = ratios[i] / ratios[i - dir];
      if (delta && delta < lowerDeltaCutoff || delta > upperDeltaCutoff) {
        break
      };
      var rad = (i + 1) / ratios.length;
      var sin = Math.sin(Math.pow(rad, offset) * period);
      sum += ratios[i] * sin;
      factor += sin;
    }
  }
}

function ScrapeAll(league, callback) {
  callback = typeof callback === 'function' ? callback : function () { };

  const maxRequests = 16;
  var index = {
    i: 0,
    j: -1,
    paused: false
  }
  var currencies = Config.Currencies.currencies;
  var pending = 0;
  var finished = 0;
  var total = Math.pow(currencies.length, 2);
  var payload = [];
  var pullId = null;

  CreatePull(league, (error, newPullId) => {
    if (error) {
      return callback(error);
    }
    pullId = newPullId;
    AttemptStart();
  });

  function AttemptStart() {
    if (!Start()) {
      return;
    }
    index.j++;
    if (index.j >= currencies.length) {
      index.j = 0;
      index.i++;
    }
    var from = currencies[index.i];
    var to = currencies[index.j];
    if (index.i >= currencies.length) {
      return Finish();
    }
    if (index.i === index.j) {
      AttemptStart();
      return Finish();
    }

    AttemptStart();

    Scrape(league.name, from.id, to.id, (error, ratio) => {
      if (error || !ratio) {
        AttemptStart();
        Finish();
      } else {
        CreateRatio(from, to, ratio, pullId, (error) => {
          AttemptStart();
          Finish();
        });
      }
    });
  }

  function Start() {
    if (index.paused) return false;
    if (pending < 0) return false;
    if (pending >= maxRequests) {
      index.paused = true;
      return false;
    }
    pending++;
    return true;
  }

  function Finish() {
    if (pending < 0) return false;
    pending--;
    finished++;
    if (pending > 0) return false;

    if (index.i < currencies.length) {
      return setTimeout(() => {
        index.paused = false;
        AttemptStart();
      }, 3000);
    }

    pending = -1;
    callback(null, pullId);
    return true;
  }

}

/**
 * 
 * @param {{id:number,name:string,active:boolean}} league 
 * @param {*} callback 
 */
function ScrapeIfExpired(league, callback) {
  var payload = {
    league: league,
    expired: false
  };

  CheckPull(league, (error, expired) => {
    if (error) {
      return callback(error);
    }
    payload.expired = expired;
    if (!expired) {
      console.log(`Last pull of ${league.name} is not expired yet.`);
      return callback(null, payload);
    }
    console.log(`Scraping ${league.name}...`);
    ScrapeAll(league, (error, results) => {
      if (error) {
        return callback(error);
      }
      console.log(`Scrape of ${league.name} complete.`);
      callback(null, payload);
    });
  });
}


function CheckPull(league, callback) {
  const sql = `
    SELECT 1
      FROM poe_currency.pulls
      WHERE league_id = ?
        AND expires_at > NOW()
      ORDER BY id DESC
      LIMIT 1
  `;
  Db.Query('poe', sql, [league.id], (error, results) => {
    if (error) {
      return callback({
        message: 'Failed to retrieve latest pull',
        error: error
      });
    }
    callback(null, results.length === 0);
  });
}

function CreatePull(league, callback) {
  Db.Insert('poe', 'poe_currency', 'pulls', {
    league_id: league.id,
    expires_at: moment().add(Config.Pulls.ttl.amount, Config.Pulls.ttl.units).format()
  }, (error, results) => {
    if (error) {
      return callback({
        message: 'Failed to create pull.',
        error: error
      });
    }
    callback(null, results.insertId);
  });
}

function CreateRatio(from, to, ratio, pullId, callback) {
  Db.Insert('poe', 'poe_currency', 'currency_ratios', {
    pull_id: pullId,
    currency_from_id: from.id,
    currency_to_id: to.id,
    ratio: ratio.sinAvg,
    sellers: ratio.ratios.length
  }, (error, results) => {
    if (error) {
      return callback({
        message: 'Failed to create ratio.',
        error: error
      });
    }
    callback(null, results.insertId);
  })
}


function Add1ToN(n) {
  var result = 0;
  for (var i = 1; i <= n; i++)
    result += i;
  return result;
}

const public = {
  Scrape: Scrape,
  ScrapeAll: ScrapeAll,
  ScrapeIfExpired: ScrapeIfExpired
};
module.exports = public;