# MVP Scope

## Completed in this MVP

- Next.js App Router portal shell with zh-TW / en locales
- Eight primary navigation areas and required core routes
- Domain models, RBAC+ABAC policy engine, Mock Auth, mock adapters
- Role-aware dashboard with metric metadata
- Core list/detail modules: Risks, Incidents, Regulatory Clock, Assets, Vulnerabilities, Plants, Suppliers, Knowledge, Service Requests
- Demo forms: Incident, Phishing, Service Request (mock submit + audit)
- Global search with authorization filtering
- Secure headers baseline, CI workflow, unit/component/E2E tests
- Documentation suite (README, ARCHITECTURE, SECURITY, CONTENT_GUIDE, INTEGRATION_GUIDE, phase docs)

## Not completed (by design)

- Formal SSO (Entra ID / OIDC / SAML)
- Real GRC / SIEM / SOAR / CMDB / OT / ERP / LMS integrations
- Durable database and enterprise audit storage
- Production secrets management, monitoring, backup, DR
- Formal regulatory submissions or notifications
- Claim of regulatory compliance or certification

## Features using Mock Data

All operational modules. Every mock-backed page shows a Demo Data banner.

## Next-phase formal content needs

- Approved policies / SOPs / training content with owners and review dates
- Verified control library mappings (framework references as metadata only)

## Next-phase integration needs

- Backend API gateway + GRC / SIEM / ITSM / CMDB / OT inventory / TPRM adapters

## Production-required controls before go-live

- Formal SSO + Conditional Access
- Secrets management
- Durable audit log storage
- Data retention / deletion policy
- Monitoring, backup, DR
- Formal security testing and vulnerability scanning
