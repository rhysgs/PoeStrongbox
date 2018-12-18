USE poe_currency;

INSERT INTO leagues (`name`, `active`, `css`) VALUES
  ('Incursion', TRUE, 'incursion'),
  ('Hardcore Incursion', TRUE, 'hardcore-incursion');

UPDATE leagues
  SET `active` = FALSE
  WHERE `name` IN ('Harbinger', 'Harbinger Harcore');

USE migrations;