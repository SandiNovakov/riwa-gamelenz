# TO DO

## Neimplementirane stranice

- Upravljanje računom.
- Pretraga računa.
- (ADMIN) Dodavanje igrice.
- (ADMIN) Upravljanje igricom.
- (ADMIN) Upravljanje DIPŽ.
- (ADMIN) Upravljanje administratorima.

## Polugotove stranice

- Detalji o igrici.
- Pregled računa.
- Pregled igrica.

# Početna stranica. ✓

- Dostupna svima.
- GameLenz logo ogroman, možemo prikazati neku statistiku, igru dana, što god vam padne na pamet.
- ADMIN > u navbar-u se prikažu dodatne opcije. To ću ja sredit kako će to bit isprogramirano.
- Dugmić koji vodi na registraciju, login i dugmić koji vodi na pregled igrica.

# Pregled igrica. --fali link na edit igrice za administratore.

- Dostupna svima.
- Cards pregled svih igrica.
- LOV item za sve pojmove itd, slat ćemo u request bodiju, zato što će inaće biti ogroman URL.
- Ovu stranicu radim ja, jer će biti dosta komplicirana.
- LOGGED IN > gumb za brzo dodavanje na listu, vodi na page DODAVANJE IGRICE
- ADMIN > link koji vodi na UPRAVLJANJE IGRICOM.

# Detalji o igrici. --fali link na dodavanje igrice i link za edit (admin).

- dostupna svima.
- neka netko kome se da zezat s layout-ima ili bi volio dizajnirat custom layout od početka uzme ovo za radit.
- budite inspirirani MAL-om i imdb-om
- LOGGED IN > gumb koji vodi na DODAVANJE IGRICE
- ADMIN > gumb koji vodi na UPRAVLJANJE IGRICOM.

# Pretraga računa.

- dostupna svima.
- slično kao PREGLED IGRICA, cards pregled svih računa. OBAVEZNO je da korisnik unese neko korisničko ime. Nema drugih filtera.

# Pregled računa. --fali verzija za ulogirane korisnike i neulogirane korisnike.

- dostupna svima.
- Neka bude slično kao MAL. Samo bih htio da je korisnikova lista igrica vidljiva odmah na toj stranici, neka bude ispod OPISA ili kako kog već.
- LOGGED IN > Ako korisnik pregledava vlastiti račun, prikazan je link na UPRAVLJANJE RAČUNOM.

# Upravljanje računom.

- samo LOGGED IN korisnici > omogućava upravljanje korisničkim postavkama. Također ima gumb za brisanje.

# Login, Register. ✓

- U principu slične stranice. Radi POST, ako se vrati ispravno onda korisnik prolazi. Stavit ćemo taj podatak u local storage.

---

ovdje idu stranice koje samo admin vidi.

# Dodavanje igrice.

- forma za dodavanje nove igrice. Mora imati sva polja sadržana u tablici Igrica.

# Upravljanje igricom.

- Ista stranica kao DODAVANJE IGRICE, samo neka se u linku pošalje ID, pa će se podaci automatski popuniti, i ide PUT umjesto POST.

# Upravljanje izdavačima, developerima, platformama, žanrovima.

- uglavnom čemo vuč sve iz baze u card layout i onda će bit gumb za edit i gumb za brisanje i gumb za dodavanje. Treba istražit da li je moguće napraviti popup prozor za izmjenu naziva.

# Upravljanje administratorima.

- Ista priča kao i ovo gore, samo čemo vuč korisnike iz baze koji imaju razina prava = 1.
