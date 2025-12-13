INSERT INTO zanr (naziv_zanra) VALUES
('RPG'),
('Action'),
('Adventure'),
('Strategy'),
('Simulation'),
('Horror'),
('FPS');

INSERT INTO izdavac (naziv_izdavaca) VALUES
('Valve'),
('CD Projekt'),
('Bethesda Softworks'),
('Ubisoft'),
('Electronic Arts'),
('Square Enix');

INSERT INTO developer (naziv_developera) VALUES
('Valve'),
('CD Projekt Red'),
('Bethesda Game Studios'),
('Ubisoft Montreal'),
('DICE'),
('Larian Studios');


INSERT INTO igrica
(
  naziv_igrice,
  opis,
  datum_izdanja,
  prosjecna_ocjena,
  broj_dodavanja_na_listu,
  id_izdavaca,
  id_developera,
  id_zanra
)
VALUES
(
  'The Witcher 3: Wild Hunt',
  'Open-world RPG set in a dark fantasy universe.',
  '2015-05-19',
  9.60,
  15432,
  2,
  2,
  1
),
(
  'Half-Life 2',
  'Story-driven FPS with advanced physics.',
  '2004-11-16',
  9.40,
  20111,
  1,
  1,
  7
),
(
  'Skyrim',
  'Epic fantasy RPG with an open world.',
  '2011-11-11',
  9.10,
  18345,
  3,
  3,
  1
),
(
  'Assassin''s Creed Valhalla',
  'Action RPG set in the Viking age.',
  '2020-11-10',
  8.20,
  9123,
  4,
  4,
  2
),
(
  'Battlefield V',
  'World War II themed multiplayer FPS.',
  '2018-11-20',
  7.90,
  6234,
  5,
  5,
  7
),
(
  'Baldur''s Gate 3',
  'Deep role-playing game based on D&D rules.',
  '2023-08-03',
  9.70,
  17455,
  6,
  6,
  1
);
