# Content Guide

## Adding zh-TW / en content

1. Prefer keys in `src/lib/i18n/dictionaries.ts` for UI chrome.
2. For long-form documents, add structured entries under `src/content/zh-TW` and `src/content/en` and load via knowledge fixtures/services.
3. Never invent certified compliance conclusions.

## Metadata rules

Every knowledge/policy item must include `ContentMetadata` fields: owner, classification, audiences, frameworkReferences, version, status, changeHistory.

## Content status

UI must surface: draft, under_review, approved, superseded, expired, unverified, demo.

## Versioning / last verified

Update `version`, `lastVerifiedDate`, and `changeHistory` on every formal edit. Demo content uses `0.1-demo`.

## Must not fabricate

- Real incidents, certifications, OT IPs, employee PII, secrets
- Claims that framework mappings equal compliance

## Labels

Mark Demo / Unverified / Vendor Claim clearly in UI.
