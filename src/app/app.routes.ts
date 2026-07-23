import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'customers' },
  {
    path: 'customers',
    loadComponent: () => import('./customers/customer-list').then((m) => m.CustomerList),
  },
  {
    path: 'customers/new',
    loadComponent: () => import('./customers/customer-form').then((m) => m.CustomerForm),
  },
  {
    path: 'customers/:id/edit',
    loadComponent: () => import('./customers/customer-form').then((m) => m.CustomerForm),
  },
  {
    path: 'aboutme',
    loadComponent: () => import('./aboutme/about-me').then((m) => m.AboutMe),
  },
  { path: '**', redirectTo: 'customers' },
];
