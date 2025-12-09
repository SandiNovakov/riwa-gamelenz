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

CREATE TABLE igrica
  (
     id_igrice               INT PRIMARY KEY auto_increment,
     naziv_igrice            VARCHAR(64) NOT NULL,
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
     naziv_zanra VARCHAR(32) NOT NULL
  );

CREATE TABLE izdavac
  (
     id_izdavaca    INT PRIMARY KEY auto_increment,
     naziv_izdavaca VARCHAR(64) NOT NULL
  );

CREATE TABLE developer
  (
     id_developera    INT PRIMARY KEY auto_increment,
     naziv_developera VARCHAR(64) NOT NULL
  );

CREATE TABLE platforma
  (
     id_platforme    INT PRIMARY KEY auto_increment,
     naziv_platforme VARCHAR(64) NOT NULL
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