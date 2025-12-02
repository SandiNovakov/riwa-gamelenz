ALTER TABLE igrica add PRIMARY key (id_igrice)
;

ALTER TABLE izdavac add PRIMARY key (id_izdavaca)
;

ALTER TABLE developer add PRIMARY key (id_developera)
;

ALTER TABLE korisnik add PRIMARY key (id_korisnika)
;

ALTER TABLE zanr add PRIMARY key (id_zanra)
;

ALTER TABLE igrica_na_listi add PRIMARY key (id_korisnika, id_igrice)
;