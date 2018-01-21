USE poe_currency;

CREATE TABLE visitors (
  id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  _ca TIMESTAMP DEFAULT NOW()
);

CREATE TABLE visits (
  id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  ip CHAR(39),
  visitor_id INTEGER UNSIGNED NOT NULL,
  _ca TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_visits_visitors FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE CASCADE
);

CREATE TABLE searches (
  id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  visit_id INTEGER UNSIGNED,
  pull_id INTEGER UNSIGNED,
  currency_from_id INTEGER UNSIGNED,
  currency_to_id INTEGER UNSIGNED,
  min_sellers INTEGER UNSIGNED,
  amount INTEGER UNSIGNED,
  CONSTRAINT fk_searches_visits FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE CASCADE,
  CONSTRAINT fk_searches_pulls FOREIGN KEY (pull_id) REFERENCES pulls(id) ON DELETE CASCADE,
  CONSTRAINT fk_searches_currencies_1 FOREIGN KEY (currency_from_id) REFERENCES currencies(id) ON DELETE CASCADE,
  CONSTRAINT fk_searches_currencies_2 FOREIGN KEY (currency_to_id) REFERENCES currencies(id) ON DELETE CASCADE
);

USE migrations;