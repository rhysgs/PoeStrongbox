USE poe_currency;

DELETE from leagues
  WHERE `name` LIKE '%blight%';
  
UPDATE leagues
  SET `active` = FALSE;

INSERT INTO leagues (`name`, `active`, `css`) VALUES
  ('Blight', TRUE, 'blight'),
  ('Hardcore Blight', TRUE, 'hardcore-blight');

USE migrations;