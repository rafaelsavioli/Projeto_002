# Roadmap

## Shipped (v1.0)

- [x] JWT auth + demo seed
- [x] Transactions CRUD with filters
- [x] Kanban drag-and-drop statuses
- [x] Savings goals + contributions
- [x] Dashboard summary (cards, cash flow, donut)
- [x] CI (lint, unit tests, build), CodeQL, release workflow
- [x] Rate limiting, request logger, security headers
- [x] Bulk-move API + Bulk actions page
- [x] Docs: API, ADRs, deployment, performance, testing plans

## Near term

- [ ] Frontend Vitest + Testing Library suite (see [testing-frontend.md](./testing-frontend.md))
- [ ] Backend integration tests with supertest (see [testing-backend.md](./testing-backend.md))
- [ ] Recurring transactions (monthly templates)
- [ ] CSV import/export
- [ ] Multi-currency display preferences
- [ ] Dark mode toggle

## Later

- [ ] PostgreSQL migration path + docker-compose
- [ ] httpOnly cookie sessions (see ADR-002 revisit)
- [ ] Collaborative budgets / shared households
- [ ] PWA offline shell for read-only board
- [ ] Playwright E2E critical path

## Explicit non-goals

- Native mobile apps (responsive web only for v1)
- Bank aggregation / open-finance integrations
- Crypto portfolios
