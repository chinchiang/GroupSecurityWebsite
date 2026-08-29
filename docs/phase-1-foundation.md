# Phase 1 — Foundation

## Delivered

- Centralized configs: `src/config/site.ts`, `navigation.ts`, `roles.ts`, `features.ts`
- Domain models under `src/domain/models`
- RBAC+ABAC policy engine `src/domain/policies/rbac.ts` with unit tests
- MockAuthProvider + demo sessions + development Role Switcher API
- Repository interfaces + mock adapters
- i18n dictionaries zh-TW / en with locale formatting helpers
- Fixed demo fixtures with neutral naming

## Auth behavior

- No password login
- Production without formal provider → configuration error path in layout
- Role Switcher only when `NODE_ENV === "development"`

## Not in Phase 1

- Full page UI (Phase 2)
- Forms / CI (Phase 3)
