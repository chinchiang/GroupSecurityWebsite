# Phase 0 — Repository Inventory

**Date:** 2026-08-29  
**Repository:** `/workspace` (GroupSecurityWebsite / cybersecurity-portal)

## Summary

Repository was empty (README stub only). Greenfield scaffold created with Next.js App Router.

| Item | Value |
|---|---|
| Framework | Next.js |
| Framework version | 16.3.3 |
| React | 19.2.8 |
| Node.js (runtime) | v22.14.0 (engines: >=20) |
| Package manager | npm |
| Package manager version | 10.9.7 |
| UI primitives | Radix UI + custom shadcn-style components |
| Icons | Lucide React |
| CSS | Tailwind CSS v4 |
| Validation | Zod |
| Forms | React Hook Form + @hookform/resolvers |
| Unit / component tests | Vitest + Testing Library |
| E2E | Playwright (+ axe-core) |
| Lint | ESLint 9 + eslint-config-next |
| Typecheck | TypeScript 5 strict |
| CI/CD | GitHub Actions (added in Phase 3) |
| Authentication | MockAuthProvider (no password login) |
| API routes | App Router route handlers (mock only) |
| Database / persistence | None — in-memory mock fixtures |
| Environment | `.env.example` only (no real secrets) |

## Scripts (package.json)

- `dev` — Next.js development server
- `build` — production build
- `start` — start production server
- `lint` — ESLint
- `typecheck` — `tsc --noEmit`
- `test` — Vitest unit/component
- `test:watch` — Vitest watch
- `test:e2e` — Playwright
- `test:component` — Vitest component config (optional)

## Directory structure (target)

See `ARCHITECTURE.md`. Key roots: `src/app`, `src/components`, `src/config`, `src/domain`, `src/services`, `src/adapters`, `src/data/mock`, `src/content`, `src/lib`, `tests`, `docs`.

## Existing authentication / APIs / DB

None prior to Phase 0. All integrations are Mock / Stub / Dry-run.
