#!/bin/bash

# Prompt for connection info
read -p "Ime servera: " DB_HOST
read -p "Ime baze: " DB_NAME
read -p "Korisničko ime: " DB_USER
read -s -p "Lozinka: " DB_PASS
echo   # just a newline after password prompt


SCRIPTS=(
  "create_tables.sql"
  "primary_keys.sql"
  "foreign_keys.sql"
)

for SCRIPT in "${SCRIPTS[@]}"; do
  echo "======================================"
  echo "Pokretanje $SCRIPT na $DB_HOST..."
  echo "======================================"
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" --show-warnings < "$SCRIPT"
  if [ $? -ne 0 ]; then
    echo "Došlo je do greške pri pokretanju $SCRIPT!"
    exit 1
  fi
  echo "Dovršeno $SCRIPT"
  echo
done

echo "Sve skripte uspješno su dovršene!"
