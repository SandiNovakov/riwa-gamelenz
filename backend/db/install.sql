-- START CREATE TABLES --
SET foreign_key_checks = 0;

DROP TABLE if EXISTS
    korisnik
  , igrica
  , zanr
  , izdavac
  , developer
  , platforma
  , igrica_na_listi
  , igrica_na_platformi;

DROP VIEW IF EXISTS
	 index_summary,
	 games_details,
	 korisnik_lista_igrica;

SET foreign_key_checks = 1;

CREATE TABLE korisnik
  (
     id_korisnika         INT PRIMARY KEY auto_increment,
     korisnicko_ime       VARCHAR(32) NOT NULL,
     lozinka              VARCHAR(32) NOT NULL,
     email                VARCHAR(64),
     razina_prava         INT DEFAULT 0,
     privatni_racun       BOOLEAN DEFAULT false,
     broj_igrica_na_listi INT DEFAULT 0
  );

ALTER TABLE korisnik ADD CONSTRAINT korisnik_ki_uk UNIQUE (korisnicko_ime);
ALTER TABLE korisnik ADD CONSTRAINT korisnik_email_uk UNIQUE (email);

CREATE TABLE igrica
  (
     id_igrice               INT PRIMARY KEY auto_increment,
     naziv_igrice            VARCHAR(64) NOT NULL UNIQUE,
     opis                    TEXT,
     datum_izdanja           DATE,
     prosjecna_ocjena        DECIMAL(3, 2),
     broj_dodavanja_na_listu INT DEFAULT 0,
     id_izdavaca             INT,
     id_developera           INT,
     id_zanra                INT
  );

CREATE TABLE zanr
  (
     id_zanra    INT PRIMARY KEY auto_increment,
     naziv_zanra VARCHAR(32) NOT NULL UNIQUE
  );

CREATE TABLE izdavac
  (
     id_izdavaca    INT PRIMARY KEY auto_increment,
     naziv_izdavaca VARCHAR(64) NOT NULL UNIQUE
  );

CREATE TABLE developer
  (
     id_developera    INT PRIMARY KEY auto_increment,
     naziv_developera VARCHAR(64) NOT NULL UNIQUE
  );

CREATE TABLE platforma
  (
     id_platforme    INT PRIMARY KEY auto_increment,
     naziv_platforme VARCHAR(64) NOT NULL UNIQUE
  );

CREATE TABLE igrica_na_listi
  (
     id_korisnika    INT,
     id_igrice       INT,
     datum_dodavanja DATE NOT NULL,
     ocjena          INT,
     komentar        VARCHAR(512),
     status          VARCHAR(32) NOT NULL,
     PRIMARY KEY (id_korisnika, id_igrice)
  );

CREATE TABLE igrica_na_platformi
  (
     id_igrice    INT,
     id_platforme INT,
     PRIMARY KEY (id_igrice, id_platforme)
  ); 
-- END CREATE TABLES --

-- START FOREIGN KEYS --

-- Veze za tablicu Igrica
ALTER TABLE igrica
  ADD CONSTRAINT fk_igrica_izdavac FOREIGN KEY (id_izdavaca) REFERENCES izdavac(
  id_izdavaca) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE igrica
  ADD CONSTRAINT fk_igrica_developer FOREIGN KEY (id_developera) REFERENCES
  developer(id_developera) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE igrica
  ADD CONSTRAINT fk_igrica_zanr FOREIGN KEY (id_zanra) REFERENCES zanr(id_zanra)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Veze za tablicu Igrica_na_listi
ALTER TABLE igrica_na_listi
  ADD CONSTRAINT fk_lista_korisnik FOREIGN KEY (id_korisnika) REFERENCES
  korisnik(id_korisnika) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE igrica_na_listi
  ADD CONSTRAINT fk_lista_igrica FOREIGN KEY (id_igrice) REFERENCES igrica(
  id_igrice) ON DELETE CASCADE ON UPDATE CASCADE;

-- Veze za tablicu Igrica_na_platformi
ALTER TABLE igrica_na_platformi
  ADD CONSTRAINT fk_ip_igrica FOREIGN KEY (id_igrice) REFERENCES igrica(
  id_igrice) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE igrica_na_platformi
  ADD CONSTRAINT fk_ip_platforma FOREIGN KEY (id_platforme) REFERENCES platforma
  (id_platforme) ON DELETE CASCADE ON UPDATE CASCADE; 

-- END FOREIGN KEYS --

-- START INDEXES --

-- -- Indeksi za Igrica
CREATE INDEX idx_igrica_izdavac ON igrica(id_izdavaca);

CREATE INDEX idx_igrica_developer ON igrica(id_developera);

CREATE INDEX idx_igrica_zanr ON igrica(id_zanra);

-- Indeksi za Igrica_na_listi
CREATE INDEX idx_lista_korisnik ON igrica_na_listi(id_korisnika);

CREATE INDEX idx_lista_igrica ON igrica_na_listi(id_igrice);

-- Indeksi za Igrica_na_platformi
CREATE INDEX idx_ip_igrica ON igrica_na_platformi(id_igrice);

CREATE INDEX idx_ip_platforma ON igrica_na_platformi(id_platforme); 

-- END INDEXES --

-- START VIEWS --
CREATE VIEW index_summary AS
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

CREATE VIEW games_details AS
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

CREATE OR REPLACE VIEW korisnik_lista_igrica AS
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

