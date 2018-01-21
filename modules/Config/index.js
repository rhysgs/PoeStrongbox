const currencies = require('./currencies');
const leagues = require('./leagues');
const pulls = require('./pulls');
const locals = require('./locals');

function Init(callback) {
  currencies.Init(() => {
    leagues.Init(() => {
      callback();
    });
  });
}

function Config() {}
Config.prototype.Currencies = currencies;
Config.prototype.Leagues = leagues;
Config.prototype.Pulls = pulls;
Config.prototype.Locals = locals;
Config.prototype.Init = Init;

const public = new Config();

module.exports = public;