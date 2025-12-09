# GameLenz Quasar aplikacija
Aplikacija napravljena u Quasar.js-u za korištenje GameLenz sustava. Sadrži API, skripte za postavljanje baze, te frontend u Quasar-u.

## Upute za instaliranje baze:
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
2. Pozicionirajte se u `riwa-gamelenz/backend/db/`.
3. Ako ste na Linux-u, pokrenite komandu `chmod +x install.sh`.
4. Zatim pokrenite `./install.sh`. (Za Windows sustave obavezno pokrenuti u git bash-u).
5. Upišite potrebne informacije: server, ime baze, korisničko ime, lozinku.
6. Baza je uspješno instalirana.

Prikaz ispravno pokrenute skripte:

<img width="300" height="250" alt="image" src="https://github.com/user-attachments/assets/a7afafab-321d-475a-b2a4-233375d23fa7" />

## Upute za pokretanje API-ja:
Prije svega, potrebno je imati instaliran i postavljen [Node.js](https://nodejs.org/en) na vašem računalu.

1. Navigirajte do `riwa-gamelenz/backend/api/`.
2. Datoteku `.env.example` kopirajte i preimenujte u `.env`.
3. U novoj datoteci `.env` upišite potrebne podatke za spajanje na vašu bazu (isti kao i za instalaciju baze).
4. Vratite se u terminal i u *istom* folderu pokrenite komandu `npm i express mariadb dotenv`.
5. Nakon što je npm uspješno instalirao potrebne dodatke, moguće je pokrenuti server koristeći `node app.js`.
