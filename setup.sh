#!/bin/bash
cd backend/api
echo "================================="
echo "Postavljanje okruženja..."
echo "================================="
echo
echo "Unesite podatke za spajanje na bazu."
read -p "Korisničko ime: " DB_USER
read -s -p "Lozinka: " DB_PASS
echo
echo
echo "Zapisivanje podataka u .env file..."
# Create or overwrite .env file
echo "DB_HOST=ucka.veleri.hr" >.env
echo "DB_NAME=$DB_USER" >>.env
echo "DB_USER=$DB_USER" >>.env
echo "DB_PASS=$DB_PASS" >>.env
echo ".env file stvoren!"
echo
# Backend setup
echo
echo "================================="
echo "Instaliranje paketa za API..."
echo "================================="
npm install
cd ../..

# Frontend setup
echo
echo "================================="
echo "Instaliranje paketa za Quasar..."
echo "================================="
cd frontend/quasar-project
npm install -g @quasar/cli
npm install

echo
echo "================================="
echo "Generiranje Quasar produkcijskog builda..."
echo "================================="
quasar build
cd ../..

echo
echo "================================="
echo "Generiranje SSL certifikata za HTTPS..."
echo "================================="
# MSYS_NO_PATHCONV=1 rješava problem s putanjama u Git Bashu na Windowsima
# -subj prosljeđuje lažne podatke da OpenSSL ne ispituje pitanja u terminalu
MSYS_NO_PATHCONV=1 openssl req -x509 -newkey rsa:4048 -nodes \
    -keyout key.pem \
    -out cert.pem \
    -days 365 \
    -subj "/C=HR/ST=Zupanija/L=Grad/O=Faks/OU=Smjer/CN=localhost"

echo "Certifikati uspješno kreirani (key.pem i cert.pem)!"

echo
echo "================================="
echo "Instaliranje paketa za projekt..."
echo "================================="
npm install -g concurrently
echo
echo "================================="
echo "Instaliranje gotovo!"
echo "================================="
echo
echo "Pokrenite servere: './start.sh'"
