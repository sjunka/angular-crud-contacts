import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerStore } from '../customer-store';
import { Customer } from '../customer';

@Component({
  selector: 'app-customer-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="head">
      <div>
        <h1>CUSTOMERS</h1>
        <p class="sub">{{ store.count() }} total · {{ store.activeCount() }} active</p>
      </div>
      <a class="pill pill--primary" routerLink="/customers/new">Add customer</a>
    </header>

    <div class="controls">
      <input
        class="field search"
        type="search"
        placeholder="Search name or email"
        aria-label="Search customers"
        [value]="store.search()"
        (input)="onSearch($event)"
      />
      <div class="chips" role="group" aria-label="Filter by status">
        @for (opt of statuses; track opt.value) {
          <button
            class="chip"
            [class.chip--active]="store.statusFilter() === opt.value"
            [attr.aria-pressed]="store.statusFilter() === opt.value"
            (click)="store.statusFilter.set(opt.value); store.page.set(1)"
          >
            {{ opt.label }}
          </button>
        }
      </div>
    </div>

    @if (store.paged().length === 0) {
      <p class="empty">No customers match your search.</p>
    } @else {
      <ul class="grid">
        @for (c of store.paged(); track c.id) {
          <li class="card">
            <span class="status" [class.status--off]="c.status === 'inactive'">{{ c.status }}</span>
            <h2 class="name">{{ c.firstName }} {{ c.lastName }}</h2>
            <p class="meta">{{ c.email }}</p>
            <p class="meta">{{ c.phone }}</p>
            <div class="actions">
              <a class="pill pill--secondary pill--sm" [routerLink]="['/customers', c.id, 'edit']">Edit</a>
              <button class="pill pill--danger pill--sm" (click)="confirmDelete(c)" [disabled]="store.loading()">
                Delete
              </button>
            </div>
          </li>
        }
      </ul>

      @if (store.pageCount() > 1) {
        <nav class="pager" aria-label="Pagination">
          <button class="pill pill--secondary pill--sm" [disabled]="store.page() <= 1" (click)="store.page.set(store.page() - 1)">
            Prev
          </button>
          <span class="pageno">{{ store.page() }} / {{ store.pageCount() }}</span>
          <button class="pill pill--secondary pill--sm" [disabled]="store.page() >= store.pageCount()" (click)="store.page.set(store.page() + 1)">
            Next
          </button>
        </nav>
      }
    }
  `,
  styles: `
    :host { display: block; max-width: 1080px; margin: 0 auto; padding: var(--sp-section) var(--sp-xl); }
    .head { display: flex; justify-content: space-between; align-items: flex-end; gap: var(--sp-lg); margin-bottom: var(--sp-xl); }
    h1 { font-size: 40px; letter-spacing: -0.5px; }
    .sub { color: var(--mute); margin: var(--sp-xs) 0 0; }
    .controls { display: flex; gap: var(--sp-md); flex-wrap: wrap; margin-bottom: var(--sp-xl); }
    .search { max-width: 320px; }
    .chips { display: flex; gap: var(--sp-sm); }
    .chip { height: 40px; padding: 0 16px; border: 1px solid var(--hairline); background: var(--canvas); color: var(--ink);
      border-radius: var(--r-lg); font: inherit; font-weight: 500; cursor: pointer; text-transform: capitalize; transition: all 120ms ease; }
    .chip--active { background: var(--ink); color: var(--on-primary); border-color: var(--ink); }
    .chip:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
    .grid { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--sp-md);
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    .card { background: var(--soft-cloud); padding: var(--sp-xl); display: flex; flex-direction: column; gap: var(--sp-xs);
      animation: rise 240ms ease both; }
    .status { align-self: flex-start; font-size: 12px; font-weight: 500; text-transform: uppercase;
      color: var(--success); letter-spacing: 0.5px; }
    .status--off { color: var(--stone); }
    .name { font-size: 20px; margin-top: var(--sp-xs); }
    .meta { color: var(--mute); margin: 0; font-size: 14px; }
    .actions { display: flex; gap: var(--sp-sm); margin-top: var(--sp-md); }
    .pager { display: flex; align-items: center; gap: var(--sp-md); justify-content: center; margin-top: var(--sp-xl); }
    .pageno { font-weight: 500; }
    .empty { color: var(--mute); padding: var(--sp-section) 0; text-align: center; }
    @keyframes rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  `,
})
export class CustomerList {
  readonly store = inject(CustomerStore);
  readonly statuses = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ] as const;

  onSearch(e: Event) {
    this.store.search.set((e.target as HTMLInputElement).value);
    this.store.page.set(1);
  }

  async confirmDelete(c: Customer) {
    if (!confirm(`Delete ${c.firstName} ${c.lastName}?`)) return;
    await this.store.remove(c.id);
  }
}
