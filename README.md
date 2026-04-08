# Veltrix API

Greenfield NestJS backend bootstrap for the first vertical slice.

## Run locally (DB + migrate + API)

1. Copy environment:

```bash
cp .env.example .env
```

2. Start PostgreSQL:

```bash
docker compose up -d postgres
```

3. Install dependencies, generate Prisma client and apply migrations:

```bash
pnpm install
pnpm run prisma:generate
pnpm run prisma:migrate -- --name init
```

4. Start API:

```bash
pnpm run start:dev
```

## Run relevant e2e test

```bash
pnpm run test:e2e -- posts-from-url.e2e-spec.ts
```

## Supply-chain safeguard (pnpm)

Project-level policy is set to avoid installing very recent package publishes:

```ini
minimum-release-age=1440
```

If you need an urgent exception for a trusted package/version, use:

```bash
pnpm install --config.minimumReleaseAgeExclude="package-name@x.y.z"
```

## Idempotency behavior (`POST /posts/from-url`)

- First request with a new `sourceUrl`: creates a `DRAFT` post and returns `201`.
- Repeated request with same `sourceUrl`: returns the existing post and `200` (no duplicate record created).
