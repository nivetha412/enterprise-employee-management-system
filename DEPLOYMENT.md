# Deployment notes

## Required environment variables

Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and a random `JWT_SECRET` of at least 32 bytes for the backend. Set `CORS_ALLOWED_ORIGINS` to a comma-separated list of trusted frontend origins. Set `VITE_API_BASE_URL` to the public backend API URL when building the frontend.

Never commit these values. `.env.example` contains placeholders only.

## Database migration strategy

Production starts with `spring.jpa.hibernate.ddl-auto=validate`; schema changes must be delivered as reviewed, versioned migrations before the application release. Back up the database and test restoration before every migration. Do not use `ddl-auto=update` in production.

For a controlled one-time adoption of Flyway on a pre-existing schema with no
`flyway_schema_history` table, set `FLYWAY_BASELINE_ON_MIGRATE=true` and leave
`FLYWAY_BASELINE_VERSION` at `1`. This records V1 as the baseline and runs V2+
migrations. Do not enable this flag for routine production starts. A database
with a failed migration entry must be repaired through the reviewed Flyway
repair process first; baselining does not clear failed history.

## SPA routing

The frontend uses BrowserRouter. Configure the web host to serve `index.html` for unknown non-API paths, while proxying `/api/*` to the backend. This is required for direct visits and refreshes on `/admin/*` and `/employee/*` URLs.
