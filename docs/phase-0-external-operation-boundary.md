# Phase 0 — External Operation Boundary

## Forbidden operations (all phases)

| Operation | Status |
|---|---|
| Production deployment | Forbidden |
| Real email / notification send | Forbidden — mock / dry-run only |
| Real incident / regulatory notification | Forbidden |
| Real SIEM / SOAR / OT / ERP / GRC / HR connection | Forbidden |
| Real account provisioning | Forbidden |
| Real PLC / SCADA / PAM vault operations | Forbidden |
| Real database writes to enterprise systems | Forbidden |
| Real external API calls with side effects | Forbidden |
| Writing secrets to the repository | Forbidden |
| Using real OT IPs, hostnames, employee PII, or credentials | Forbidden |

## Allowed substitutes

- Mock Adapter / Stub / Fixture / Local Test Double
- Dry-run / Demo Submission
- In-memory audit events

## Code delivery note

Cloud Agent delivery may commit and push **portal source code** to a feature branch for PR review. That is repository delivery of this demo application, not an enterprise-system side effect. Application runtime never performs the forbidden operations above.

## Classification of this portal

This website is an **Experience / Orchestration Layer**. It is not the authoritative source for GRC, SIEM, CMDB, OT inventory, or HR data.
