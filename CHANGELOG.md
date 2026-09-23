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
- REST API reference (`backend/API.md`)
- Contributing guide and security policy
- Dependency-free unit tests for money/date helpers
- Rollup manual chunks for charts, dnd-kit and vendor code

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
