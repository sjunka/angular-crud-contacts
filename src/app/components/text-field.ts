import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/** Labelled reactive-form input with inline error. You pass it the FormControl
 *  directly (input.required<FormControl>) — no ControlValueAccessor needed.
 *  Teaches: reusing a form control across components, computed error text. */
@Component({
  selector: 'app-text-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <label class="group">
      <span class="label">{{ label() }}</span>
      <input class="field" [class.field--invalid]="showError()" [type]="type()" [formControl]="control()" />
      @if (showError()) { <span class="err">{{ errorText() }}</span> }
    </label>
  `,
  styles: `
    .group { display: flex; flex-direction: column; gap: var(--sp-xs); }
    .label { font-size: 14px; font-weight: 500; }
    .field {
      background: var(--soft-cloud); border: 2px solid transparent; border-radius: var(--r-md);
      height: 48px; padding: 0 16px; font: inherit; width: 100%; color: var(--ink);
    }
    .field:focus { outline: none; background: var(--canvas); border-color: var(--ink); }
    .field--invalid { border-color: var(--sale); }
    .err { color: var(--sale); font-size: 12px; }
  `,
})
export class TextField {
  control = input.required<FormControl>();
  label = input.required<string>();
  type = input<'text' | 'email' | 'tel'>('text');

  // Methods, not computed: FormControl.touched/invalid aren't signals, so a
  // computed would cache stale. Methods re-run on each change-detection pass.
  showError() {
    const c = this.control();
    return c.invalid && (c.touched || c.dirty);
  }

  errorText() {
    const errs = this.control().errors ?? {};
    if (errs['required']) return 'Required.';
    if (errs['email']) return 'Invalid email.';
    if (errs['pattern']) return 'Invalid phone number.';
    if (errs['maxlength']) return 'Too long.';
    return 'Invalid.';
  }
}
