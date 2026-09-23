# FluxoBoard

**Personal finance dashboard with a Kanban payment board.**  
Track income and expenses, drag transactions between status columns, and hit savings goals — built with **React + Node.js**.

> Part of a portfolio series exploring full-stack architecture patterns.

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Stack](https://img.shields.io/badge/Node.js-Express-339933?logo=express&logoColor=white)
![Stack](https://img.shields.io/badge/Prisma-SQLite-2D3748?logo=prisma&logoColor=white)
![Stack](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwindcss&logoColor=white)
![CI](https://github.com/rafaelsavioli/Projeto_002/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/rafaelsavioli/Projeto_002/actions/workflows/codeql.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

| Module | Highlights |
| --- | --- |
| **Overview** | Month picker, balance / income / expense cards, 6-month cash flow chart, expense donut by category, recent activity |
| **Transactions** | Full CRUD, filters (month, type, status, category, text search), modal form |
| **Kanban** | Drag & drop between **Planned → Pending → Paid → Overdue**, optimistic updates, column totals |
| **Goals** | Savings targets with progress bars, quick ±$50 contributions, deadlines |
| **Auth** | JWT register/login, protected routes, demo seed account |

## Tech stack

**Frontend**

- Vite 6 + React 18
- Tailwind CSS (light SaaS theme)
- React Router 6 (protected routes)
- Recharts (area + donut)
- @dnd-kit (accessible drag and drop)
- Axios with JWT interceptor

**Backend**

- Node.js + Express 4 (modular layered architecture)
- Prisma ORM + SQLite
- JWT auth (`bcryptjs` + `jsonwebtoken`)
- Zod request validation
- Centralized error handler

### Architecture

```
backend/src/
├── config/          # env, prisma client
├── middlewares/     # auth, validate, errorHandler
├── modules/         # feature slices: routes → controller → service
│   ├── auth/
│   ├── transactions/
│   ├── categories/
│   ├── goals/
│   └── dashboard/
└── utils/           # AppError, date helpers

frontend/src/
├── api/             # axios client + resource wrappers
├── components/      # layout · ui · charts · kanban · transactions
├── context/         # AuthContext
├── pages/           # route-level screens
└── routes/          # ProtectedRoute
```

Each backend module owns its schema (Zod), controller (HTTP only), and service (business rules + Prisma).

## Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env       # adjust JWT_SECRET for production
npx prisma migrate dev
npm run seed               # demo data
npm run dev                # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173 (proxies /api → :4000)
```

### Demo account

```
email:    demo@fluxoboard.dev
password: demo1234
```

## API overview

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | — | Create account + default categories |
| POST | `/auth/login` | — | Get JWT |
| GET | `/auth/me` | ✓ | Current user |
| GET | `/transactions` | ✓ | List + filters (`month`, `type`, `status`, `categoryId`, `q`) |
| POST | `/transactions` | ✓ | Create |
| PATCH | `/transactions/:id` | ✓ | Update |
| PATCH | `/transactions/:id/move` | ✓ | Kanban status move |
| DELETE | `/transactions/:id` | ✓ | Delete |
| GET/POST/PATCH/DELETE | `/categories`, `/goals` | ✓ | Resource CRUD |
| GET | `/dashboard/summary` | ✓ | Aggregated month metrics + 6-month series |

## Roadmap

- [ ] Dark mode toggle
- [ ] CSV export
- [ ] Recurring transactions
- [ ] Multi-currency
- [x] GitHub Actions CI (lint + build)
- [ ] PostgreSQL for production deploys
- [ ] E2E tests with Playwright

## Project docs

- [API reference](./backend/API.md)
- [Contributing](./CONTRIBUTING.md)
- [Security policy](./SECURITY.md)
- [Changelog](./CHANGELOG.md)
- [Architecture decisions](./docs/adr.md)
- [Deployment guide](./docs/deployment.md)

## License

MIT
