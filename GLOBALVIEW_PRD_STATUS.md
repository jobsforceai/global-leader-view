# Global Leadership Command Dashboard (GLCD) — PRD + Status (Backend)

Scope: backend only. Alerts + Rewards explicitly excluded.

---

## Module 1 — Leadership Command & Communication

**Required**
- Leader directory with roles (Country Heads, City/Regional Leaders, Top Traders, SGSE Business Heads, Academy Directors)
- Leader fields: name, country/region/city, role, active/inactive, business volume, last activity/contact date, preferred channel
- Communication health: not contacted recently, high volume + low contact
- Weekly leadership calls: attendance, participation, action items, follow‑ups

**Status**
- ✅ Done: leader directory + leader profile fields + comm logs + follow‑ups + calls tracker
- ✅ Done: communication health enriched with role/market/channel/daysSinceContact/volume
- ⚠️ Pending: “last activity date” separate from last contact (not stored yet)

---

## Module 2 — Business Intelligence & Performance Analytics

**Required**
- Daily & monthly business volume
- Leader scorecards & trends
- High‑growth leaders
- Weak markets / regions needing intervention
- Top regions chart
- Weak & strong legs

**Status**
- ✅ Done: volume trends (daily/weekly/monthly)
- ✅ Done: leader scorecards (volume + growth% + team size + trend + contact age)
- ✅ Done: top leaders + stagnating leaders + high‑growth leaders
- ✅ Done: weak markets + markets needing intervention
- ✅ Done: top regions endpoint
- ⚠️ Pending: weak/strong legs (no rule defined yet)
- ⚠️ Pending: reinvestment rate + retention rate (KPIs currently null placeholders)

---

## Module 3 — Growth & Expansion Tracking

**Required**
- City launches, country expansions, leadership promotions, special growth campaigns
- KPIs, owners, targets vs actuals, notes, post‑campaign performance

**Status**
- ✅ Done: growth events CRUD with objective, marketType, KPIs, snapshots

---

## Module 4 — Campaigns & Campaign Impact

**Required**
- Campaign list + detail
- KPI snapshots
- Impact analysis (baseline vs during vs post)

**Status**
- ✅ Done: campaigns CRUD + impact endpoint

---

## Core KPI Strip (Global)

**Required**
- Global business volume
- Active leader count
- Reinvestment ratio
- Leader retention
- Cities/countries added
- Revenue per leader

**Status**
- ✅ Done: KPI endpoint provides all fields
- ⚠️ Pending: reinvestment ratio + leader retention definitions (currently null)

---

## Role‑Based Access & Admin

**Required**
- CEO/Chief, Country Head, Regional, Analyst, Support roles
- Admin can create/edit/delete/list Global View users
- Scope by geography (countries/regions/cities)

**Status**
- ✅ Done: Global View auth + RBAC + scopes
- ✅ Done: admin create/edit/delete/list endpoints

---

# Separate Project: Live Business Intelligence Dashboard (Not GLCD)

This is a different system with finance/marketing/ROI/investor/rewards data.

**Status: all pending (not implemented).**

## Modules (Pending)
- Master Growth Dashboard (revenue targets, net profit, capital inflow, ROI payouts)
- Leader Performance Dashboard (targets vs achieved, incentives)
- Daily Closure Tracker
- Marketing & Lead Funnel
- Investor Capital & ROI Tracker
- Rewards & Incentive Liability (excluded by request)
- Management KPI Panel
