import { TestBed } from '@angular/core/testing';
import { CustomerStore } from './customer-store';
import { CustomerDraft } from './customer';

const draft = (over: Partial<CustomerDraft> = {}): CustomerDraft => ({
  firstName: 'Test',
  lastName: 'User',
  email: 'test.user@example.com',
  phone: '+1 415 555 0000',
  status: 'active',
  ...over,
});

describe('CustomerStore', () => {
  let store: CustomerStore;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CustomerStore);
  });

  it('creates, updates, and removes a customer', async () => {
    const before = store.count();
    await store.create(draft());
    expect(store.count()).toBe(before + 1);

    const created = store.filtered().find((c) => c.email === 'test.user@example.com')!;
    await store.update(created.id, draft({ firstName: 'Renamed' }));
    expect(store.byId(created.id)!.firstName).toBe('Renamed');

    await store.remove(created.id);
    expect(store.count()).toBe(before);
  });

  it('rejects a duplicate email', async () => {
    await store.create(draft({ email: 'dupe@example.com' }));
    await expectAsync(store.create(draft({ email: 'dupe@example.com' }))).toBeRejected();
  });

  it('filters by search and status', () => {
    store.search.set('maya');
    expect(store.filtered().every((c) => `${c.firstName} ${c.lastName}`.toLowerCase().includes('maya'))).toBeTrue();
    store.search.set('');
    store.statusFilter.set('inactive');
    expect(store.filtered().every((c) => c.status === 'inactive')).toBeTrue();
  });
});
