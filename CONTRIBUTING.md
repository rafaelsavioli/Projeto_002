# Contributing

Thanks for your interest in FluxoBoard.

## Development workflow

1. Fork and clone the repository.
2. Create a feature branch: `git checkout -b feat/short-description`
3. Install dependencies in `backend/` and `frontend/`.
4. Make focused commits using [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat(scope): ...`
   - `fix(scope): ...`
   - `docs(scope): ...`
   - `chore(scope): ...`
   - `perf(scope): ...`
   - `ci(scope): ...`
5. Run linters before pushing:
   ```bash
   npm run lint --prefix backend
   npm run lint --prefix frontend
   npm run build --prefix frontend
   ```
6. Open a pull request against `main` with a clear description of the change.

## Architecture guidelines

- Backend: routes → controller (HTTP) → service (business rules + Prisma). Keep Prisma out of controllers.
- Frontend: API wrappers in `src/api`, page-level UI in `src/pages`, reusable pieces in `src/components`.
- Validate all mutating input with Zod on the server; never trust client payloads.
- Prefer small PRs that pass CI (`lint` + `build`).

## Reporting issues

Open a GitHub issue with steps to reproduce, expected vs actual behavior, and environment details (OS, Node version).
