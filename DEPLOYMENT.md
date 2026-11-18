# Deployment notes

## Required environment variables

Set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and a random `JWT_SECRET` of at least 32 bytes for the backend. Set `CORS_ALLOWED_ORIGINS` to a comma-separated list of trusted frontend origins. Set `VITE_API_BASE_URL` to the public backend API URL when building the frontend.

Set `BUSINESS_TIME_ZONE` and `VITE_BUSINESS_TIME_ZONE` to the same IANA timezone. Both default to `Asia/Kolkata`; all attendance and leave business dates use that zone regardless of the host machine timezone.

Never commit these values. `.env.example` contains placeholders only.

## First production Admin account

The application does not provide public Admin signup. `POST /api/auth/register` is available only to an authenticated Admin, so it cannot be used to create the first Admin account. Provision that account through a controlled, one-time database initialization before exposing the application:

1. Apply the reviewed Flyway migrations and confirm the `users` table exists.
2. Generate a BCrypt password hash on a trusted, access-controlled machine with the same Spring Security `BCryptPasswordEncoder` used by the application. Use a unique, high-entropy initial password. Do not use an online hash generator, put the password in a command argument, or save it in a checked-in file. Keep the plaintext only long enough to generate and verify the hash.
3. Connect to the production database using an authorized operator account over the approved secure channel. Confirm that no Admin already exists, then insert one row into `users` with the operator's name, normalized unique email, generated BCrypt hash in `password`, `role` set to `ADMIN`, and `active` set to `1`. For example, with placeholders replaced only in a secure SQL client:

   ```sql
   INSERT INTO users (first_name, last_name, email, password, role, active)
   SELECT 'First', 'Last', 'admin@example.com', '<BCrypt hash>', 'ADMIN', 1
   WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'ADMIN');
   ```

4. Confirm exactly one row was created and that the hash is BCrypt encoded; do not select, log, or share the stored hash. Start the application and verify that the account can sign in and `/api/auth/me` reports `ADMIN`.
5. Deliver the initial password to the Admin through an approved secure channel and remove temporary SQL files and local copies. The application currently has no password-change endpoint, so rotate this password by generating a new BCrypt hash and updating that Admin's `users.password` through the same audited database process when rotation is required.

Do not enable anonymous registration or add a public Admin bootstrap endpoint. If an Admin already exists, use the authenticated Admin-only registration flow or the organization's audited account-recovery process instead of running this initialization again.

## Database migration strategy

Production starts with `spring.jpa.hibernate.ddl-auto=validate`; schema changes must be delivered as reviewed, versioned migrations before the application release. Back up the database and test restoration before every migration. Do not use `ddl-auto=update` in production.

For a controlled one-time adoption of Flyway on a pre-existing schema with no
`flyway_schema_history` table, set `FLYWAY_BASELINE_ON_MIGRATE=true` and leave
`FLYWAY_BASELINE_VERSION` at `1`. This records V1 as the baseline and runs V2+
migrations. Do not enable this flag for routine production starts. A database
with a failed migration entry must be repaired through the reviewed Flyway
repair process first; baselining does not clear failed history.

Migration V9 adds `employees.must_change_password` with a false default for existing accounts. New employees receive a random temporary password, and their first authenticated session is restricted to profile/password-change APIs until they set a permanent password. The Admin create response returns that temporary password once with `Cache-Control: no-store`; the Admin UI does not persist it. Deliver it to the employee over a separately approved secure channel.

## SPA routing

The frontend uses BrowserRouter. Configure the web host to serve `index.html` for unknown non-API paths, while proxying `/api/*` to the backend. This is required for direct visits and refreshes on `/admin/*` and `/employee/*` URLs.
