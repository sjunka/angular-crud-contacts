import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Reusable Nike pill button. Renders an <a> when `link` is set, else a <button>.
 *  Teaches: signal inputs, output events, content projection, template @if. */
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @if (link()) {
      <a class="pill" [class]="cls()" [routerLink]="link()"><ng-content /></a>
    } @else {
      <button class="pill" [class]="cls()" [type]="type()" [disabled]="disabled()" (click)="clicked.emit()">
        <ng-content />
      </button>
    }
  `,
  styles: `
    :host { display: inline-flex; }
    .pill {
      display: inline-flex; align-items: center; justify-content: center; gap: var(--sp-sm);
      height: 48px; padding: 0 32px; border: 0; border-radius: var(--r-lg);
      font: inherit; font-weight: 500; cursor: pointer; text-decoration: none;
      transition: transform 120ms ease, opacity 120ms ease, background 120ms ease;
    }
    .pill:active { transform: scale(0.97); opacity: 0.85; }   /* Nike tap-collapse */
    .pill:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
    .pill--primary { background: var(--ink); color: var(--on-primary); }
    .pill--secondary { background: var(--soft-cloud); color: var(--ink); }
    .pill--danger { background: var(--sale); color: var(--on-primary); }
    .pill--sm { height: 40px; padding: 0 16px; font-size: 14px; }
    .pill:disabled { opacity: 0.4; cursor: not-allowed; }
    .pill:disabled:active { transform: none; }
  `,
})
export class Button {
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  size = input<'md' | 'sm'>('md');
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
  link = input<string | unknown[]>(); // set → renders a router link instead of a button

  clicked = output<void>();

  cls = computed(() => `pill--${this.variant()}${this.size() === 'sm' ? ' pill--sm' : ''}`);
}
