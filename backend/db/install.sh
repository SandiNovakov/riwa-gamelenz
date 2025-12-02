#!/bin/bash

# --- Configuration ---
DB_USER="root"
DB_PASS="your_password_here"
DB_NAME="mydatabase"

# --- Array of scripts in order ---
SCRIPTS=(
  "create_tables.sql"
  "primary_keys.sql"
  "foreign_keys.sql"
)

# --- Run each script with verbose output ---
for SCRIPT in "${SCRIPTS[@]}"; do
  echo "======================================"
  echo "Running $SCRIPT..."
  echo "======================================"
  mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" --show-warnings -vvv < "$SCRIPT"
  if [ $? -ne 0 ]; then
    echo "Error occurred while running $SCRIPT"
    exit 1
  fi
  echo "Finished $SCRIPT"
  echo
done

echo "All scripts executed successfully."
