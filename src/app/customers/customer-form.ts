import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerStore } from '../customer-store';

@Component({
  selector: 'app-customer-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="wrap">
      <h1>{{ editId ? 'EDIT CUSTOMER' : 'NEW CUSTOMER' }}</h1>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row">
          @for (f of textFields; track f.key) {
            <label class="group">
              <span class="label">{{ f.label }}</span>
              <input class="field" [class.field--invalid]="invalid(f.key)" [type]="f.type" [formControlName]="f.key" />
              @if (invalid(f.key)) { <span class="err">{{ errorFor(f.key) }}</span> }
            </label>
          }
          <label class="group">
            <span class="label">Status</span>
            <select class="field" formControlName="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        @if (serverError()) { <p class="server-err">{{ serverError() }}</p> }

        <div class="actions">
          <button class="pill pill--primary" type="submit" [disabled]="store.loading()">
            {{ store.loading() ? 'Saving…' : 'Save' }}
          </button>
          <a class="pill pill--secondary" routerLink="/customers">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: 640px; margin: 0 auto; padding: var(--sp-section) var(--sp-xl); }
    h1 { font-size: 40px; letter-spacing: -0.5px; margin-bottom: var(--sp-xl); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-lg); }
    .group { display: flex; flex-direction: column; gap: var(--sp-xs); }
    .group:has(select), .group:nth-last-child(1) { grid-column: 1 / -1; }
    .label { font-size: 14px; font-weight: 500; }
    .err { color: var(--sale); font-size: 12px; }
    .server-err { color: var(--sale); margin-top: var(--sp-lg); font-weight: 500; }
    .actions { display: flex; gap: var(--sp-md); margin-top: var(--sp-xl); }
    @media (max-width: 560px) { .row { grid-template-columns: 1fr; } }
  `,
})
export class CustomerForm {
  readonly store = inject(CustomerStore);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly editId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly serverError = signal('');

  readonly textFields = [
    { key: 'firstName', label: 'First name', type: 'text' },
    { key: 'lastName', label: 'Last name', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Phone', type: 'tel' },
  ] as const;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+\d][\d\s()-]{6,}$/)]],
    status: ['active' as 'active' | 'inactive', Validators.required],
  });

  constructor() {
    if (this.editId) {
      const existing = this.store.byId(this.editId);
      if (existing) this.form.patchValue(existing);
      else this.router.navigate(['/customers']);
    }
  }

  invalid(key: string) {
    const c = this.form.get(key)!;
    return c.invalid && (c.touched || c.dirty);
  }

  errorFor(key: string) {
    const errs = this.form.get(key)!.errors ?? {};
    if (errs['required']) return 'Required.';
    if (errs['email']) return 'Invalid email.';
    if (errs['pattern']) return 'Invalid phone number.';
    if (errs['maxlength']) return 'Too long.';
    return 'Invalid.';
  }

  async submit() {
    this.serverError.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      const value = this.form.getRawValue();
      if (this.editId) await this.store.update(this.editId, value);
      else await this.store.create(value);
      this.router.navigate(['/customers']);
    } catch (e) {
      this.serverError.set((e as Error).message);
    }
  }
}
