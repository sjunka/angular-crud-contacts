import { Injectable, computed, signal } from '@angular/core';
import { Customer, CustomerDraft } from './customer';

const PAGE_SIZE = 8;

/** In-memory customer store with signals. Replaces a REST backend:
 *  seeded data + simulated latency, no extra deps.
 *  ponytail: swap the private array for an HttpClient later — the public
 *  signal API (customers/loading/paged/create/update/remove) stays the same. */
@Injectable({ providedIn: 'root' })
export class CustomerStore {
  private readonly all = signal<Customer[]>(seed());

  readonly loading = signal(false);
  readonly search = signal('');
  readonly statusFilter = signal<'all' | Customer['status']>('all');
  readonly page = signal(1);

  readonly filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    return this.all().filter((c) => {
      if (status !== 'all' && c.status !== status) return false;
      if (!q) return true;
      return `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q);
    });
  });

  readonly total = computed(() => this.filtered().length);
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));

  readonly paged = computed(() => {
    const start = (this.clampedPage() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  readonly activeCount = computed(() => this.all().filter((c) => c.status === 'active').length);
  readonly count = computed(() => this.all().length);

  private clampedPage() {
    return Math.min(this.page(), this.pageCount());
  }

  byId(id: string): Customer | undefined {
    return this.all().find((c) => c.id === id);
  }

  async create(draft: CustomerDraft): Promise<void> {
    await this.latency();
    this.assertUniqueEmail(draft.email, null);
    const customer: Customer = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    this.all.update((list) => [customer, ...list]);
  }

  async update(id: string, draft: CustomerDraft): Promise<void> {
    await this.latency();
    this.assertUniqueEmail(draft.email, id);
    this.all.update((list) => list.map((c) => (c.id === id ? { ...c, ...draft } : c)));
  }

  async remove(id: string): Promise<void> {
    await this.latency();
    this.all.update((list) => list.filter((c) => c.id !== id));
  }

  private assertUniqueEmail(email: string, exceptId: string | null) {
    const clash = this.all().some(
      (c) => c.id !== exceptId && c.email.toLowerCase() === email.toLowerCase(),
    );
    if (clash) throw new Error('A customer with that email already exists.');
  }

  private async latency() {
    this.loading.set(true);
    try {
      await new Promise((r) => setTimeout(r, 350));
    } finally {
      this.loading.set(false);
    }
  }
}

function seed(): Customer[] {
  const rows: Array<[string, string, string, string, Customer['status']]> = [
    ['Maya', 'Okafor', 'maya.okafor@example.com', '+1 415 555 0111', 'active'],
    ['Liam', 'Nakamura', 'liam.nakamura@example.com', '+1 415 555 0122', 'active'],
    ['Sofia', 'Reyes', 'sofia.reyes@example.com', '+1 415 555 0133', 'inactive'],
    ['Noah', 'Bergström', 'noah.bergstrom@example.com', '+1 415 555 0144', 'active'],
    ['Aisha', 'Rahman', 'aisha.rahman@example.com', '+1 415 555 0155', 'active'],
    ['Diego', 'Costa', 'diego.costa@example.com', '+1 415 555 0166', 'inactive'],
    ['Emma', 'Larsen', 'emma.larsen@example.com', '+1 415 555 0177', 'active'],
    ['Kenji', 'Watanabe', 'kenji.watanabe@example.com', '+1 415 555 0188', 'active'],
    ['Fatima', 'Zahra', 'fatima.zahra@example.com', '+1 415 555 0199', 'inactive'],
    ['Owen', 'Murphy', 'owen.murphy@example.com', '+1 415 555 0200', 'active'],
  ];
  const now = Date.now();
  return rows.map(([firstName, lastName, email, phone, status], i) => ({
    id: crypto.randomUUID(),
    firstName,
    lastName,
    email,
    phone,
    status,
    createdAt: new Date(now - i * 86_400_000).toISOString(),
  }));
}
