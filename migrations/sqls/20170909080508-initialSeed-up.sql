USE poe_currency;

INSERT INTO leagues (id, name, active) VALUES
  (1, 'Standard', FALSE),
  (2, 'Hardcore', FALSE),
  (3, 'Harbinger', TRUE),
  (4, 'Harbinger Hardcore', FALSE);

INSERT INTO currencies (id, name, css, active) VALUES
  (1,"Orb of Alteration","orb-of-alteration",TRUE),
  (2,"Orb of Fusing","orb-of-fusing",TRUE),
  (3,"Orb of Alchemy","orb-of-alchemy",TRUE),
  (4,"Chaos Orb","chaos-orb",TRUE),
  (5,"Gemcutter's Prism","gemcutters-prism",TRUE),
  (6,"Exalted Orb","exalted-orb",TRUE),
  (7,"Chromatic Orb","chromatic-orb",TRUE),
  (8,"Jewellers Orb","jewellers-orb",TRUE),
  (9,"Orb of Chance","orb-of-chance",TRUE),
  (10,"Cartographer's Chisel","cartographers-chisel",TRUE),
  (11,"Orb of Scouring","orb-of-scouring",TRUE),
  (13,"Orb of Regret","orb-of-regret",TRUE),
  (14,"Regal Orb","regal-orb",TRUE),
  (15,"Divine Orb","divine-orb",TRUE),
  (16,"Vaal Orb","vaal-orb",TRUE),
  (513,"Orb of Annulment","orb-of-annulment",TRUE),
  (514,"Orb of Binding","orb-of-binding",TRUE),
  (515,"Orb of Horizons","orb-of-horizons",TRUE);

USE migrations;