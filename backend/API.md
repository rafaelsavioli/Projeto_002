# FluxoBoard API

Base URL: `http://localhost:4000`

All routes except `/health` and `/auth/register|login` require:

```
Authorization: Bearer <token>
```

## Auth

### POST /auth/register
```json
{ "name": "Ada", "email": "ada@example.com", "password": "secret123" }
```
→ `201 { user, token }` (seeds default categories)

### POST /auth/login
```json
{ "email": "ada@example.com", "password": "secret123" }
```
→ `200 { user, token }`

### GET /auth/me
→ `200 { user }`

## Transactions

### GET /transactions
Query: `month=YYYY-MM`, `type=INCOME|EXPENSE`, `status=PLANNED|PENDING|PAID|OVERDUE`, `categoryId`, `q`

### POST /transactions
```json
{
  "title": "Groceries",
  "amount": 42.5,
  "type": "EXPENSE",
  "status": "PENDING",
  "date": "2026-09-23T12:00:00.000Z",
  "categoryId": "clx...",
  "note": null
}
```

### PATCH /transactions/:id
Partial update of the same fields.

### PATCH /transactions/:id/move
```json
{ "status": "PAID" }
```
Used by the Kanban board.

### DELETE /transactions/:id

## Categories / Goals

REST: `GET|POST /categories`, `PATCH|DELETE /categories/:id`  
REST: `GET|POST /goals`, `PATCH|DELETE /goals/:id`

Goal create body:
```json
{ "name": "Emergency fund", "targetAmount": 15000, "currentAmount": 0, "deadline": null }
```

## Dashboard

### GET /dashboard/summary?month=YYYY-MM
Returns month income/expense/balance, status counts, expense breakdown by category, six-month series, recent transactions and goal progress.
