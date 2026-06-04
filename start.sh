#!/bin/bash
echo "Pokretanje servera..."

concurrently \
    --names "API,QSR" \
    --kill-others \
    "cd backend/api && node server.js" \
    "cd frontend/quasar-project && npx http-server dist/spa -p 8080 -S -C ../../cert.pem -K ../../key.pem --cors"
