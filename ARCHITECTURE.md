# Architecture

## System layers

1. **Experience / Orchestration Layer (this app)** — UI, workflows, policy-aware views, demo submissions.
2. **Future Backend / API Gateway** — authn, authz, filtering, masking, audit (not implemented as enterprise backend).
3. **Authoritative systems** — GRC, SIEM, CMDB, OT inventory, etc. (Mock adapters only in MVP).

```
Browser → Next.js App Router → Services → Policy Engine → Mock Adapters → Fixtures
```

## Technology choices

Greenfield repository. Adopted default stack from project brief:

- Next.js App Router, TypeScript strict, Tailwind, Radix/shadcn-style UI, Lucide, Zod, RHF, Vitest, Playwright, ESLint, npm.
- No deviation requiring alternate justification.

## Component architecture

- `src/components/layout` — App shell (sidebar, top bar, footer)
- `src/components/navigation` — menus, breadcrumbs, mobile nav
- `src/components/dashboard` — role-aware cards
- `src/components/tables` — DataTable
- `src/components/forms` — incident / phishing / service request
- `src/components/status` — severity / status badges
- `src/components/ui` — primitives (Button, Input, Dialog, …)

## Domain architecture

Typed models under `src/domain/models`, enums under `src/domain/enums`, policies under `src/domain/policies`, Zod schemas under `src/domain/validation`.

## Route structure

URL-based locales: `/zh-TW/...`, `/en/...`. Root `/` redirects to `/zh-TW`.

Major menus: My Security, Govern & Assure, Detect & Respond, Identify & Protect, Manufacturing Security, Supply Chain, Resilience & People, Services & Knowledge.

## Auth / authorization

- `AuthProvider` interface + `MockAuthProvider`
- RBAC + ABAC via `can(user, action, resource)` and scope filters
- Server Components / Route Handlers / services enforce the same checks as UI

## Data flow

All reads/writes go through service layer → repository interface → mock adapter. Browser never connects directly to SIEM / OT / PAM / GRC / ERP.

## Integration adapters

Stubs under `src/adapters/integrations` document future GRC, SIEM, CMDB, IAM/PAM, OT, Supplier/ERP, PLM, DSPM, LMS contracts. Runtime uses mock implementations only.

## Future backend path

Replace mock adapters with backend-mediated clients; keep repository interfaces; enforce policy at API gateway; never expose vaults or OT controllers to the browser.

## Deployment assumptions

Local / internal demo only. Not production-ready. No formal SSO, secrets management, or durable audit storage.
