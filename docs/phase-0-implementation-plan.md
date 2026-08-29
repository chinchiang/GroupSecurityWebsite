# Phase 0 — Implementation Plan (Phase 1–4)

## Execution order

1. **Phase 1** — Domain models, site/navigation/role configs, Auth adapter, RBAC+ABAC policy engine, i18n (zh-TW/en), mock adapters & fixtures, unit tests for policies.
2. **Phase 2** — App shell (sidebar, top bar, breadcrumb), locale routes, role-aware dashboard, core list/detail modules, DataTable, global search, loading/empty/error/denied states.
3. **Phase 3** — Incident / phishing / service-request forms (Zod + mock submit), audit trail, secure headers, field masking, API security, unit/component/E2E tests, CI + Dependabot.
4. **Phase 4** — Full-site validation, documentation suite, quality gates, production-readiness boundary, structured final report.

## Non-goals (all phases)

- Real SSO / Entra ID / SAML
- Real GRC / SIEM / SOAR / OT / ERP connections
- Production deployment
- Real notifications or regulatory submissions
- Real secrets or enterprise data

## Shared patterns

- Experience / Orchestration layer only
- Repository interfaces + Mock adapters
- Server-side authorization on every read/write path
- Demo Data banners on all mock-backed pages
- Neutral demo naming (Plant A, Supplier A, Demo Incident, …)
