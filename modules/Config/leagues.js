const Db = require('../Db');

function Init(callback) {
  const sql = `
    SELECT *
      FROM poe_currency.leagues
      WHERE active = TRUE;
  `;
  Db.Query('poe', sql, null, (error, results) => {
    if (error) {
      throw new Error(error.message);
    }
    public.leagues = results;
    console.log(`${results.length} leagues loaded`);
    callback();
  });
}

const public = {
  leagues: [],
  Init: Init
};

module.exports=  public;