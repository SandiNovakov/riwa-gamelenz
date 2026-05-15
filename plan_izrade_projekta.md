# TO DO

## Postavljanje platforme na igricu
- Novo polje u stranicama za dodavanje igrice u katalog i izmjenu podataka o igrici na katalogu
- Select list, vuče sve platforme.
- Ali dopušta postavljanje više vrijednosti.
- Viditi da li može automatski neki separator npr. "," ili ":".
- Dodati u API mogućnost upisa podataka u platforme itd. Transakcija ili nešto...

## Korisničko ime
- Dodati prikaz korisničkog imena gore desno ili negdje uvijek. Čisto da znamo tko smo. Korisničko ime + email.

## Korisničko ime + email
- Na page-eve di se prikazuje samo korisničko ime, dodati i prikaz email-a uz korisničko ime.
- Na mockupove napraviti isto.
---

# Početna stranica. ✓

- Dostupna svima.
- GameLenz logo ogroman, možemo prikazati neku statistiku, igru dana, što god vam padne na pamet.
- ADMIN > u navbar-u se prikažu dodatne opcije. To ću ja sredit kako će to bit isprogramirano.
- Dugmić koji vodi na registraciju, login i dugmić koji vodi na pregled igrica.

# Pregled igrica. ✓

- Dostupna svima.
- Cards pregled svih igrica.
- LOV item za sve pojmove itd, slat ćemo u request bodiju, zato što će inaće biti ogroman URL.
- Ovu stranicu radim ja, jer će biti dosta komplicirana.
- LOGGED IN > gumb za brzo dodavanje na listu, vodi na page DODAVANJE IGRICE
- ADMIN > link koji vodi na UPRAVLJANJE IGRICOM.

# Detalji o igrici. ✓

- dostupna svima.
- neka netko kome se da zezat s layout-ima ili bi volio dizajnirat custom layout od početka uzme ovo za radit.
- budite inspirirani MAL-om i imdb-om
- LOGGED IN > gumb koji vodi na DODAVANJE IGRICE
- ADMIN > gumb koji vodi na UPRAVLJANJE IGRICOM.

# Pretraga računa. ✓

- dostupna svima.
- slično kao PREGLED IGRICA, cards pregled svih računa. OBAVEZNO je da korisnik unese neko korisničko ime. Nema drugih filtera.

# Pregled računa. ✓

- dostupna svima.
- Neka bude slično kao MAL. Samo bih htio da je korisnikova lista igrica vidljiva odmah na toj stranici, neka bude ispod OPISA ili kako kog već.
- LOGGED IN > Ako korisnik pregledava vlastiti račun, prikazan je link na UPRAVLJANJE RAČUNOM.

# Upravljanje računom. ✓

- samo LOGGED IN korisnici > omogućava upravljanje korisničkim postavkama. Također ima gumb za brisanje.

# Login, Register. ✓

- U principu slične stranice. Radi POST, ako se vrati ispravno onda korisnik prolazi. Stavit ćemo taj podatak u local storage.

---

ovdje idu stranice koje samo admin vidi.

# Dodavanje igrice. ✓

- forma za dodavanje nove igrice. Mora imati sva polja sadržana u tablici Igrica.

# Upravljanje igricom. ✓

- Ista stranica kao DODAVANJE IGRICE, samo neka se u linku pošalje ID, pa će se podaci automatski popuniti, i ide PUT umjesto POST.

# Upravljanje izdavačima, developerima, platformama, žanrovima. ✓

- uglavnom čemo vuč sve iz baze u card layout i onda će bit gumb za edit i gumb za brisanje i gumb za dodavanje. Treba istražit da li je moguće napraviti popup prozor za izmjenu naziva.

# Upravljanje administratorima. ✓

- Ista priča kao i ovo gore, samo čemo vuč korisnike iz baze koji imaju razina prava = 1.
