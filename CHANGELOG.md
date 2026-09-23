# Changelog

All notable changes to FluxoBoard are documented here.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- MIT license and root workspace scripts
- GitHub Actions CI (lint backend/frontend, production build)
- Release workflow for tagged frontend builds
- CodeQL security analysis workflow
- Request logging middleware
- In-memory rate limiting (global + stricter for `/auth`)
- REST API reference (`backend/API.md`)
- Contributing guide, security policy and changelog
- Dependency-free unit tests for money/date helpers
- Rollup manual chunks for charts, dnd-kit and vendor code
- ErrorBoundary, EmptyState and Spinner UI primitives
- Toast feedback on transaction and goal CRUD actions
- Responsive mobile sidebar drawer
- Auth password complexity (letter + number) and sanitize helpers
- Document titles per page via `useDocumentTitle`

### Fixed
- Restored `requestLogger` module after rate-limit refactor
- ESLint config format for backend

## [1.0.0] - 2026-09-23

### Added
- JWT authentication (register, login, protected routes)
- Transactions CRUD with month/type/status/category/text filters
- Kanban board with drag-and-drop status updates (Planned, Pending, Paid, Overdue)
- Savings goals with progress tracking and quick contributions
- Dashboard overview: balance/income/expense cards, 6-month cash flow chart, expense donut by category
- Prisma + SQLite schema (User, Category, Transaction, Goal) with seed data
- React 18 + Vite 6 + Tailwind SaaS light theme
- Portfolio README with architecture and setup guide
