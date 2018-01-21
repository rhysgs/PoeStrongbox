const Db = require('../Db');

function Visitor(callback) {
  callback = typeof callback === 'function' ? callback : function () { };
  Db.Insert('poe', 'poe_currency', 'visitors', {}, (error, results) => {
    if (error) {
      return callback({
        message: 'Failed to create visitor.',
        error: error
      });
    }
    callback(null, {
      id: results.insertId,
      success: true
    });
  });
}

function Visit(visitorId, callback) {
  callback = typeof callback === 'function' ? callback : function () { };
  if (isNaN(visitorId)) {
    return;
  }
  Db.Insert('poe', 'poe_currency', 'visits', {
    visitor_id: visitorId
  }, (error, results) => {
    if (error) {
      return callback({
        message: 'Failed to create visit.',
        error: error
      });
    }
    callback(null, {
      id: results.insertId,
      success: true
    });
  })
}

function Search(search, callback) {
  callback = typeof callback === 'function' ? callback : function () { };
  if (!search) {
    callback({
      message: 'Search is required.'
    });
    return;
  }
  Db.Insert('poe', 'poe_currency', 'searches', {
    visit_id: search.visitId,
    pull_id : search.pullId,
    currency_from_id : search.currencyFromId,
    currency_to_id: search.currencyToId,
    min_sellers : search.minSellers,
    amount: search.amount
  }, (error, results) => {
    if (error) {
      return callback({
        message: 'Failed to create search.',
        error: error
      });
    }
    callback(null, {
      id: results.insertId,
      success: true
    });
  });
}

const public = {
  Visitor: Visitor,
  Visit: Visit,
  Search: Search
};

module.exports = public;