# leiyang.me

Personal site of Lei Yang, Principal Gameplay Animator. Built with Next.js and deployed on Vercel at [leiyang.me](https://leiyang.me).

## What's on the site

- **Home** (`/`) — "Atelier" editorial layout: hero, about, selected work, playground, contact.
- **Game animation** (`/portfolio/game-animation`) — Call of Duty work, with the demo reel behind a password gate (videos served from Cloudflare R2 via signed URLs).
- **2D art** (`/portfolio/drawings`) — drawing gallery with a lightbox.
- **Resume** (`/resume`) — experience, skills, and a downloadable PDF.
- **Playground** (`/tools`):
  - **Purchasing Power** (`/tools/purchasing-power`) — US CPI inflation calculator with city and category breakdowns. Data from BLS and FRED, cached in Neon Postgres and refreshed monthly by a Vercel cron job.
  - **Countries Visited** (`/tools/countries-visited`) — clickable world map; progress is saved in the browser.
  - **Hailstone** (`/games/hailstone`) — Phaser 3 vertical shooter, served as a static build from `public/games/hailstone`.
- **SEO** — sitemap, robots, Open Graph image, Person JSON-LD, and `/llms.txt`, all driven by `src/constants/site.ts`.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Recharts · d3-geo · Neon Postgres · Cloudflare R2 · Vercel

## Getting started

Requires Node.js 20.9+.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

### Environment variables

Put these in `.env.local` (and in the Vercel project settings for production):

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection (CPI cache) |
| `BLS_API_KEY`, `FRED_API_KEY` | CPI data sources |
| `CRON_SECRET` | Authenticates the `/api/cron/sync-cpi` job |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | Cloudflare R2 access for the demo reel |
| `R2_REEL_KEY_1`, `R2_REEL_TITLE_1`, `R2_REEL_KEY_2`, `R2_REEL_TITLE_2` | Reel video objects and titles |
| `REEL_PASSWORD` | Password for the reel gate |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run sync-cpi` | Pull the latest CPI data into the database |
| `node scripts/build-world-data.mjs` | Regenerate the world map data in `src/constants/` |

The database schema is in `scripts/init-db.sql`. A Husky pre-commit hook runs lint and build.

## Updating career details

Job title, employer, shipped titles, and profile links live in `src/constants/site.ts`. Metadata, structured data, and `/llms.txt` all read from there, so update that file first.

## Contact

[lei@leiyang.me](mailto:lei@leiyang.me) · [leiyang.me](https://leiyang.me)
