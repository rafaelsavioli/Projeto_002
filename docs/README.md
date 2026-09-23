# FluxoBoard

Personal finance dashboard with a Kanban payment board.

![CI](https://github.com/rafaelsavioli/Projeto_002/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/rafaelsavioli/Projeto_002/actions/workflows/codeql.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green)

## Quick start

```bash
# Backend
cd backend && npm install && npx prisma migrate dev && npm run seed && npm run dev

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

Open http://localhost:5173 — demo login: `demo@fluxoboard.dev` / `demo1234`

## Documentation

| Doc | Contents |
| --- | --- |
| [README](../README.md) | Features, stack, architecture, API table, roadmap |
| [backend/API.md](../backend/API.md) | REST endpoint reference |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Commit style, PR workflow |
| [SECURITY.md](../SECURITY.md) | Vulnerability reporting, hardening checklist |
| [CHANGELOG.md](../CHANGELOG.md) | Release history |
| [docs/adr.md](./adr.md) | Architecture decision records |
| [docs/deployment.md](./deployment.md) | Production deploy guide |

## Structure

```
Projeto_002/
├── backend/     Express + Prisma + JWT (modular layers)
├── frontend/    React + Vite + Tailwind + Recharts + dnd-kit
├── docs/        ADRs and deployment guide
└── .github/     CI, CodeQL, release workflows
```

## License

MIT © Rafael Savioli
