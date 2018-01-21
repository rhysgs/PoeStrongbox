USE poe_currency;

DROP VIEW IF EXISTS v_recent_searches;
CREATE VIEW v_recent_searches AS 
  SELECT *
    FROM searches
    ORDER BY id DESC
    LIMIT 1000;

DROP VIEW IF EXISTS v_search_summary;
CREATE VIEW v_search_summary AS 
  SELECT
    COUNT(s.id) AS searches,
    COUNT(s.id)/(SELECT COUNT(id) FROM v_recent_searches) AS searches_normalised,
    s.currency_from_id,
    s.currency_to_id,
    c_from.name AS currency_from_name,
    c_from.css AS currency_from_css,
    c_to.name AS currency_to_name,
    c_to.css AS currency_to_css
    FROM v_recent_searches AS s
    JOIN currencies AS c_from
      ON s.currency_from_id = c_from.id
    JOIN currencies AS c_to
      ON s.currency_to_id = c_to.id
    GROUP BY s.currency_from_id, s.currency_to_id
    ORDER BY COUNT(s.id) DESC
    LIMIT 10;

USE migrations;