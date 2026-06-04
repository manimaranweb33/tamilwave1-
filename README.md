# TamilWave

TamilWave is an original, mobile-first Tamil entertainment indexing website built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Responsive dark UI with green branding and CSS-generated poster artwork
- Tamil movies, web series, dubbed content, categories, search autocomplete, and detail pages
- Year archives from 1990 through the current year with pagination
- **Admin panel** at `/admin` with email/password auth, content CRUD, homepage curation, SEO fields, and image uploads
- PostgreSQL schema, seed data, and protected admin API routes
- SEO metadata, dynamic sitemap, robots rules, breadcrumbs, related suggestions, and legal pages

## Run locally

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (default `admin@tamilwave.local` / `changeme123` from `.env`).

## Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `AUTH_SECRET` | Auth.js session signing |
| `AUTH_URL` | Site URL for Auth.js |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Bootstrap super admin (seed) |
| `CATALOG_SOURCE` | `db` (default) or `static` for offline UI |
| `STORAGE_DRIVER` | `local` or `s3` for poster uploads |

## Admin API

Browser admin uses session cookies. Legacy `Authorization: Bearer <ADMIN_API_KEY>` still works on `/api/content` for scripts.

## E2E tests

```bash
npx playwright install chromium
npm run test:e2e
```
