const Config = require('../Config');
const Db = require('../Db');

function Pull(leagueId, pullId, callback) {
  var payload = {
    league: null,
    pull: null,
    currencies: [],
    ratios: []
  };

  GetPullData();

  function GetPullData() {
    const sql = `
      SELECT * FROM poe_currency.leagues WHERE id = ? AND active = TRUE;

      SELECT * FROM poe_currency.pulls WHERE league_id = ?
        ${ pullId ? `AND id = ?` : ``}
        ORDER BY id DESC LIMIT 1;
    `;

    Db.Query('poe', sql, [leagueId, leagueId, pullId], (error, results) => {
      if (error) {
        return callback({
          message: 'Failed to get pull.',
          error: error
        });
      }
      payload.league = results[0][0];
      payload.pull = results[1][0];

      if (payload.league == null || payload.pull == null) {
        return callback({
          message: 'Invalid League or Pull.'
        });
      }

      GetCurrencyRatios();
    });
  }

  function GetCurrencyRatios() {
    const sql = `
      SELECT * FROM poe_currency.currency_ratios WHERE pull_id = ?;
      SELECT c.*
        FROM poe_currency.currency_ratios AS cr
        JOIN poe_currency.currencies AS c
          ON (cr.currency_from_id = c.id OR cr.currency_to_id = c.id)
        WHERE cr.pull_id = ?
        GROUP BY c.id;
    `;
    Db.Query('poe', sql, [payload.pull.id, payload.pull.id], (error, results) => {
      if (error) {
        return callback({
          message: 'Failed to get currency ratio data.',
          error: error
        });
      }
      payload.ratios = results[0];
      payload.currencies = results[1];
      Finish();
    });
  }

  function Finish() {
    callback(null, payload);
  }
}

const public = {
  Pull: Pull
};

module.exports = public;