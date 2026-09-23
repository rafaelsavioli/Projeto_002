# Backend testing plan

Current suite: dependency-free Node assert scripts via `npm run test:unit` (money + date helpers), run in CI after lint.

## Layers to cover

| Layer | Tooling | Status |
| --- | --- | --- |
| Unit (utils, pure service helpers) | `node:assert` | ✅ money, dates |
| Integration (Express + Prisma) | supertest + isolated SQLite file | Planned |
| Contract / smoke | script hitting `/health` + auth flow | Manual smoke exists |

## Integration approach

1. Spin up `app` from `src/app.js` with `DATABASE_URL=file:./test.db`  
2. Run `prisma migrate deploy` against the test file before suite  
3. Use `supertest` against `app.listen(0)`  
4. Seed a throwaway user per suite; assert ownership isolation  

Example outline:

```js
const request = require('supertest');
const { app } = require('../app');

let token;

before(async () => {
  const res = await request(app)
    .post('/auth/register')
    .send({ name: 'T', email: 't@example.com', password: 'pass1234' });
  token = res.body.token;
});

it('rejects cross-user bulk-move', async () => {
  await request(app)
    .post('/transactions/bulk-move')
    .set('Authorization', `Bearer ${token}`)
    .send({ ids: ['not-mine'], status: 'PAID' })
    .expect(404);
});
```

## Priority cases

- **Auth:** weak password rejected; duplicate email; `/auth/me` without token → 401  
- **Transactions:** amount ≤ 0 rejected; list filters; move status enum  
- **Bulk-move:** empty ids → 400; mixed ownership → 404; happy path count  
- **Goals:** contribution never exceeds `targetAmount`; deadline null OK  
- **Dashboard:** empty month returns zeros without throwing  

## Runner (when adopted)

```json
{
  "scripts": {
    "test:integration": "node --test test/integration"
  }
}
```

Or migrate unit scripts to `node --test` for free parallel reporting.

## CI note

Integration tests need Prisma generate + migrate in the job; keep them on a separate job if they push total runtime past ~2 minutes.
