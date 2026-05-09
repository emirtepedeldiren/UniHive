# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check

npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with test data
npm run db:studio    # Open Prisma Studio (visual DB browser)
```

### First-time setup

PostgreSQL must be running locally. Create the database, then update both `.env` and `.env.local`:

```
DATABASE_URL="postgresql://<username>@localhost:5432/unihive"
NEXTAUTH_SECRET="any-secret-string"
NEXTAUTH_URL="http://localhost:3000"
```

On macOS with Homebrew, the username is your macOS user (e.g. `dogualagoz`), not `postgres`. Both `.env` and `.env.local` must have the same `DATABASE_URL` — `.env.local` takes precedence and will silently override `.env`.

```bash
createdb unihive
npx prisma migrate dev --name init
npm run db:seed
```

### Seed credentials

- Admin: `admin@unihive.edu.tr` / `admin1234`
- Students: `ada@itu.edu.tr`, `alan@metu.edu.tr`, `grace@boun.edu.tr` — all use `student1234`

## Architecture

**Stack:** Next.js 15 (App Router) · NextAuth.js 4 (Credentials + JWT) · Prisma 5 + PostgreSQL · Tailwind CSS 3

### Data flow

All data mutations go through API routes (`src/app/api/`). Pages are server components that fetch directly from Prisma; client components call the API routes via `fetch`.

Session is provided by `src/components/Providers.tsx` (NextAuth `SessionProvider`) which wraps the root layout. Session shape: `{ id, email, name, role, score, badge }`.

### Content moderation

Questions and answers default to `PENDING` status on creation. They must be `APPROVED` by an admin before becoming visible to regular users. The admin panel lives at `/admin`.

### Gamification

Voting triggers score updates on the author's `User` record. `src/lib/utils.ts:getBadgeForScore()` maps scores to badge tiers: Drone (0) → Worker Bee (50) → Scout Bee (200) → Queen Bee (500). Badge is stored on the `User` model and updated on every vote.

### Tags

`tags` and `imageUrls` on `Question` and `Answer` are native PostgreSQL `String[]` arrays — no JSON serialization. Tag filtering uses Prisma's `{ has: tag }` operator.

### Key files

| Path | Purpose |
|------|---------|
| `src/lib/auth.ts` | NextAuth config, session callbacks |
| `src/lib/prisma.ts` | Prisma singleton (dev-safe global reuse) |
| `src/lib/utils.ts` | Badge logic, Turkish `timeAgo`, `.edu` validation |
| `src/middleware.ts` | Route protection |
| `src/app/api/vote/route.ts` | Voting + score/badge side-effects |
| `prisma/schema.prisma` | Full data model |

## Design system

Brand is bee/hive themed. Key Tailwind tokens defined in `tailwind.config.ts`:

- `honey` (#FFD54F) — primary brand / active states
- `pollinate` (#4CAF50) — upvote
- `sting` (#F44336) — downvote
- `app-bg` / `dark-bg` — page backgrounds (light/dark)
- Font: Plus Jakarta Sans

Hexagon avatar clipping uses the CSS class `hex-clip` (defined globally). Voting UI lives in `src/components/ui/Pollinate.tsx`.

## Known gotchas

- Logo images are imported from `design_assets/stitch_unihive_student_collaboration_platform/unihive_logo/screen.png` — the `design_assets/` prefix is required. (`login`, `register`, `signin` pages all import this.)
- If you get a JWT session decryption error after config changes, clear browser cookies for localhost — old session cookies from a previous secret will cause it.
