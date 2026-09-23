# Architecture Decision Records

Lightweight ADRs for FluxoBoard. Newest first.

## ADR-004 — SQLite first, PostgreSQL later

**Status:** Accepted  
**Context:** Portfolio project needs zero-setup local development.  
**Decision:** Use SQLite via Prisma for v1; document a migration path to PostgreSQL.  
**Consequences:** Instant onboarding; production deploys must switch the datasource URL and run migrations again.

## ADR-003 — Feature modules over layer-only folders

**Status:** Accepted  
**Context:** Pure `controllers/` + `services/` trees scatter related files.  
**Decision:** Group by feature (`modules/auth`, `modules/transactions`, …) with routes → controller → service inside each.  
**Consequences:** Easier navigation and ownership; cross-module calls go through service exports only.

## ADR-002 — JWT in localStorage

**Status:** Accepted  
**Context:** SPA + REST without cookies/CORS complexity.  
**Decision:** Store JWT in `localStorage` and attach via Axios interceptor; clear on 401.  
**Consequences:** Simple integration; XSS risk mitigated by careful rendering (React escapes by default). Revisit for httpOnly cookies if SSR is added.

## ADR-001 — Monorepo with separate frontend/backend packages

**Status:** Accepted  
**Context:** Two runtimes (browser + Node) with different toolchains.  
**Decision:** Single git repo, `frontend/` and `backend/` each with their own `package.json`.  
**Consequences:** Atomic cross-stack commits; root scripts orchestrate lint/build; independent dependency upgrades.
