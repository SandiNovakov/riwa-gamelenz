-- START CREATE TABLES --
SET foreign_key_checks = 0;

DROP TABLE IF EXISTS
    korisnik,
    igrica,
    zanr,
    izdavac,
    developer,
    platforma,
    igrica_na_listi,
    igrica_na_platformi,
	slike;
    
DROP VIEW IF EXISTS
	 v_index_summary,
	 v_games_details,
	 v_korisnik,
	 v_korisnik_lista_igrica;

SET foreign_key_checks = 1;

CREATE TABLE korisnik (
    id_korisnika INT PRIMARY KEY AUTO_INCREMENT,
    korisnicko_ime VARCHAR(32) NOT NULL,
    lozinka VARCHAR(32) NOT NULL,
    email VARCHAR(64),
    razina_prava INT DEFAULT 0,
    privatni_racun BOOLEAN DEFAULT FALSE
    -- Removed: broj_igrica_na_listi (can be COUNTed)
);

CREATE TABLE igrica (
    id_igrice INT PRIMARY KEY AUTO_INCREMENT,
    naziv_igrice VARCHAR(64) NOT NULL,
    opis TEXT,
    datum_izdanja DATE,
    id_izdavaca INT,
    id_developera INT,
    id_zanra INT
    -- Removed: prosjecna_ocjena (can be AVGed)
    -- Removed: broj_dodavanja_na_listu (can be COUNTed)
);

CREATE TABLE zanr (
    id_zanra INT PRIMARY KEY AUTO_INCREMENT,
    naziv_zanra VARCHAR(32) NOT NULL
);

CREATE TABLE izdavac (
    id_izdavaca INT PRIMARY KEY AUTO_INCREMENT,
    naziv_izdavaca VARCHAR(64) NOT NULL
);

CREATE TABLE developer (
    id_developera INT PRIMARY KEY AUTO_INCREMENT,
    naziv_developera VARCHAR(64) NOT NULL
);

CREATE TABLE platforma (
    id_platforme INT PRIMARY KEY AUTO_INCREMENT,
    naziv_platforme VARCHAR(64) NOT NULL
);

CREATE TABLE igrica_na_listi (
    id_korisnika INT,
    id_igrice INT,
    datum_dodavanja DATE NOT NULL,
    ocjena INT,
    komentar VARCHAR(512),
    status VARCHAR(32) NOT NULL,
    PRIMARY KEY (id_korisnika, id_igrice)
);

CREATE TABLE igrica_na_platformi (
    id_igrice INT,
    id_platforme INT,
    PRIMARY KEY (id_igrice, id_platforme)
);
-- END CREATE TABLES --

-- START FOREIGN KEYS --
ALTER TABLE igrica
    ADD CONSTRAINT fk_igrica_izdavac FOREIGN KEY (id_izdavaca)
    REFERENCES izdavac(id_izdavaca) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE igrica
    ADD CONSTRAINT fk_igrica_developer FOREIGN KEY (id_developera)
    REFERENCES developer(id_developera) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE igrica
    ADD CONSTRAINT fk_igrica_zanr FOREIGN KEY (id_zanra)
    REFERENCES zanr(id_zanra) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE igrica_na_listi
    ADD CONSTRAINT fk_lista_korisnik FOREIGN KEY (id_korisnika)
    REFERENCES korisnik(id_korisnika) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE igrica_na_listi
    ADD CONSTRAINT fk_lista_igrica FOREIGN KEY (id_igrice)
    REFERENCES igrica(id_igrice) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE igrica_na_platformi
    ADD CONSTRAINT fk_ip_igrica FOREIGN KEY (id_igrice)
    REFERENCES igrica(id_igrice) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE igrica_na_platformi
    ADD CONSTRAINT fk_ip_platforma FOREIGN KEY (id_platforme)
    REFERENCES platforma(id_platforme) ON DELETE CASCADE ON UPDATE CASCADE;
-- END FOREIGN KEYS --

-- START INDEXES --
CREATE INDEX idx_igrica_izdavac ON igrica(id_izdavaca);
CREATE INDEX idx_igrica_developer ON igrica(id_developera);
CREATE INDEX idx_igrica_zanr ON igrica(id_zanra);

CREATE INDEX idx_lista_korisnik ON igrica_na_listi(id_korisnika);
CREATE INDEX idx_lista_igrica ON igrica_na_listi(id_igrice);

CREATE INDEX idx_ip_igrica ON igrica_na_platformi(id_igrice);
CREATE INDEX idx_ip_platforma ON igrica_na_platformi(id_platforme);
-- END INDEXES --

-- START VIEWS --
CREATE VIEW v_index_summary AS
SELECT 
    (SELECT FORMAT(COUNT(*), 0) FROM korisnik) AS broj_korisnika,
    (SELECT FORMAT(COUNT(*), 0) FROM igrica) AS broj_igrica,
    r.naziv_igrice,
    r.opis,
    COALESCE(r.prosjecna_ocjena, 0) AS prosjecna_ocjena,
	r.id_igrice
FROM (
    SELECT 
        i.id_igrice,
        i.naziv_igrice,
        i.opis,
        i.datum_izdanja,
        COALESCE(AVG(inl.ocjena), 0) AS prosjecna_ocjena,
        FORMAT(COUNT(*), 0) AS broj_dodavanja_na_listu,
        i.id_izdavaca,
        i.id_developera,
        i.id_zanra
    FROM igrica i
    LEFT JOIN igrica_na_listi inl ON i.id_igrice = inl.id_igrice
    GROUP BY i.id_igrice
    ORDER BY RAND()
    LIMIT 1
) AS r;

CREATE VIEW v_games_details AS
SELECT
    i.id_igrice,
    i.naziv_igrice,
    i.opis,
    DATE_FORMAT(i.datum_izdanja, '%d.%m.%Y.') AS datum_izdanja_fmt,
    i.datum_izdanja,
    FORMAT(COALESCE(game_stats.prosjecna_ocjena, 0), 2) AS prosjecna_ocjena,    COALESCE(game_stats.broj_dodavanja_na_listu, 0) AS broj_dodavanja_na_listu,
    i.id_zanra,
    z.naziv_zanra AS zanr,
    i.id_izdavaca,
    izd.naziv_izdavaca AS izdavac,
    i.id_developera,
    dev.naziv_developera AS developer,
    (
        SELECT GROUP_CONCAT(p.naziv_platforme SEPARATOR ', ')
        FROM platforma p
        JOIN igrica_na_platformi ip ON p.id_platforme = ip.id_platforme
        WHERE ip.id_igrice = i.id_igrice
    ) AS platforme,
    (
        SELECT GROUP_CONCAT(p.id_platforme SEPARATOR ',')
        FROM platforma p
        JOIN igrica_na_platformi ip ON p.id_platforme = ip.id_platforme
        WHERE ip.id_igrice = i.id_igrice
    ) AS platforme_ids
FROM igrica i
LEFT JOIN zanr z ON i.id_zanra = z.id_zanra
LEFT JOIN izdavac izd ON i.id_izdavaca = izd.id_izdavaca
LEFT JOIN developer dev ON i.id_developera = dev.id_developera
LEFT JOIN (
    SELECT 
        id_igrice,
        COALESCE(AVG(ocjena), 0) AS prosjecna_ocjena,
        FORMAT(COUNT(*), 0) AS broj_dodavanja_na_listu
    FROM igrica_na_listi
    GROUP BY id_igrice
) game_stats ON i.id_igrice = game_stats.id_igrice;

CREATE VIEW v_korisnik AS
SELECT 
    k.*,
    FORMAT(COUNT(inl.id_igrice), 0) AS broj_igrica_na_listi
FROM korisnik k
LEFT JOIN igrica_na_listi inl ON k.id_korisnika = inl.id_korisnika
GROUP BY k.id_korisnika;


CREATE OR REPLACE VIEW v_korisnik_lista_igrica AS
SELECT 
	  il.id_igrice AS id_igrice
	, il.id_korisnika AS id_korisnika
	, il.datum_dodavanja AS datum_dodavanja
	, DATE_FORMAT(il.datum_dodavanja, '%d.%m.%Y.') AS datum_dodavanja_fmt
	, il.ocjena AS ocjena
	, il.status AS status
	, i.naziv_igrice AS naziv_igrice
	, i.id_zanra AS id_zanra
	, i.id_izdavaca AS id_izdavaca
	, i.id_developera AS id_developera
FROM
	igrica_na_listi il JOIN igrica i ON il.id_igrice = i.id_igrice;
-- END VIEWS --


-- START SPECIAL IMAGE TABLE --
CREATE TABLE slike (
    id_slike INT AUTO_INCREMENT PRIMARY KEY,

    veza_tablica VARCHAR(50) NOT NULL,
    id_veze INT NOT NULL,

    tip_slike VARCHAR(50) NOT NULL,

    mime_type VARCHAR(50) NOT NULL,
    data LONGBLOB NOT NULL,
    size INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_veza (veza_tablica, id_veze),
    INDEX tip_slike (tip_slike)
);
-- END SPECIAL IMAGE TABLE --

-- START TEST-DATA INSERT --
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
  id_izdavaca,
  id_developera,
  id_zanra
)
VALUES
(
  'The Witcher 3: Wild Hunt',
  'Open-world RPG set in a dark fantasy universe.',
  '2015-05-19',
  2,
  2,
  1
),
(
  'Half-Life 2',
  'Story-driven FPS with advanced physics.',
  '2004-11-16',
  1,
  1,
  7
),
(
  'Skyrim',
  'Epic fantasy RPG with an open world.',
  '2011-11-11',
  3,
  3,
  1
),
(
  'Assassin''s Creed Valhalla',
  'Action RPG set in the Viking age.',
  '2020-11-10',
  4,
  4,
  2
),
(
  'Battlefield V',
  'World War II themed multiplayer FPS.',
  '2018-11-20',
  5,
  5,
  7
),
(
  'Baldur''s Gate 3',
  'Deep role-playing game based on D&D rules.',
  '2023-08-03',
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

INSERT INTO `korisnik` (`id_korisnika`, `korisnicko_ime`, `lozinka`, `email`, `razina_prava`, `privatni_racun`) VALUES
	(2, 'Borat', 'mynameaborat', 'borat@mail.com', 0, 0),
	(3, 'hornet_from_silksong', 'skong', 'hornet.silksong@mail.com', 0, 0),
	(4, 'shyguy', '123456', 'shyguy@mail.com', 0, 1),
	(6, 'dahmetovi', 'dahmetovi', 'dahmetovi@veleri.hr', 1, 0),
	(7, 'gzornada', 'meterolog67', 'gzornada@veleri.hr', 1, 0),
	(8, 'tgrgic', 'tgrgic', 'tgrgic@veleri.hr', 1, 0),
	(69, 'tvojastara', 'tvojastara', NULL, 1, 0),
	(70, 'Gabrijel', 'gabrijel', 'gabrijel@mail.com', 0, 0),
	(71, 'tom_ass17', '123', 'tom@gmail.com', 0, 0),
	(72, 'tomislav', 'VeleRi58', 'tbijelicc@veleri.hr', 1, 0),
	(73, 'snovakov', 'snovakov', 'snovakov@mail.com', 1, 0),
	(74, 'goofy812', 'veleuciliste-58', 'goofy.goo@gmail.com', 0, 1),
	(75, 'Braco', '13051970', 'uros.egci@gmail.com', 0, 1);

INSERT INTO `igrica_na_listi` (`id_korisnika`, `id_igrice`, `datum_dodavanja`, `ocjena`, `komentar`, `status`) VALUES
	(2, 2, '2026-01-21', 1, '', 'planirano'),        -- Half-Life 2
	(2, 4, '2026-01-21', 2, '', 'završeno'),          -- Assassin's Creed Valhalla
	(2, 5, '2026-01-21', 2, '', 'završeno'),          -- Battlefield V
	(2, 6, '2026-01-21', 5, '', 'igram'),              -- Baldur's Gate 3
	(6, 1, '2026-01-26', NULL, '', 'planirano'),       -- The Witcher 3
	(6, 4, '2026-01-26', NULL, '', 'planirano'),       -- Assassin's Creed Valhalla
	(8, 2, '2026-01-25', 3, 'Super je!', 'završeno'),  -- Half-Life 2
	(8, 4, '2026-01-24', NULL, '', 'igram'),           -- Assassin's Creed Valhalla
	(8, 5, '2026-01-21', NULL, 'kolonoja', 'odustao'), -- Battlefield V
	(8, 6, '2026-01-21', 2, 'kolo', 'planirano'),      -- Baldur's Gate 3
	(69, 1, '2026-01-24', 5, '', 'završeno'),          -- The Witcher 3
	(69, 3, '2026-01-24', 2, 'okeeee', 'završeno'),    -- Skyrim
	(69, 6, '2026-01-24', 3, '', 'završeno'),          -- Baldur's Gate 3
	(71, 2, '2026-01-26', 1, 'A', 'planirano'),        -- Half-Life 2
	(73, 1, '2026-01-26', 4, 'Još neki komentar\n', 'završeno'),  -- The Witcher 3
	(73, 2, '2026-01-26', NULL, 'Neki jako jako jako dugi komentar za testiranje dugih komentara\n', 'planirano'),  -- Half-Life 2
	(73, 3, '2026-01-26', 1, '', 'odustao'),           -- Skyrim
	(73, 4, '2026-01-26', 1, '', 'odustao'),           -- Assassin's Creed Valhalla
	(73, 5, '2026-01-26', NULL, '', 'planirano'),      -- Battlefield V
	(73, 6, '2026-01-26', 5, '', 'završeno'),          -- Baldur's Gate 3
	(75, 2, '2026-01-29', NULL, '', 'planirano');      -- Half-Life 2

-- END TEST-DATA INSERT --
