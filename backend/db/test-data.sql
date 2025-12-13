
/* =========================
   CLEANUP
   ========================= */

DELETE FROM igrica_na_platformi;
DELETE FROM platforma;
DELETE FROM igrica;
DELETE FROM developer;
DELETE FROM izdavac;
DELETE FROM zanr;

ALTER TABLE zanr AUTO_INCREMENT = 1;
ALTER TABLE izdavac AUTO_INCREMENT = 1;
ALTER TABLE developer AUTO_INCREMENT = 1;
ALTER TABLE platforma AUTO_INCREMENT = 1;
ALTER TABLE igrica AUTO_INCREMENT = 1;

/* =========================
   ZANROVI
   ========================= */

INSERT INTO zanr (naziv_zanra) VALUES
('RPG'),
('Action'),
('Adventure'),
('Strategy'),
('Simulation'),
('Horror'),
('FPS');

/* =========================
   IZDAVACI
   ========================= */

INSERT INTO izdavac (naziv_izdavaca) VALUES
('Valve'),
('CD Projekt'),
('Bethesda Softworks'),
('Ubisoft'),
('Electronic Arts'),
('Square Enix');

/* =========================
   DEVELOPERS
   ========================= */

INSERT INTO developer (naziv_developera) VALUES
('Valve'),
('CD Projekt Red'),
('Bethesda Game Studios'),
('Ubisoft Montreal'),
('DICE'),
('Larian Studios');

/* =========================
   PLATFORME
   ========================= */

INSERT INTO platforma (naziv_platforme) VALUES
('PC'),
('PlayStation'),
('Xbox'),
('Nintendo Switch');

/* =========================
   IGRICE
   ========================= */

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

/* =========================
   IGRICA NA PLATFORMI
   ========================= */

INSERT INTO igrica_na_platformi (id_igrice, id_platforme)
SELECT i.id_igrice, p.id_platforme
FROM igrica i, platforma p
WHERE i.naziv_igrice = 'The Witcher 3: Wild Hunt'
  AND p.naziv_platforme IN ('PC', 'PlayStation', 'Xbox');

INSERT INTO igrica_na_platformi (id_igrice, id_platforme)
SELECT i.id_igrice, p.id_platforme
FROM igrica i, platforma p
WHERE i.naziv_igrice = 'Half-Life 2'
  AND p.naziv_platforme = 'PC';

INSERT INTO igrica_na_platformi (id_igrice, id_platforme)
SELECT i.id_igrice, p.id_platforme
FROM igrica i, platforma p
WHERE i.naziv_igrice = 'Skyrim'
  AND p.naziv_platforme IN ('PC', 'PlayStation', 'Xbox');

INSERT INTO igrica_na_platformi (id_igrice, id_platforme)
SELECT i.id_igrice, p.id_platforme
FROM igrica i, platforma p
WHERE i.naziv_igrice = 'Assassin''s Creed Valhalla'
  AND p.naziv_platforme IN ('PC', 'PlayStation', 'Xbox');

INSERT INTO igrica_na_platformi (id_igrice, id_platforme)
SELECT i.id_igrice, p.id_platforme
FROM igrica i, platforma p
WHERE i.naziv_igrice = 'Battlefield V'
  AND p.naziv_platforme IN ('PC', 'PlayStation', 'Xbox');

INSERT INTO igrica_na_platformi (id_igrice, id_platforme)
SELECT i.id_igrice, p.id_platforme
FROM igrica i, platforma p
WHERE i.naziv_igrice = 'Baldur''s Gate 3'
  AND p.naziv_platforme IN ('PC', 'PlayStation', 'Xbox');
