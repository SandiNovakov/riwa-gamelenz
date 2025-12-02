ALTER TABLE igrica add CONSTRAINT v_developer FOREIGN key (id_developera) REFERENCES developer (id_developera) ON DELETE restrict ON UPDATE cascade
;

ALTER TABLE igrica add CONSTRAINT v_zanr FOREIGN key (id_zanra) REFERENCES zanr (id_zanra) ON DELETE restrict ON UPDATE cascade
;

ALTER TABLE igrica add CONSTRAINT v_izdavac FOREIGN key (id_izdavaca) REFERENCES izdavac (id_izdavaca) ON DELETE restrict ON UPDATE cascade
;

ALTER TABLE igrica_na_listi add CONSTRAINT v_korisnik FOREIGN key (id_korisnika) REFERENCES korisnik (id_korisnika) ON DELETE restrict ON UPDATE cascade
;

ALTER TABLE igrica_na_listi add CONSTRAINT v_igrica FOREIGN key (id_igrice) REFERENCES igrica (id_igrice) ON DELETE restrict ON UPDATE cascade
;