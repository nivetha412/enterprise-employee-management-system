# Deployment notes

## Required environment variables

Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and a random `JWT_SECRET` of at least 32 bytes for the backend. Set `CORS_ALLOWED_ORIGINS` to a comma-separated list of trusted frontend origins. Set `VITE_API_BASE_URL` to the public backend API URL when building the frontend.

Never commit these values. `.env.example` contains placeholders only.

## Database migration strategy

Production starts with `spring.jpa.hibernate.ddl-auto=validate`; schema changes must be delivered as reviewed, versioned migrations before the application release. Back up the database and test restoration before every migration. Do not use `ddl-auto=update` in production.

## SPA routing

The frontend uses BrowserRouter. Configure the web host to serve `index.html` for unknown non-API paths, while proxying `/api/*` to the backend. This is required for direct visits and refreshes on `/admin/*` and `/employee/*` URLs.
