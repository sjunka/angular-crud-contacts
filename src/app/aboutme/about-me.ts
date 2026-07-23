import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '../components/button';

@Component({
  selector: 'app-about-me',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button],
  template: `
    <article class="wrap">
      <header class="hero">
        <p class="eyebrow">Technical overview</p>
        <h1>HOW THIS APP WORKS</h1>
        <p class="lede">
          A guided tour of the Customer Portal for someone new to Angular. No prior framework
          knowledge needed — every term is explained the first time it appears.
        </p>
      </header>

      <section class="block">
        <h2>The big picture</h2>
        <p>
          This is a <strong>CRUD</strong> app — Create, Read, Update, Delete. It manages a list of
          customers. You can add one, edit one, delete one, search, filter by status, and page
          through results. That is the whole job.
        </p>
        <p>It is built with <strong>Angular</strong>, a framework for building web apps out of small, reusable pieces called <strong>components</strong>.</p>
        <div class="flow">
          @for (step of flow; track step) {
            <span class="flow-node">{{ step }}</span>
          }
        </div>
        <p class="cap">Data flows one way: a component asks the store, the store hands back the data, the component draws it.</p>
      </section>

      <section class="block">
        <h2>The files, one line each</h2>
        <ul class="files">
          @for (f of files; track f.path) {
            <li>
              <code>{{ f.path }}</code>
              <span>{{ f.desc }}</span>
            </li>
          }
        </ul>
      </section>

      <section class="block">
        <h2>Components (the visible pieces)</h2>
        <p>
          A component is one chunk of screen plus the logic behind it. Angular renders it wherever
          you place its tag. This app has three:
        </p>
        <div class="cards">
          @for (c of components; track c.name) {
            <div class="ccard">
              <h3>{{ c.name }}</h3>
              <p class="tag">{{ c.tag }}</p>
              <p>{{ c.desc }}</p>
            </div>
          }
        </div>
      </section>

      <section class="block">
        <h2>Signals: how the screen stays fresh</h2>
        <p>
          A <strong>signal</strong> is a box that holds a value and tells Angular whenever that value
          changes — so the screen redraws automatically. No manual refresh.
        </p>
        <pre><code>{{ signalSnippet }}</code></pre>
        <p>
          A <strong>computed</strong> signal is derived from others. When you type in the search box,
          <code>search()</code> changes, so <code>filtered()</code> recomputes, so the visible list
          updates — a chain reaction you never wire up by hand.
        </p>
      </section>

      <section class="block">
        <h2>"API calls" — where the data lives</h2>
        <p>
          A real app would fetch customers from a server over HTTP. To keep this demo self-contained,
          the server is faked by <code>CustomerStore</code>: an in-memory list with a small delay
          added so loading states behave like the real thing.
        </p>
        <table class="api">
          <thead><tr><th>You call</th><th>It does</th><th>Real-world equivalent</th></tr></thead>
          <tbody>
            @for (row of api; track row.call) {
              <tr><td><code>{{ row.call }}</code></td><td>{{ row.does }}</td><td>{{ row.rest }}</td></tr>
            }
          </tbody>
        </table>
        <p class="cap">
          Because the public shape is just these methods and signals, swapping the fake list for a
          real <code>HttpClient</code> later touches only this one file — nothing else changes.
        </p>
      </section>

      <section class="block">
        <h2>Routing: turning URLs into pages</h2>
        <p>
          The <strong>router</strong> maps each URL to a component. Each route is
          <em>lazy-loaded</em> — its code downloads only when you first visit it, so the app starts
          fast.
        </p>
        <ul class="routes">
          @for (r of routes; track r.path) {
            <li><code>{{ r.path }}</code> <span>{{ r.desc }}</span></li>
          }
        </ul>
      </section>

      <section class="block">
        <h2>Forms &amp; validation</h2>
        <p>
          The add/edit screen uses a <strong>reactive form</strong>: the form lives in code as data,
          so it is easy to validate. Rules run as you type — required fields, a valid email shape, a
          phone pattern. Bad input blocks the Save button and shows a message under the field. The
          store adds one more check: no two customers may share an email.
        </p>
      </section>

      <section class="block">
        <h2>The look: a design system</h2>
        <p>
          Every color, spacing step, and pill-shaped button comes from a fixed set of
          <strong>design tokens</strong> in <code>styles.scss</code> — the Nike system: black ink on
          white, one soft gray, red reserved only for danger. Reusing tokens instead of picking
          colors ad-hoc is why the whole app looks like one product.
        </p>
      </section>

      <footer class="foot">
        <app-button link="/customers">Back to the app</app-button>
      </footer>
    </article>
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: 820px; margin: 0 auto; padding: var(--sp-section) var(--sp-xl); }
    .hero { margin-bottom: var(--sp-section); }
    .eyebrow { text-transform: uppercase; letter-spacing: 1px; color: var(--mute); font-size: 13px; font-weight: 500; margin: 0; }
    h1 { font-size: clamp(40px, 8vw, 72px); letter-spacing: -1px; line-height: 0.95; margin: var(--sp-sm) 0; }
    .lede { font-size: 18px; color: var(--charcoal); max-width: 60ch; }
    .block { margin-bottom: var(--sp-section); }
    .block h2 { font-size: 26px; border-bottom: 1px solid var(--hairline); padding-bottom: var(--sp-sm); margin-bottom: var(--sp-md); }
    .block h3 { font-size: 17px; margin-bottom: var(--sp-xs); }
    p { line-height: 1.6; color: var(--charcoal); }
    code { font-family: 'SF Mono', Menlo, monospace; font-size: 0.9em; background: var(--soft-cloud); padding: 2px 6px; border-radius: 6px; }
    pre { background: var(--ink); color: var(--on-primary); padding: var(--sp-lg); border-radius: var(--r-md); overflow-x: auto; }
    pre code { background: none; color: inherit; padding: 0; }
    .flow { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-sm); margin: var(--sp-lg) 0; }
    .flow-node { background: var(--soft-cloud); padding: var(--sp-sm) var(--sp-lg); border-radius: var(--r-lg); font-weight: 500; font-size: 14px; }
    .flow-node:not(:last-child)::after { content: '→'; margin-left: var(--sp-md); color: var(--stone); }
    .cap { font-size: 14px; color: var(--mute); }
    .files { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--sp-sm); }
    .files li { display: grid; grid-template-columns: 240px 1fr; gap: var(--sp-md); align-items: baseline; padding: var(--sp-sm) 0; border-bottom: 1px solid var(--hairline-soft); }
    .files span { color: var(--mute); font-size: 14px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--sp-md); margin-top: var(--sp-md); }
    .ccard { background: var(--soft-cloud); padding: var(--sp-lg); }
    .ccard .tag { font-family: monospace; font-size: 12px; color: var(--info); margin: 0 0 var(--sp-sm); }
    .api { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: var(--sp-md); }
    .api th, .api td { text-align: left; padding: var(--sp-sm) var(--sp-md); border-bottom: 1px solid var(--hairline-soft); vertical-align: top; }
    .api th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--mute); }
    .routes { list-style: none; padding: 0; }
    .routes li { padding: var(--sp-sm) 0; border-bottom: 1px solid var(--hairline-soft); }
    .routes span { color: var(--mute); margin-left: var(--sp-md); font-size: 14px; }
    .foot { padding-top: var(--sp-lg); }
    @media (max-width: 560px) { .files li { grid-template-columns: 1fr; gap: var(--sp-xs); } }
  `,
})
export class AboutMe {
  readonly flow = ['User clicks', 'Component', 'CustomerStore', 'Signals update', 'Screen redraws'];

  readonly files = [
    { path: 'customer.ts', desc: 'The Customer shape (id, name, email, status…).' },
    { path: 'customer-store.ts', desc: 'The brain: holds data, runs CRUD, filters, paginates.' },
    { path: 'customers/customer-list.ts', desc: 'The grid of customer cards + search + filters.' },
    { path: 'customers/customer-form.ts', desc: 'The add/edit screen with validation.' },
    { path: 'aboutme/about-me.ts', desc: 'This page.' },
    { path: 'app.ts', desc: 'The shell: top nav + where pages appear.' },
    { path: 'app.routes.ts', desc: 'The URL → page map.' },
    { path: 'styles.scss', desc: 'Design tokens: colors, spacing, buttons.' },
  ];

  readonly components = [
    { name: 'App', tag: '<app-root>', desc: 'The frame. Holds the nav bar and a slot where each page renders.' },
    { name: 'CustomerList', tag: '<app-customer-list>', desc: 'Shows the cards. Owns search, status chips, and paging.' },
    { name: 'CustomerForm', tag: '<app-customer-form>', desc: 'One form reused for both "new" and "edit".' },
  ];

  readonly api = [
    { call: 'store.create(draft)', does: 'Adds a customer (after checking the email is unique).', rest: 'POST /customers' },
    { call: 'store.update(id, draft)', does: 'Overwrites one customer.', rest: 'PUT /customers/:id' },
    { call: 'store.remove(id)', does: 'Deletes one customer.', rest: 'DELETE /customers/:id' },
    { call: 'store.paged()', does: 'Reads the current visible page of results.', rest: 'GET /customers?page=' },
  ];

  readonly routes = [
    { path: '/customers', desc: 'The list.' },
    { path: '/customers/new', desc: 'Add a customer.' },
    { path: '/customers/:id/edit', desc: 'Edit one (the :id is filled in from the URL).' },
    { path: '/aboutme', desc: 'This overview.' },
  ];

  readonly signalSnippet = `search = signal('');        // a box holding the search text
filtered = computed(() =>    // recalculates itself whenever
  this.all().filter(...)     // 'all' or 'search' changes
);`;
}
