# Customer Portal — CTO Brief

One page: focus, feedback, and decisions. No digging needed.

---

## 1 · Focus — success areas

| Success | Measure | Target |
|---|---|---|
| Modern Angular | Framework patterns used | v20 standalone components, signals, native control flow |
| Reactive state | How the screen stays in sync | Signals + computed, no manual refresh |
| Type safety | TypeScript compilation errors | Zero, strict mode |
| Clean structure | Separation of concerns | Store, models, pages, shared components isolated |
| Reusable UI | Duplicated markup | None; shared button, badge, and field components |
| Forms | Validation quality | Typed reactive form, rules run as you type |
| Hosting | Public, automatic deploys | GitHub Pages via Actions on every push |
| Docs | Clarity for the next developer | README, this brief, an in-app overview page |

## 2 · Feedback — actuals vs targets

| Measure | Result | Status |
|---|---|---|
| Angular version | **v20 standalone** — no NgModules, components stand alone | ✅ |
| State | **Signal store** — one `CustomerStore` drives list, filters, paging | ✅ |
| Types | **Zero errors** — strict mode passes, customers fully typed | ✅ |
| Fake backend | **In-memory store** — seeded data, faked latency, unique-email check | ✅ |
| Reusable UI | **Three components** — button, status-badge, text-field, used across pages | ✅ |
| Forms | **Typed reactive form** — required, email, and phone rules with inline errors | ✅ |
| Performance | **OnPush + lazy routes** — each page loads its own code on first visit | ✅ |
| Tests | **Four passing** — store create/update/delete, duplicate guard, filters, shell | ✅ |
| Live site | **Deployed** — https://sjunka.github.io/angular-crud-contacts/ | ✅ |

## 3 · Decisions

**Why this architecture:**

- **Signal store** — one place holds the data and the CRUD logic; the pages just read it. The screen updates itself when a signal changes.
- **No REST backend yet** — `CustomerStore` fakes it with an in-memory list and a small delay, so loading states behave like the real thing. Swapping in `HttpClient` later touches this one file.
- **Reusable components** — the pill button, status badge, and form field live in `components/` and get reused. No copy-pasted markup.
- **Reactive forms** — the form lives in code as data, so validation is easy and typed. Bad input blocks Save and shows a message under the field.
- **Nike design tokens** — every color, spacing step, and button shape comes from one set of variables in `styles.scss`. The whole app looks like one product.
- **Lazy routes + OnPush** — the app starts small and only redraws components that changed.

**Known limits:**

- No real backend (in-memory store, resets on reload)
- No auth (the plan listed fake JWT and guards; skipped as out of scope for a CRUD demo)
- Single entity (customers only; the plan's products and orders were not built)
- No charts or analytics dashboard
- Ten seeded customers

**If shipping tomorrow:**

1. Real backend (`HttpClient` behind the same store API)
2. Auth (login screen, route guard, token)
3. Server-side search and paging for large lists
4. Optimistic updates with rollback on error
5. End-to-end tests for the main flows

---

**Code tour:** [`src/app/customer-store.ts`](src/app/customer-store.ts) (data + CRUD) → [`src/app/customers/customer-list.ts`](src/app/customers/customer-list.ts) (list, search, paging) → [`src/app/customers/customer-form.ts`](src/app/customers/customer-form.ts) (add/edit) → [`src/app/components/`](src/app/components) (shared UI) → visit `/aboutme` in the app for a guided walkthrough.

**Why signals:** The list depends on the search text, the status filter, and the page number. With signals, changing any one recomputes the visible list on its own. No event wiring, no manual refresh.

**Why a fake store instead of a mock HTTP library:** Fewer moving parts. The store is the backend and the state at once, with zero extra dependencies. The public shape (methods and signals) is what a real service would expose, so the rest of the app never learns the data is fake.

**Testing:** `npm test` runs four unit tests in headless Chrome. They prove the store creates, updates, and deletes a customer, rejects a duplicate email, and filters correctly.
