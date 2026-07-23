import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CustomerStatus } from '../customer';

/** Tiny status label. Teaches: required input + host class binding (no wrapper div). */
@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'badge',
    '[class.badge--off]': 'status() === "inactive"',
  },
  template: `{{ status() }}`,
  styles: `
    :host.badge {
      font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;
      color: var(--success);
    }
    :host.badge--off { color: var(--stone); }
  `,
})
export class StatusBadge {
  status = input.required<CustomerStatus>();
}
