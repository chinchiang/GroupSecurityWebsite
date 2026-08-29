# Phase 3 — Workflows and Security

## Forms

- Incident / Phishing / Service Request with Zod + RHF
- Mock submission IDs: `DEMO-INC-*`, `DEMO-PHISH-*`, `DEMO-SR-*`
- Audit events appended on writes

## Security

- Secure headers via `next.config.ts` + `src/lib/security/headers.ts`
- Production CSP without `unsafe-eval`
- API content-type checks, payload size limit, rate-limit interface
- Field masking for executive/employee technical fields

## Tests & CI

- Vitest unit/component tests
- Playwright E2E (+ axe-core)
- GitHub Actions CI + Dependabot
- Action SHA pinning TODO documented in workflow
