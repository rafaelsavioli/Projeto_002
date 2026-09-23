# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email the maintainer via GitHub profile contact options with:

- Description of the issue
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You should receive an acknowledgement within 72 hours.

## Supported versions

| Version | Supported |
| ------- | --------- |
| main    | ✅        |

## Production hardening checklist

Before deploying FluxoBoard beyond local development:

- [ ] Set a strong `JWT_SECRET` (32+ random bytes) in the backend `.env`
- [ ] Run `NODE_ENV=production`
- [ ] Serve HTTPS only (reverse proxy: Caddy, nginx, Traefik)
- [ ] Restrict CORS origins in `backend/src/app.js`
- [ ] Switch SQLite → PostgreSQL for durability and concurrency
- [ ] Rate-limit `/auth/*` endpoints
- [ ] Rotate JWT secret periodically and prefer short token TTLs
- [ ] Never commit `.env` or `dev.db`
