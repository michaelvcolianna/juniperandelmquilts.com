# Juniper & Elm Quilts

My wife's quilting website. Built with [SvelteKit](https://svelte.dev/docs/kit)
and [Storyblok](https://www.storyblok.com), deployed to Netlify.

The site is fully prerendered: every page is static HTML, and a Storyblok
publish webhook triggers a rebuild. Only three routes need a server —
`/newsletter`, `/newsletter/thanks`, and `/preview`.

## Getting started

```sh
nvm use            # Node 24
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

## Scripts

| Script                    | What it does                                    |
| ------------------------- | ----------------------------------------------- |
| `npm run dev`             | Dev server                                      |
| `npm run build`           | Production build (prerenders every page)        |
| `npm run preview`         | Serve the production build locally              |
| `npm run check`           | Type-check with `svelte-check`                  |
| `npm run lint`            | Prettier + ESLint                               |
| `npm run format`          | Rewrite with Prettier                           |
| `npm test`                | Unit tests                                      |
| `npm run schema:validate` | Validate the Storyblok schema offline           |
| `npm run schema:diff`     | Compare the local schema against the live space |
| `npm run schema:push:dry` | Show what a schema push would change            |
| `npm run schema:push`     | Apply the schema to the space                   |
| `npm run schema:rollback` | Revert a schema push via its changeset          |

## Content

Content lives in Storyblok (space `159199`). The component model is defined in
code at [`src/lib/storyblok/schema.ts`](src/lib/storyblok/schema.ts), and the
TypeScript content types are derived from it — renaming a field there breaks the
component that reads it, rather than the two drifting apart.

Content is fetched with plain REST in `+page.server.ts` load functions.
`@storyblok/svelte` is confined to `/preview`, so an SDK major version can never
break the public site.

### Visual Editor

Point the space's preview URL at `https://<host>/preview/`. That route reads
draft content, sends `noindex`, and is never prerendered. Storyblok loads it in
an iframe and **requires HTTPS**, so local Visual Editor work needs a
certificate (`mkcert localhost`, then wire it into `vite.config.ts`); testing
against a Netlify deploy preview avoids that entirely.

## Forms

### Contact

Netlify Forms. Netlify discovers forms by parsing static HTML at deploy time,
which SvelteKit does not produce for server-rendered routes, so
[`static/__forms.html`](static/__forms.html) holds a hidden skeleton that is
both what Netlify parses and where the real form POSTs.

**The field names in that file must match
[`src/routes/contact/+page.svelte`](src/routes/contact/+page.svelte) exactly.**
A mismatch means submissions are accepted and silently discarded.

Spam handling is a honeypot (`bot-field`) plus Netlify's automatic Akismet
filtering. No reCAPTCHA — it is an accessibility and GDPR liability and
unnecessary at this volume.

> **Form detection is off by default on new Netlify sites.** Enable it under
> Forms → Enable form detection, or every submission vanishes.

### Newsletter

EmailOctopus, behind [`/newsletter`](src/routes/newsletter/+server.ts) so the
API key stays on the server. The decision logic is in
[`src/lib/newsletter.ts`](src/lib/newsletter.ts) and is unit-tested.

**Double opt-in is governed by the list setting, not by this code.** The request
deliberately omits `status`, which makes a new contact `pending` on a
double-opt-in list and triggers the confirmation email. Enable it at
Lists → (your list) → Settings → Double opt-in, or signups are single opt-in and
no confirmation is ever sent.

Both forms work without JavaScript. The newsletter's no-JS path redirects to
`/newsletter/thanks`, because the signup block appears on prerendered pages,
which cannot read a query string.

## Deployment

Netlify, via `@sveltejs/adapter-netlify` and [`netlify.toml`](netlify.toml).

Netlify's free tier is credit-based: 300 credits/month, with a production deploy
costing roughly 15 — about 20 deploys a month. Fire the Storyblok build hook on
**publish** events only, not on every save.

## Environment

All variables are server-side only. None may take a `PUBLIC_` prefix — that is
exactly the mistake the old Nuxt build made with its Brevo key, which shipped in
the browser bundle for three years. See [`.env.example`](.env.example).
