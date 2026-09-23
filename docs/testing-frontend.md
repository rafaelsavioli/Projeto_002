# Frontend testing plan

FluxoBoard frontend is intentionally lean on test deps today (lint + production build in CI). Recommended path when adding tests:

## Recommended stack

| Tool | Role |
| --- | --- |
| [Vitest](https://vitest.dev/) | Unit/intest runner (same Vite pipeline) |
| [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) | Component behavior tests |
| [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) | Click/type/keyboard flows |
| MSW (Mock Service Worker) | API mocking without hitting the backend |

## Priority targets

1. **Auth flow** — login form validation, token storage, redirect on 401  
2. **Transactions table** — filters update list; empty state when no results  
3. **Kanban** — status badge rendering; optimistic move + rollback on API error  
4. **Bulk actions** — select all / toggle / apply disabled when empty  
5. **Goals** — progress percentage math and contribution button bounds  

## Example (Vitest)

```js
// src/pages/__tests__/BulkActions.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../../context/ToastContext';
import BulkActions from '../BulkActions';

// mock ../api/bulk.api and transactions.api with vi.mock(...)
```

## Scripts (when adopted)

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

CI: add `npm run test --prefix frontend` after lint, before build.

## Not covered today

- Visual regression (Playwright screenshots)  
- Full E2E login → create transaction → drag Kanban → bulk move  

Keep unit tests fast (<2s); reserve Playwright for a separate workflow if needed.
