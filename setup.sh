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
echo "DB_HOST=veleri.ucka.hr" >.env
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
npm install # This installs ALL dependencies from package.json
cd ../..

# Frontend setup
echo
echo "================================="
echo "Instaliranje paketa za Quasar..."
echo "================================="
cd frontend/quasar-project
npm install -g @quasar/cli
npm install
cd ../..

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
