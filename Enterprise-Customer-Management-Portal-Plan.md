# Enterprise Customer Management Portal

## Overview
A senior-level Angular 20 CRUD application demonstrating modern Angular architecture, Domain-Driven Design (DDD), Event-Driven Architecture (EDA), Signals, RxJS, standalone components, lazy loading, responsive UI, and simulated REST APIs.

## Tech Stack
- Angular 20+
- TypeScript 5+
- Standalone Components
- Angular Signals
- RxJS
- Angular Material + CDK
- SCSS
- angular-in-memory-web-api (or json-server)
- Google Analytics 4
- ESLint + Prettier + Husky
- ngx-translate
- Chart.js

## Create the Project
```bash
npm install -g @angular/cli

ng new enterprise-portal \
  --routing \
  --style=scss \
  --standalone \
  --ssr=false

cd enterprise-portal
```

## Install Dependencies
```bash
npm install @angular/material @angular/cdk @angular/google-analytics \
angular-in-memory-web-api uuid lodash-es date-fns ngx-toastr \
ngx-spinner @ngx-translate/core @ngx-translate/http-loader zod \
class-transformer chart.js
```

## Folder Structure
```text
src/
  app/
    core/
      api/
      analytics/
      guards/
      interceptors/
      services/
    shared/
      components/
      directives/
      pipes/
      models/
    domains/
      customers/
        domain/
        application/
        infrastructure/
        presentation/
      products/
      orders/
    layout/
    app.routes.ts
```

## Architecture
Presentation → Application → Domain → Infrastructure

- Domain contains business rules only.
- Application contains use cases.
- Infrastructure contains HTTP implementations.
- Presentation contains Angular components/pages.

## CRUD
Entity: Customer

Fields:
- id
- firstName
- lastName
- email
- phone
- status
- createdAt

Features:
- Create
- Read
- Update
- Delete
- Search
- Pagination
- Sorting
- Filtering

## Fake Backend
Use `angular-in-memory-web-api`.

Simulate:
- GET/POST/PUT/DELETE
- Delays
- Validation errors
- 404/500 responses

## Event-Driven Architecture
Create an EventBus.

Events:
- CustomerCreated
- CustomerUpdated
- CustomerDeleted
- OrderCreated

Subscribers:
- AnalyticsService
- NotificationService
- LoggerService

## Signals
Use Signals for:
- loading
- customers
- selectedCustomer
- filters
- pagination
- theme

Computed:
- filteredCustomers
- activeCustomers
- customerCount

## RxJS
Use:
- switchMap
- combineLatest
- forkJoin
- debounceTime
- distinctUntilChanged
- retry
- catchError
- shareReplay
- tap

## Routing
- /
- /dashboard
- /customers
- /customers/new
- /customers/:id
- /customers/:id/edit
- /settings

Use lazy loading.

## Authentication
Fake JWT in sessionStorage.
Guards:
- AuthGuard
- RoleGuard

## HTTP
Interceptors:
- Auth
- Logging
- Error

## UI
- Angular Material
- Responsive
- Dark Mode
- Toasts
- Skeleton loaders
- Breadcrumbs
- Confirmation dialogs
- Empty states

## Dashboard
Charts:
- Customers by status
- Monthly registrations
- Revenue
- Orders

## Google Analytics
Track:
- Page views
- Login/Logout
- Customer CRUD
- Search
- Filters

## Performance
- OnPush
- Signals
- @if/@for/@switch/@defer
- trackBy
- Lazy loading

## Validation
Typed Reactive Forms.
Custom + async validators.

## Testing
- Unit tests
- CRUD integration tests
- Optional Cypress

## Git
Branches:
- main
- develop
- feature/*
- release
- hotfix

Conventional Commits.

## Stretch Goals
- CSV import/export
- PWA
- IndexedDB offline mode
- Docker
- GitHub Actions
- Sentry
- Feature flags
- i18n
- Optimistic updates

## Roadmap
1. Scaffold project.
2. Configure Angular Material, linting and formatting.
3. Build folder structure.
4. Implement fake backend.
5. Build Customer domain.
6. Implement CRUD.
7. Add dashboard.
8. Add authentication.
9. Add analytics.
10. Polish, test and document.
