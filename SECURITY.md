# Security

## Threat model summary (MVP)

Threats in scope for this demo build: accidental exposure of demo data as “real”, privilege confusion via Role Switcher, XSS via unvalidated input, information disclosure in errors, accidental real integrations.

Out of scope for MVP runtime: defending a production IdP, OT network isolation, formal compliance attestation.

## Protected assets

- Demo session identity (development only)
- Mock operational records (risks, incidents, assets, …)
- Policy decisions and audit events (in-memory)

## Trust boundaries

- Browser untrusted
- Next.js server trusted for demo policy evaluation
- No trust in external enterprise systems (not connected)

## Authentication assumptions

- No username/password login
- `MockAuthProvider` + Demo Session
- Development Role Switcher only (`NODE_ENV === "development"`)
- Production without formal Auth Provider → Configuration Error (never auto-grant Portal Admin)

## Authorization model

RBAC actions: view, create, update, approve, export, delete, administer.  
ABAC scope: legal entities, business groups, regions, sites, plants, products, data classifications.  
Server-side checks required on every sensitive read/write.

## Sensitive data handling

- Neutral demo names only
- Field-level masking for executives and low-privilege roles (no full IOC, internal IP, OT hostname)
- No secrets in repo or `.env.example`
- localStorage may store locale preference only — never tokens/session/permissions

## CSP / secure headers

Configured in `next.config.ts` / security helpers. Production CSP must not use `unsafe-eval`. See Phase 3 docs for remaining framework limitations.

## Logging

Mock audit events for login, role change, sensitive views, create/update/approve/export. Not durable enterprise audit storage.

## Dependency security

Dependabot for npm and GitHub Actions. CI runs lint, typecheck, test, build.

## Known gaps

- No formal SSO / Conditional Access
- No formal secrets management
- No durable audit log storage
- No production monitoring / backup / DR
- Mock data only

## Production hardening checklist

See `docs/phase-4-production-readiness-boundary.md`.
