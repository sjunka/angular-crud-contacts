import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="nav">
      <a class="brand" routerLink="/customers">◢◤ PORTAL</a>
      <a routerLink="/customers" routerLinkActive="active" class="link">Customers</a>
      <a routerLink="/aboutme" routerLinkActive="active" class="link">About</a>
    </nav>
    <main><router-outlet /></main>
  `,
  styles: `
    .nav { display: flex; align-items: center; gap: var(--sp-xl); height: 56px; padding: 0 var(--sp-xl);
      border-bottom: 1px solid var(--hairline); }
    .brand { font-weight: 700; letter-spacing: 1px; text-decoration: none; }
    .link { text-decoration: none; font-weight: 500; padding: 4px 0; border-bottom: 2px solid transparent; }
    .link.active { border-color: var(--ink); }
  `,
})
export class App {}
