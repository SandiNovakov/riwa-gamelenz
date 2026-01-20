# GameLenz Quasar aplikacija

Aplikacija napravljena u Quasar.js-u za korištenje GameLenz sustava. Sadrži API, skripte za postavljanje baze, te frontend u Quasar-u.

## Upute za developere:

### Rad s git-om

Imamo osmišljen način rada s git-om kako bi izbjegli konflikte što je više moguće—pročitajte `pravila_git.md`.

### Rad na projektu

Pogledajte što sve treba izraditi u `plan_izrade_projekta.md`.

### Testiranje projekta

Pogledajte upute "Postavljanje radnog okruženja" i "Pokretanje servera".

Ako želite imati vlastitu bazu za testiranje, pogledajte sekciju "Upute za instaliranje baze".

## Postavljanje radnog okruženja

1. Klonirajte repozitorij: `git clone https://github.com/SandiNovakov/riwa-gamelenz`.
2. Pozicionairajte se u početni folder.
3. Pokrenite skriptu za postavljanje: `./setup.sh`.
4. Unesite korisničko ime i lozinku za spajanje na bazu. Korisničko ime jednako je bazi na koju se spajate.
5. Pričekajte dok skripta instalira potrebne npm pakete.

## Pokretanje servera

1. Nakon pokretanja skripte `setup.sh`, potrebno je pokrenuti skriptu `./start.sh`.

## Upute za instaliranje baze:

**VAŽNO**: Ovo radite samo jednom i samo ako želite imati vlastitu kopiju baze. U protivnom koristite nečiju postojeću bazu pa ovaj korak možete zanemariti.

Bazu instalirate koristeći jednu od sljedećih metoda:

### HeidiSQL

1. Klonirajte repozitorij: `git clone https://github.com/SandiNovakov/riwa-gamelenz`.
2. Pozicionirajte se u `riwa-gamelenz/backend/db/`.
3. Unutra ćete vidjeti skriptu `install.sql`.
4. Pokrenite HeidiSQL ili sličan alat i spojite se na vašu bazu.
5. Opcionalno obrišite nepotrebne tablice u vašoj bazi (tablice koje koristi GameLenz sustav skripta će automatski obrisati i stvoriti ponovno).
6. Idite na `File > Load SQL file...` i učitajte `install.sql`.
7. Pokrenite SQL skriptu.
8. Baza je uspješno instalirana.

### MariaDB CLI client

1. Instalirajte `mariadb` client package.
1. Klonirajte repozitorij: `git clone https://github.com/SandiNovakov/riwa-gamelenz`.
1. Pozicionirajte se u `riwa-gamelenz/backend/db/`.
1. Ako ste na Linux-u, pokrenite komandu `chmod +x install.sh`.
1. Zatim pokrenite `./install.sh`. (Za Windows sustave obavezno pokrenuti u git bash-u).
1. Upišite potrebne informacije: server, ime baze, korisničko ime, lozinku.
1. Baza je uspješno instalirana.
