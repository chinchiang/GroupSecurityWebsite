# Integration Guide

All integrations are **Mock / Stub** in this MVP. Browser must never call enterprise backends directly.

## Adapters (planned)

| Adapter | Status | Notes |
|---|---|---|
| GRC | mock | Risks, controls, obligations |
| SIEM / SOAR | stub | Incidents / automation via backend only |
| CMDB / CAASM | mock | Assets |
| IAM / PAM | stub | PAM vault never browser-direct |
| OT Inventory / NDR | mock | Masked identifiers only |
| Supplier / ERP / TPRM | mock/stub | Supplier risk |
| PLM / Product Security | stub | SBOM/PSIRT |
| DSPM / DLP | stub | Data posture |
| LMS | stub | Training |
| ITSM | mock | Service requests |

## API contract (future)

- Auth: OIDC bearer via API gateway
- Authz: same RBAC+ABAC policy engine
- Data minimization + field masking
- Timeouts / retries with idempotency keys
- Every mutation writes audit event
- Errors use unified `{ error: { code, message } }` without stack traces

## Current runtime

`src/adapters/mock/repositories.ts` + `src/adapters/integrations/catalog.ts`
