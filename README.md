# Champions SaaS

Minimal **multi-user SaaS** for browsing **teams** and **matches**, posting **match comments**, and managing content through **role-based backoffice** panels (`EDITOR`, `ADMIN`). Built as the **M0613 IA7** deliverable (block *Creació d'un SaaS*, sessions S16–S20).

**Live demo:** https://YOUR-APP.vercel.app

**Repository:** https://github.com/YOUR_USER/champions-saas

## Why this project

Fans and editors need a single place to **publish** Champions-style fixtures and media, while **registered users** can discuss matches. The app separates **public catalog**, **social features**, and **internal tooling** with clear authorization — a common pattern in real B2B/B2C SaaS products.

## Features

### Public
- Browse **teams** and **matches** with real data from PostgreSQL (via Prisma).
- **Match detail** page with navigation between related entities.

### Authenticated users
- **Sign up** and **sign in** (Auth.js).
- Post **comments** on matches (social layer).

### Backoffice
- **`EDITOR`**: maintain teams, matches, and related media (shields, match images).
- **`ADMIN`**: user and **role** management (`USER`, `EDITOR`, `ADMIN`).

### Product / engineering
- **User stories** implemented incrementally in **Scrum sprints** (US-01 … US-22).
- **Idempotent seed** for local demos.
- **Supabase Storage** buckets for avatars, team logos, and match images.

## Tech stack

| Layer | Technology |
| ----- | ---------- |
| Framework | **Next.js 16** (App Router), **React**, **TypeScript** |
| ORM / DB | **Prisma** → **PostgreSQL** (hosted on **Supabase**) |
| Auth | **Auth.js** (NextAuth v5 beta) |
| Validation | **Zod** |
| UI | **shadcn/ui**, **Tailwind CSS** |
| Media | **Supabase** (Storage + service role on server) |
| Deploy | **Vercel** (app) + **Supabase** (DB, auth, storage) |

## Architecture (high level)

```
Browser → Next.js (RSC / Server Actions / Route Handlers)
               → Prisma → Supabase Postgres
               → Auth.js (sessions)
               → Supabase Storage (uploads from server)
```

- **Public read** endpoints expose teams/matches for visitors.
- **Mutations** (comments, backoffice CRUD, uploads) run **on the server** with validation and role checks.

## Prerequisites

- **Node.js** LTS
- A **Supabase** project (Postgres + Auth + Storage buckets configured)
- **Git**

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USER/champions-saas.git
cd champions-saas
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in your values. Never commit `.env`.

### 3. Database

```bash
npx prisma@5.22.0 migrate dev --schema=prisma/schema.prisma -n init
npm run seed
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
| -------- | ----------- |
| `DATABASE_URL` | Supabase **pooled** Postgres URL (Prisma client) |
| `DIRECT_URL` | Supabase **direct** URL (migrations) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000` in dev) |
| `NEXTAUTH_SECRET` | Strong random secret for Auth.js |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for Storage / admin APIs |
| `SUPABASE_BUCKET_AVATARS` | Bucket name for user avatars |
| `SUPABASE_BUCKET_TEAMS` | Bucket name for team shields |
| `SUPABASE_BUCKET_MATCHES` | Bucket name for match images |

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start Next.js in development |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run seed` | Seed database with sample data |
| `npx prisma studio` | Browse database (local) |

## Verification checklist (IA7)

- [x] Visitor can use **teams** and **matches** public routes with DB-backed data.
- [x] User can **register** and **log in** without errors.
- [x] Registered user can **comment** on a match.
- [x] `EDITOR` can manage teams/matches/media; `ADMIN` can manage users/roles.
- [ ] App deploys to **Vercel**; production env vars set safely.

## Deployment

1. Push to GitHub; connect the repo to **Vercel**.
2. Set all production environment variables in Vercel (same keys as in `.env`).
3. Run migrations: `npx prisma@5.22.0 migrate deploy`.

## Academic context

Developed as **IA7 — Kates Serveis web** within **M0613** (DAW2). Product discovery and backlog: **Scrum** (session S19); implementation: guided sprints (session S20).

## License

Educational use only.

## Author

**Edgar** — M0613 DAW2
