CREATE VIEW index_summary AS
SELECT 
    (SELECT FORMAT(COUNT(*), 0) FROM korisnik) AS broj_korisnika,
    (SELECT FORMAT(COUNT(*), 0) FROM igrica) AS broj_igrica,
    r.naziv_igrice,
    r.opis,
    r.prosjecna_ocjena
FROM (
    SELECT 
        id_igrice,
        naziv_igrice,
        opis,
        datum_izdanja,
        prosjecna_ocjena,
        broj_dodavanja_na_listu,
        id_izdavaca,
        id_developera,
        id_zanra
    FROM igrica
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
    i.prosjecna_ocjena,
    i.broj_dodavanja_na_listu,
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
LEFT JOIN developer dev ON i.id_developera = dev.id_developera;
