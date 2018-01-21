
function PoeTradeScraper() {}
PoeTradeScraper.prototype.Scrape = require('./scrape');
PoeTradeScraper.prototype.Get = require('./get');

module.exports = new PoeTradeScraper();