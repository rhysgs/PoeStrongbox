USE poe_currency;

UPDATE leagues
  SET `active` = TRUE
  WHERE `name` IN ('Harbinger', 'Harbinger Harcore');

DELETE FROM leagues
  WHERE `name` IN ('Blight', 'Blight Hardcore');

USE migrations;