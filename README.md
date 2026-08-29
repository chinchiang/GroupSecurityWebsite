# Cybersecurity Governance & Operations Portal

製造業集團內部資安治理、SOC 營運、IT／Cloud／OT 安全、產品資安、供應鏈風險、法規管理、資安服務及知識管理入口（**Demo／MVP**）。

> **示範資料／Demo Data：** 本專案資料僅用於網站架構與操作展示，不代表任何真實企業、工廠、產品、弱點或資安事件。

## 專案定位

- 正式名稱：Cybersecurity Governance & Operations Portal
- 層級：Experience / Orchestration Layer（非權威資料源）
- 本階段：Mock Auth + Mock Data；無真實企業系統連線

## 技術架構

| 層 | 技術 |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS 4, Radix UI primitives, Lucide |
| Forms | Zod + React Hook Form |
| Tests | Vitest, Testing Library, Playwright |
| Package manager | npm (`package-lock.json`) |

## 快速開始

```bash
npm ci
cp .env.example .env.local
npm run dev
```

開啟 http://localhost:3000 （會導向 `/zh-TW`）。

## 常用指令

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Demo Identity / Role Switcher

- Development：頂部列可切換 Demo Identity（角色）。**不會**建立本機密碼登入。
- Production build：不顯示 Role Switcher；若未設定正式 Auth Provider，顯示 Configuration Error。
- 偏好語言存於 Cookie；**不得**將 Token／Session／權限存入 localStorage。

## 安全注意事項

詳見 [SECURITY.md](./SECURITY.md)。禁止寫入真實 Secret、真實 OT 資訊或企業機密。

## 已知限制

詳見 [MVP_SCOPE.md](./MVP_SCOPE.md) 與 [docs/phase-4-production-readiness-boundary.md](./docs/phase-4-production-readiness-boundary.md)。

## 免責聲明

本系統為內部資安治理與營運輔助平台。平台中的框架對照、指標及示範資料不構成法律意見、認證結論或法規符合性保證。
