USE poe_currency;

ALTER TABLE leagues ADD css CHAR(255) NOT NULL DEFAULT 'standard';
UPDATE leagues SET css = 'standard' WHERE id = 1;
UPDATE leagues SET css = 'hardcore' WHERE id = 2;
UPDATE leagues SET css = 'harbinger' WHERE id = 3;
UPDATE leagues SET css = 'hardcore-harbinger', name = 'Hardcore Harbinger' WHERE id = 4;

USE migrations;