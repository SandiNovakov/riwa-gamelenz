echo "Pokretanje servera..."

concurrently \
    --names "API,QSR" \
    --kill-others \
    "cd backend/api && node server.js" \
    "cd frontend/quasar-project && quasar dev"
