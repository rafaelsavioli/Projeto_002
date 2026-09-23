# Deployment

## Local (development)

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Frontend proxies `/api/*` → `http://localhost:4000`.

## Production sketch (Node + static)

1. **Backend**
   ```bash
   cd backend
   npm ci
   npx prisma generate
   npx prisma migrate deploy   # uses DATABASE_URL
   NODE_ENV=production npm start
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm ci
   npm run build               # outputs dist/
   ```
   Serve `dist/` from nginx/Caddy/CDN. Proxy `/api` to the Node process.

### Environment variables (backend)

| Variable | Required | Notes |
| --- | --- | --- |
| `PORT` | no | default `4000` |
| `JWT_SECRET` | **yes** | 32+ random bytes |
| `JWT_EXPIRES_IN` | no | e.g. `7d` |
| `DATABASE_URL` | **yes** | SQLite path or Postgres URL |
| `RATE_LIMIT_MAX` | no | default 300 / 15 min |
| `AUTH_RATE_LIMIT_MAX` | no | default 20 / 15 min |

### Checklist before going live

- [ ] Strong `JWT_SECRET` (not the `.env.example` value)
- [ ] HTTPS termination at reverse proxy
- [ ] Restrict CORS to your frontend origin
- [ ] PostgreSQL for multi-instance durability
- [ ] Backups for the database volume
- [ ] `npm run lint` + `npm run build` green in CI

## Docker (optional path)

A minimal production image can:

1. Build frontend in a `node:22-alpine` stage
2. Copy `dist/` into an nginx image **or** serve via `serve -s`
3. Run backend as a separate container with Prisma migrate on boot

> Not bundled yet — tracked on the roadmap.
