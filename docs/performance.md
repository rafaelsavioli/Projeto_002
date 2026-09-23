# Performance notes

## Frontend

| Area | Approach | Result |
| --- | --- | --- |
| Bundle size | Rollup `manualChunks` for `recharts`, `@dnd-kit/*`, React/router/axios | Better long-term caching; charts load as a separate chunk |
| Rendering | Page-level components; no global state for high-frequency data | Keeps re-renders local |
| Network | Single `/dashboard/summary` aggregates cards + charts + recents | Fewer round-trips vs per-widget endpoints |

Measure locally:

```bash
cd frontend && npm run build
# inspect dist/assets/*.js chunk names and sizes
```

## Backend

| Area | Approach |
| --- | --- |
| Aggregations | One SQL pass for month summary + separate 6-month query |
| Indexes | `Transaction(userId, date)` and `Transaction(userId, status)` |
| Rate limiting | In-memory Map (no Redis dependency for single instance) |
| Bulk updates | `updateMany` for multi-id Kanban moves |
| Seed | Upserts demo user so re-seed is idempotent |

## Known trade-offs

- **localStorage JWT** — simple, vulnerable to XSS; acceptable for portfolio SPA (see ADR-002).
- **SQLite** — great DX, single-writer limits; migrate to Postgres for multi-instance (ADR-004).
- **In-memory rate limit** — resets on restart and is per-process; add Redis if you scale horizontally.
