USE poe_currency;

INSERT INTO leagues (id, name, active, css) VALUES
  (11, 'Betrayal', TRUE, 'betrayal'),
  (12, 'Betrayal Hardcore', TRUE, 'hardcore-betrayal');

UPDATE leagues SET active = FALSE WHERE id = 9;
UPDATE leagues SET active = FALSE WHERE id = 10;

USE migrations;
