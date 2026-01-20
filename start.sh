echo "Pokretanje servera..."

concurrently \
	--names "API,QUASAR" \
	--kill-others \
	--hide "quasar" \
	"cd backend/api && node app.js" \
	"cd frontend/quasar-project && quasar dev"
