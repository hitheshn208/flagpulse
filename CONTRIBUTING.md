# Contributing to FlagPulse

Thanks for considering contributing to FlagPulse! This doc covers how to get set up locally, 
the conventions this repo follows, and how to submit changes.

## Project structure

- `backend/` — Node.js + Express API, raw SQL (no ORM), PostgreSQL + Redis
- `frontend/` — React + Vite dashboard
- `docker-compose.yml` — full local stack (Postgres, Redis, backend, nginx)

## Getting started

### Prerequisites
- Node.js 20+
- Docker + Docker Compose
- PostgreSQL 16 / Redis 7 (or just use Docker Compose, recommended)

### Local setup
```bash
git clone https://github.com/<you>/flagpulse.git
cd flagpulse
cp .env.example .env   # fill in DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT
docker compose up --build
```

Migrations run automatically on backend startup (`npm run migrate`).

### Running backend/frontend separately (without Docker)
```bash
cd backend && npm install && npm run migrate && npm run dev
cd frontend && npm install && npm run dev
```

## Conventions

- **SQL**: raw SQL only, no ORM. Snake_case column names. New migrations go in 
  `backend/migrations/` as sequential `00N_description.sql` files.
- **Timestamps**: always `TIMESTAMPTZ DEFAULT NOW()`, never bare `TIMESTAMP`.
- **`updated_at`**: use the existing `BEFORE UPDATE` trigger pattern, don't set it manually in queries.
- **Frontend**: plain CSS (no CSS-in-JS), functional components, `lucide-react` for icons.
- **Commits**: clear, present-tense messages (`fix: correct cache key for env rotation` 
  not `fixed bug`).

## Submitting changes

1. Fork the repo and create a branch from `main` (`feat/short-description` or `fix/short-description`)
2. Make your change, keeping it scoped — smaller PRs get reviewed faster
3. Test locally against `docker compose up`
4. Open a PR with a clear description of *what* changed and *why*
5. Link any related issue

## Reporting bugs / requesting features

Open a GitHub issue. For bugs, include: steps to reproduce, expected vs actual behavior, 
and your environment (Docker vs manual setup). For feature requests, a quick rationale 
helps — what problem does it solve.

## Code of conduct

Be respectful. Disagreements on approach are fine and expected; personal attacks aren't.

## License

By contributing, you agree your contributions will be licensed under this project's license (see LICENSE).