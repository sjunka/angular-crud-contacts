# Customer Portal

A customer manager built with modern Angular. **Angular 20 · TypeScript strict · Signals · Standalone components · SCSS design tokens**.

Add, edit, search, and delete customers. Reactive throughout, styled with a Nike-inspired design system.

> **Reviewers:** Start with the [**CTO brief**](CTO-BRIEF.md) — one page, targets plus evidence plus decisions. Or open `/aboutme` in the running app for a plain-English walkthrough.

## Features

- **Full CRUD** — create, read, update, delete customers
- **Search, filter, paginate** — find by name or email, filter by status, page through results
- **Signal-driven** — the screen updates itself when data changes, no manual refresh
- **Reusable components** — one pill button, status badge, and form field, shared across pages
- **Typed reactive form** — required, email, and phone rules with inline errors, plus a unique-email check
- **Nike design system** — black ink on white, one soft gray, red kept for danger only
- **Fast by default** — OnPush change detection and lazy-loaded routes
- **Deployed** — live on GitHub Pages, redeploys on every push

## Live

**https://sjunka.github.io/angular-crud-contacts/**

The `/aboutme` route inside the app explains how everything works for someone new to Angular.

## Quick Start

```bash
git clone https://github.com/sjunka/angular-crud-contacts.git
cd angular-crud-contacts
npm install

npm start        # dev server at http://localhost:4200
npm run build    # production build
npm test         # unit tests (headless Chrome)
```

---

## How It Works

### Customers list
Shows customer cards. A search box filters by name or email. Status chips filter by active or inactive. When there are more than one page of results, a pager appears. Each card has Edit and Delete. Delete asks first.

### Add / edit form
One form does both jobs. It checks each field as you type: names required, a valid email shape, a phone pattern. Bad input blocks Save and shows a message under the field. The store adds one more rule: no two customers can share an email.

### About page
A guided tour at `/aboutme`. It explains the files, the components, signals, the fake API, routing, and forms in plain words, for someone who has not used Angular before.

---

## Architecture

Organized by responsibility:

```
src/
├── app/
│   ├── app.ts                    # Shell: top nav + where pages render
│   ├── app.routes.ts             # URL to page map (lazy-loaded)
│   ├── customer.ts               # Customer type
│   ├── customer-store.ts         # Data + CRUD + search/filter/paging (the fake backend)
│   │
│   ├── customers/
│   │   ├── customer-list.ts      # Grid, search, filter chips, pager
│   │   └── customer-form.ts      # Add / edit with validation
│   │
│   ├── components/               # Reusable, presentational UI
│   │   ├── button.ts             # Nike pill; renders <a> or <button>
│   │   ├── status-badge.ts       # Active / inactive label
│   │   └── text-field.ts         # Labelled input with inline error
│   │
│   └── aboutme/
│       └── about-me.ts           # In-app technical overview
│
└── styles.scss                   # Design tokens: colors, spacing, fields
```

### Design decisions

**Signal store:** One `CustomerStore` holds the data and the CRUD logic. The pages read from it. When a signal changes, the screen redraws itself.

**Fake backend, no extra deps:** The store is an in-memory list with a small delay added, so loading states behave like a real service. Swapping in `HttpClient` later touches only this file.

**Reusable components:** The button, badge, and field live in `components/` and get reused everywhere. No duplicated markup or styles.

**Reactive forms:** The form lives in code as data. That makes validation easy and fully typed.

**Design tokens:** Every color, spacing step, and button shape comes from `styles.scss`. Reusing tokens is why the app looks like one product.

**Performance:** OnPush change detection plus lazy routes. The app starts small and only redraws what changed.

### Data flow

```
User acts (type, click, submit)
    ↓
Component calls the store
    ↓
CustomerStore updates a signal
    ├─ create / update / remove change the list
    └─ search / filter / page change what's visible
    ↓
computed() recalculates the visible page
    ↓
Screen redraws automatically (OnPush)
```

---

## Code Examples

### The store (data + CRUD)

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerStore {
  private readonly all = signal<Customer[]>(seed());

  readonly search = signal('');
  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    return this.all().filter((c) =>
      `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q),
    );
  });

  async create(draft: CustomerDraft): Promise<void> {
    await this.latency();
    this.assertUniqueEmail(draft.email, null);
    const customer = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.all.update((list) => [customer, ...list]);
  }
}
```

**Why:** One source of truth. `filtered` recomputes on its own whenever the list or the search text changes.

### A reusable component

```typescript
@Component({
  selector: 'app-button',
  template: `
    @if (link()) {
      <a class="pill" [class]="cls()" [routerLink]="link()"><ng-content /></a>
    } @else {
      <button class="pill" [class]="cls()" (click)="clicked.emit()"><ng-content /></button>
    }
  `,
})
export class Button {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  link = input<string | unknown[]>();
  clicked = output<void>();
  cls = computed(() => `pill--${this.variant()}`);
}
```

**Why:** One button covers every case. Pass a `link` and it renders a router link; otherwise it emits a click. Inputs are read with `()` because they are signals.

### Typed reactive form

```typescript
readonly form = this.fb.nonNullable.group({
  firstName: ['', [Validators.required, Validators.maxLength(50)]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s()-]{6,}$/)]],
  status: ['active' as 'active' | 'inactive', Validators.required],
});
```

**Why:** The form is data in code, so validation is typed and easy to reason about. Errors show under each field as the user types.

---

## Verification

Checked on the dev server and in CI:

- ✅ Build passes with zero TypeScript errors (strict mode)
- ✅ Four unit tests pass in headless Chrome
- ✅ Create, edit, delete, search, filter, and paging all work
- ✅ Duplicate email is rejected with a clear message
- ✅ Deep links survive a refresh on GitHub Pages (404 fallback)
- ✅ Every push to `main` redeploys the live site

---

## To Ship

Replace the fake pieces with real ones:

1. **Backend** — `HttpClient` behind the same store API
2. **Auth** — login screen, route guard, token
3. **Server-side list** — search and paging on the server for large data
4. **Optimistic updates** — apply changes instantly, roll back on error
5. **End-to-end tests** — cover the main flows

---

## Stack

- **Angular 20** — standalone components, signals, native control flow
- **TypeScript** — strict mode
- **Angular Router** — lazy-loaded routes
- **Reactive Forms** — typed, with custom validators
- **SCSS** — design tokens, no UI framework
- **Karma + Jasmine** — unit tests
- **GitHub Actions + Pages** — build and deploy

---

## Files

**Documentation:**
- [CTO-BRIEF.md](CTO-BRIEF.md) — one page (targets, feedback, decisions)
- [CLAUDEM.md](CLAUDEM.md) — development and writing guidelines
- `/aboutme` — in-app technical overview

**Code:**
- `src/app/customer-store.ts` — data and CRUD
- `src/app/customers/` — list and form pages
- `src/app/components/` — reusable UI
- `src/styles.scss` — design tokens

---

**GitHub:** https://github.com/sjunka/angular-crud-contacts
