# Početna stranica.
- Dostupna svima.
- GameLenz logo ogroman, možemo prikazati neku statistiku, igru dana, što god vam padne na pamet.
- ADMIN > u navbar-u se prikažu dodatne opcije. To ću ja sredit kako će to bit isprogramirano.
- Dugmić koji vodi na registraciju, login i dugmić koji vodi na pregled igrica.

# Pregled igrica.
- Dostupna svima.
- Cards pregled svih igrica.
- LOV item za sve pojmove itd, slat ćemo u request bodiju, zato što će inaće biti ogroman URL.
- Ovu stranicu radim ja, jer će biti dosta komplicirana.
- LOGGED IN > gumb za brzo dodavanje na listu, vodi na page DODAVANJE IGRICE
- ADMIN > link koji vodi na UPRAVLJANJE IGRICOM.

# Detalji o igrici
- dostupna svima.
- neka netko kome se da zezat s layout-ima ili bi volio dizajnirat custom layout od početka uzme ovo za radit.
- budite inspirirani MAL-om i imdb-om
- LOGGED IN > gumb koji vodi na DODAVANJE IGRICE
- ADMIN > gumb koji vodi na UPRAVLJANJE IGRICOM.

# Pretraga računa.
- dostupna svima.
- slično kao PREGLED IGRICA, cards pregled svih računa. OBAVEZNO je da korisnik unese neko korisničko ime. Nema drugih filtera.

# Pregled računa
- dostupna svima.
- Neka bude slično kao MAL. Samo bih htio da je korisnikova lista igrica vidljiva odmah na toj stranici, neka bude ispod OPISA ili kako kog već.
- LOGGED IN > Ako korisnik pregledava vlastiti račun, prikazan je link na UPRAVLJANJE RAČUNOM.

# Upravljanje računom
- samo LOGGED IN korisnici > omogućava upravljanje korisničkim postavkama. Također ima gumb za brisanje.

# Login, Register
- U principu slične stranice. Register radi POST, Login radi GET i ako se vrati ispravno onda korisnik prolazi. Stavit ćemo taj podatak u local storage ili cookie.
---

ovdje idu stranice koje samo admin vidi.
# Dodavanje igrice
- forma za dodavanje nove igrice. Mora imati sva polja sadržana u tablici Igrica.

# Upravljanje igricom
- Ista stranica kao DODAVANJE IGRICE, samo neka se u linku pošalje ID, pa će se podaci automatski popuniti, i ide PUT umjesto POST. Objasnim ja kako bi se to dalo srediti.

# Upravljanje izdavačima, developerima, platformama, žanrovima.
- ovo su uglavnom entiteti koji imaju jedno polje--naziv. Stoga bi bilo dobro kada bi se dopustilo i upravljanje i dodavanje i brisanje sve od jednom. Trebalo bi istražit da li je takvo nešto moguće u quasar-u bez ponovnog učitavanja čitave stranice. Ako nije morat će nova stranica za svaki. Malo monotono ali u principu će ići isti template, samo novi kodovi.

# Upravljanje administratorima
- Ista priča kao i ovo gore.


