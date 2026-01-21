echo "Pokretanje servera..."

concurrently \
	--names "API,QSR" \
	--kill-others \
	"cd backend/api && node app.js" \
	"cd frontend/quasar-project && quasar dev"
