const Db = require('../Db');

function Init(callback) {
  const sql = `
    SELECT *
      FROM poe_currency.currencies
      WHERE active = TRUE;
  `;
  Db.Query('poe', sql, null, (error, results) => {
    if (error) {
      throw new Error(error.message);
    }
    public.currencies = results;
    console.log(`${results.length} currencies loaded`);
    callback();
  });
}

const public = {
  currencies: [],
  Init: Init
};

module.exports=  public;