import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerStore } from '../customer-store';
import { Button } from '../components/button';
import { TextField } from '../components/text-field';

@Component({
  selector: 'app-customer-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Button, TextField],
  template: `
    <div class="wrap">
      <h1>{{ editId ? 'EDIT CUSTOMER' : 'NEW CUSTOMER' }}</h1>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="row">
          <app-text-field [control]="ctrl('firstName')" label="First name" />
          <app-text-field [control]="ctrl('lastName')" label="Last name" />
          <app-text-field [control]="ctrl('email')" label="Email" type="email" class="full" />
          <app-text-field [control]="ctrl('phone')" label="Phone" type="tel" class="full" />
          <label class="group full">
            <span class="label">Status</span>
            <select class="field" formControlName="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        @if (serverError()) { <p class="server-err">{{ serverError() }}</p> }

        <div class="actions">
          <app-button type="submit" [disabled]="store.loading()">
            {{ store.loading() ? 'Saving…' : 'Save' }}
          </app-button>
          <app-button variant="secondary" link="/customers">Cancel</app-button>
        </div>
      </form>
    </div>
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: 640px; margin: 0 auto; padding: var(--sp-section) var(--sp-xl); }
    h1 { font-size: 40px; letter-spacing: -0.5px; margin-bottom: var(--sp-xl); }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--sp-lg); }
    .full { grid-column: 1 / -1; }
    .group { display: flex; flex-direction: column; gap: var(--sp-xs); }
    .label { font-size: 14px; font-weight: 500; }
    .field { background: var(--soft-cloud); border: 2px solid transparent; border-radius: var(--r-md);
      height: 48px; padding: 0 16px; font: inherit; width: 100%; color: var(--ink); }
    .field:focus { outline: none; background: var(--canvas); border-color: var(--ink); }
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

  /** Typed accessor so the template can hand a FormControl to <app-text-field>. */
  ctrl(name: 'firstName' | 'lastName' | 'email' | 'phone') {
    return this.form.controls[name] as FormControl<string>;
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
