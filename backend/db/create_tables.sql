SET
    foreign_key_checks = 0
;

DROP TABLE if EXISTS korisnik
  , izdavac
  , zanr
  , developer
  , igrica
  , igrica_na_listi
;

SET
    foreign_key_checks = 1
;

CREATE TABLE
    korisnik (
        id_korisnika INT NOT NULL
      , korisnicko_ime VARCHAR(32) NOT NULL
      , lozinka VARCHAR(32) NOT NULL
      , e_mail VARCHAR(32) NOT NULL
      , datum_izrade_racuna DATE NOT NULL
    )
;

CREATE TABLE
    izdavac (id_izdavaca INT NOT NULL, naziv_izdavaca VARCHAR(32) NOT NULL)
;

CREATE TABLE
    zanr (id_zanra INT NOT NULL, naziv_zanra VARCHAR(32) NOT NULL)
;

CREATE TABLE
    developer (id_developera INT NOT NULL, naziv_developera VARCHAR(32) NOT NULL)
;

CREATE TABLE
    igrica (
        id_igrice INT NOT NULL
      , naziv_igrice VARCHAR(32) NOT NULL
      , datum_izdavanja DATE NOT NULL
      , id_developera INT NOT NULL
      , id_zanra INT NOT NULL
      , id_izdavaca INT NOT NULL
    )
;

CREATE TABLE
    igrica_na_listi (
        id_korisnika INT NOT NULL
      , id_igrice INT NOT NULL
      , ocjene_igrice VARCHAR(32) NOT NULL
      , komentar_na_igrici VARCHAR(32) NOT NULL
      , status_igrice VARCHAR(32) NOT NULL
    )
;