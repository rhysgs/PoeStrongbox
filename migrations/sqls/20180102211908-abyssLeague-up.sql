USE poe_currency;

INSERT INTO leagues (id, name, active, css) VALUES
  (5, 'Abyss', TRUE, 'abyss'),
  (6, 'Abyss Hardcore', TRUE, 'hardcore-abyss');

UPDATE leagues SET active = FALSE WHERE id = 3;
UPDATE leagues SET active = FALSE WHERE id = 4;

USE migrations;
