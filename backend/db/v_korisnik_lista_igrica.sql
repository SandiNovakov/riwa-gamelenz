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
	igrica_na_listi il JOIN igrica i ON il.id_igrice = i.igrice;
