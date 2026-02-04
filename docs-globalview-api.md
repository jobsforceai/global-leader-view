# Global View API (Backend Integration Docs)

Base path
- All endpoints are under ` /api/v1 `
- Global View routes are under ` /api/v1/globalview `

Auth
- Global View uses a separate auth model with JWT tokens.
- Header: `Authorization: Bearer <token>`
- Token is returned by Global View login.

Roles / Permissions
- Roles: SUPER_ADMIN, CHIEF, COUNTRY_HEAD, REGIONAL_LEADER, ANALYST, SUPPORT
- Permissions enforced per route. If insufficient, API returns 403.

Common responses
- Success: `{ ...data }`
- Validation error: `{ message: string }` with status 400
- Auth error: `{ message: string }` with status 401/403
- Server error: `{ message: string, error?: string }` with status 500

Pagination
- For list endpoints with pagination:
  - Request: `?page=1&limit=20`
  - Response:
    - `pagination: { currentPage, totalPages, totalCount }`

Leader definition (Global View)
- A “leader” is any existing User with `activeLegsCount >= 2`.
- active legs = direct children with `isPackageActive = true` AND `packageUSD > 0`.
- This is separate from any other “leader” concept in the main app.

---

## 1) Global View Auth

### POST /globalview/auth/login
Login Global View user.

Request body:
```
{
  "email": "leader@example.com",
  "password": "yourPassword"
}
```

Response (200):
```
{
  "token": "<jwt>",
  "user": {
    "gvUserId": "GV001",
    "fullName": "Amulya",
    "email": "leader@example.com",
    "phone": "+1...",
    "role": "CHIEF",
    "status": "ACTIVE",
    "scopes": { "countries": [], "regions": [], "cities": [] },
    "createdByAdminId": "A001",
    "lastLoginAt": "2026-02-03T12:00:00.000Z"
  }
}
```
Sets cookie:
- `gv_token` (httpOnly, 7 days)

---

## 2) Leader Directory (Module 1)

### GET /globalview/leaders
List leaders based on Global View leader rule.

Query params:
- `page`, `limit`
- `search` (matches userId/fullName/email/phone)
- `roleType` (COUNTRY_HEAD | CITY_LEADER | REGIONAL_LEADER | TOP_TRADER | SGSE_BUSINESS_HEAD | ACADEMY_DIRECTOR)
- `status` (ACTIVE | INACTIVE)

Response (200):
```
{
  "leaders": [
    {
      "userId": "U123",
      "fullName": "Leader Name",
      "email": "leader@example.com",
      "phone": "+1...",
      "country": "India",
      "region": "South",
      "city": "Hyderabad",
      "lastActivityAt": "2026-02-03T10:00:00.000Z",
      "totalInvested": 3500,
      "capTotal": 6250,
      "capRemaining": 1200,
      "status": "active",
      "isPackageActive": true,
      "packageUSD": 1000,
      "activeLegsCount": 2,
      "leaderProfile": {
        "roleType": "CITY_LEADER",
        "status": "ACTIVE",
        "preferredCommunicationChannel": "WHATSAPP",
        "managerUserId": "U100",
        "notes": "...",
        "tags": ["vip"]
      },
      "lastContactAt": "2026-02-01T10:00:00.000Z"
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 1, "totalCount": 1 }
}
```

### GET /globalview/leaders/:userId/profile
Fetch stored leader profile.

Response (200):
```
{ "profile": { "userId": "U123", "roleType": "CITY_LEADER", "status": "ACTIVE" } }
```

### POST /globalview/leaders/:userId/profile
### PATCH /globalview/leaders/:userId/profile
Create or update leader profile.

Request body:
```
{
  "roleType": "CITY_LEADER",
  "status": "ACTIVE",
  "preferredCommunicationChannel": "WHATSAPP",
  "managerUserId": "U100",
  "notes": "...",
  "tags": ["vip", "north-zone"]
}
```

Response (200):
```
{ "message": "Leader profile saved.", "profile": { ... } }
```

---

## 3) Communication & Follow-ups (Module 1)

### Weekly Call Board (Monday–Sunday)

### GET /globalview/communication/weekly/board
Weekly board of all leaders with call status + follow‑up for the week.

Query params:
- `date` (optional ISO date to anchor the week; default = today)

Response (200):
```
{
  "weekStart": "2026-02-03T00:00:00.000Z",
  "weekEnd": "2026-02-09T23:59:59.999Z",
  "leaders": [
    {
      "leaderUserId": "U123",
      "fullName": "Leader Name",
      "phone": "+1...",
      "market": { "country": "IN", "region": "South", "city": "Hyderabad" },
      "weekStart": "2026-02-03T00:00:00.000Z",
      "weekEnd": "2026-02-09T23:59:59.999Z",
      "status": "NOT_CONTACTED",
      "statusNotes": null,
      "followUp": { "id": "...", "dueDate": "2026-02-07T00:00:00.000Z", "status": "OPEN", "notes": "..." }
    }
  ]
}
```

### POST /globalview/communication/weekly/status
Update weekly call status for a leader.

Request body:
```
{
  "leaderUserId": "U123",
  "date": "2026-02-03T10:00:00.000Z",
  "status": "CONTACTED",
  "notes": "Reached on WhatsApp"
}
```

Notes:
- When `status` = `NEED_FOLLOWUP`, `notes` is required.

Response (200):
```
{ "message": "Weekly call status updated.", "status": { ... } }
```

### GET /globalview/communication/weekly/summary
Weekly summary metrics.

Query params:
- `date` (optional ISO date to anchor the week; default = today)

Response (200):
```
{
  "weekStart": "2026-02-03T00:00:00.000Z",
  "weekEnd": "2026-02-09T23:59:59.999Z",
  "totalLeaders": 110,
  "contacted": 35,
  "followUps": 12,
  "statusCounts": {
    "NOT_CONTACTED": 60,
    "CONTACTED": 20,
    "NEED_FOLLOWUP": 12,
    "COMPLETED": 8
  }
}
```

### GET /globalview/communication/health
Communication health summary.

Query params:
- `days` (default 14)
- `minVolume` (default 1000)
- `startDate`, `endDate` (for volume window)

Response (200):
```
{
  "summary": {
    "totalLeaders": 20,
    "contactedWithinDays": 12,
    "contactedPercentage": 60,
    "notContactedCount": 8,
    "cutoffDate": "2026-01-20T00:00:00.000Z",
    "avgDaysSinceContact": 6.2
  },
  "notContacted": [
    {
      "userId": "U123",
      "fullName": "...",
      "roleType": "CITY_LEADER",
      "preferredChannel": "WHATSAPP",
      "market": { "country": "India", "region": "South", "city": "Hyderabad" },
      "lastContactAt": null,
      "daysSinceLastContact": null,
      "businessVolume": 1200
    }
  ],
  "highVolumeLowContact": [
    {
      "userId": "U500",
      "fullName": "...",
      "roleType": "COUNTRY_HEAD",
      "preferredChannel": "TELEGRAM",
      "market": { "country": "India", "region": "West", "city": "Mumbai" },
      "lastContactAt": "2026-01-10T00:00:00.000Z",
      "daysSinceLastContact": 24,
      "businessVolume": 1500
    }
  ]
}
```

### GET /globalview/communication/followups
List follow-ups (owner, status, due date).

Query params:
- `ownerGvUserId`
- `status` (OPEN | IN_PROGRESS | BLOCKED | RESOLVED | IGNORED)
- `dueBefore` (date)
- `page`, `limit`

Response (200):
```
{
  "followUps": [ { "leaderUserId": "U123", "title": "Call", "status": "OPEN", "dueDate": "..." } ],
  "pagination": { "currentPage": 1, "totalPages": 1, "totalCount": 1 }
}
```

### GET /globalview/communication/leaders/:userId/logs
List communication logs for a leader.

Response (200):
```
{
  "logs": [
    {
      "leaderUserId": "U123",
      "contactType": "CALL",
      "outcome": "CONNECTED",
      "nextStep": "Send summary",
      "nextDueDate": "2026-02-05T00:00:00.000Z",
      "notes": "...",
      "createdBy": "GV001",
      "createdAt": "2026-02-03T12:00:00.000Z"
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 1, "totalCount": 1 }
}
```

### POST /globalview/communication/leaders/:userId/logs
Add communication log.

Request body:
```
{
  "contactType": "CALL",
  "outcome": "CONNECTED",
  "nextStep": "Follow up",
  "nextDueDate": "2026-02-05T00:00:00.000Z",
  "notes": "..."
}
```

Response (201):
```
{ "message": "Communication log saved.", "log": { ... } }
```

### POST /globalview/communication/leaders/:userId/followups
Create follow-up for a leader.

Request body:
```
{
  "title": "Schedule review",
  "dueDate": "2026-02-07T00:00:00.000Z",
  "ownerGvUserId": "GV002",
  "status": "OPEN",
  "notes": "..."
}
```

Response (201):
```
{ "message": "Follow-up created.", "followUp": { ... } }
```

---

## 4) Weekly Calls Tracker (Module 1)

### GET /globalview/calls
List calls.

Query params:
- `startDate`, `endDate`
- `page`, `limit`

Response (200):
```
{
  "calls": [
    {
      "callId": "GV-CALL-XXXX",
      "title": "Weekly Call",
      "meetingLink": "https://...",
      "scheduledAt": "...",
      "isRecurring": true,
      "requiredRoles": ["COUNTRY_HEAD"],
      "attendanceSummary": { "total": 10, "present": 8, "attendanceRate": 80 }
    }
  ],
  "pagination": { ... }
}
```

### POST /globalview/calls
Create call.

Request body:
```
{
  "title": "Weekly Leadership Call",
  "meetingLink": "https://...",
  "scheduledAt": "2026-02-07T10:00:00.000Z",
  "isRecurring": true,
  "recurrenceRule": "RRULE:FREQ=WEEKLY;BYDAY=MO",
  "requiredRoles": ["COUNTRY_HEAD", "REGIONAL_LEADER"]
}
```

Response (201):
```
{ "message": "Call created.", "call": { ... } }
```

### GET /globalview/calls/:callId/attendance
List attendance for a call.

Response (200):
```
{ "attendance": [ { "leaderUserId": "U123", "status": "PRESENT", "participationScore": 2 } ] }
```

### POST /globalview/calls/:callId/attendance
Record attendance.

Request body:
```
{
  "leaderUserId": "U123",
  "status": "PRESENT",
  "participationScore": 2,
  "notes": "Spoke on growth."
}
```

Response (200):
```
{ "message": "Attendance recorded.", "attendance": { ... } }
```

### POST /globalview/calls/:callId/action-items
Add call action item.

Request body:
```
{
  "title": "Share campaign plan",
  "ownerGvUserId": "GV003",
  "leaderUserId": "U123",
  "dueDate": "2026-02-10T00:00:00.000Z",
  "status": "OPEN"
}
```

Response (201):
```
{ "message": "Action item created.", "item": { ... } }
```

### GET /globalview/calls/:callId/summary
Get call summary (attendance + action items).

Response (200):
```
{
  "call": { ... },
  "attendance": [ ... ],
  "actionItems": [ ... ],
  "attendanceSummary": { "total": 10, "present": 8, "absent": 2, "attendanceRate": 80 }
}
```

---

## 5) BI & Performance (Module 2)

### GET /globalview/bi/kpis
Global KPIs (some are placeholders until definitions finalized).

Query params:
- `startDate`, `endDate`

Response (200):
```
{
  "globalBusinessVolume": { "value": 12345, "status": "OK" },
  "activeLeaderCount": { "value": 20, "status": "OK" },
  "reinvestmentRatio": { "value": null, "status": "MISSING_DEFINITION" },
  "leaderRetention": { "value": 75.5, "status": "OK" },
  "citiesAdded": { "value": 5, "status": "OK" },
  "countriesAdded": { "value": 2, "status": "OK" },
  "revenuePerLeader": { "value": 617.25, "status": "OK" },
  "lastUpdatedAt": "2026-02-03T12:00:00.000Z"
}
```

### GET /globalview/bi/leader-scorecards
Leader scorecards.

Query params:
- `userIds` (comma-separated list, optional)
- `startDate`, `endDate`
- `page`, `limit`
- `search` (matches userId/fullName/country/region/city)

Response (200):
```
{
  "scorecards": [
    {
      "userId": "U123",
      "fullName": "Leader Name",
      "country": "India",
      "region": "South",
      "city": "Hyderabad",
      "businessVolume": 4500,
      "reinvestmentRate": null,
      "retentionRate": null,
      "growthPercent": 25,
      "consistencyIndicator": null,
      "teamSize": 3,
      "volumeTrend": [ { "date": "2026-02-01", "value": 500 } ],
      "status": "ACTIVE",
      "lastContactDays": 2,
      "lastContactAt": "2026-02-01T10:00:00.000Z",
      "lastActivityAt": "2026-02-03T10:00:00.000Z",
      "legStrength": {
        "threshold": 1500,
        "strong": [ { "userId": "U200", "volume": 2200 } ],
        "weak": [ { "userId": "U201", "volume": 900 } ]
      }
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 5, "totalCount": 87 }
}
```

### GET /globalview/bi/high-growth-leaders
High growth leaders (current period vs previous period).

Query params:
- `startDate`, `endDate`
- `limit`

Response (200):
```
{
  "leaders": [
    {
      "userId": "U123",
      "fullName": "Leader Name",
      "country": "India",
      "region": "South",
      "city": "Hyderabad",
      "currentValue": 5000,
      "previousValue": 2000,
      "growthPercent": 150
    }
  ]
}
```

### GET /globalview/bi/weak-markets
Weak markets by country/region/city with declining volume.

Query params:
- `startDate`, `endDate`
- `thresholdPct` (default 20)

Response (200):
```
{ "markets": [ { "market": { "country": "India", "city": "Hyderabad", "region": "South" }, "currentVolume": 1000, "previousVolume": 2000, "changePercent": -50 } ] }
```

### GET /globalview/bi/volume-trends
Global business volume trend (daily/weekly/monthly).

Query params:
- `startDate`, `endDate`
- `granularity` (daily | weekly | monthly)

Response (200):
```
{ "trends": [ { "label": "2026-02-01", "value": 1500 } ] }
```

### GET /globalview/bi/top-leaders
Top leaders by business volume.

Query params:
- `startDate`, `endDate`
- `limit`
- `mode` (self | team) — default `self`

Response (200):
```
{
  "leaders": [
    {
      "userId": "U123",
      "fullName": "Leader Name",
      "country": "India",
      "region": "South",
      "city": "Hyderabad",
      "businessVolume": 5000,
      "volumeType": "SELF"
    }
  ]
}
```

Notes:
- `mode=self` returns the leader’s own business volume for the period.
- `mode=team` returns **team business volume excluding the leader’s own** (downline only).

### GET /globalview/bi/stagnating-leaders
Leaders with flat/negative growth.

Query params:
- `startDate`, `endDate`
- `thresholdPct` (default 0)
- `limit`

Response (200):
```
{ "leaders": [ { "userId": "U123", "currentValue": 1000, "previousValue": 1200, "growthPercent": -16.6 } ] }
```

### GET /globalview/bi/markets-needing-intervention
Derived weak markets list with a reason code.

Query params:
- `startDate`, `endDate`
- `thresholdPct`

Response (200):
```
{ "markets": [ { "market": { "country": "India", "city": "Hyderabad", "region": "South" }, "currentVolume": 1000, "previousVolume": 2000, "changePercent": -50, "reason": "VOLUME_DROP" } ] }
```

### GET /globalview/bi/daily-closure
Daily Closure Tracker (simplified).

Query params:
- `date` (optional ISO date; default = today)

Response (200):
```
{
  "date": "2026-02-03T00:00:00.000Z",
  "leadsGenerated": 5,
  "newIds": 3,
  "capitalCollected": 12000,
  "presentationsDone": null,
  "conversionRate": null,
  "revenuePerDay": null,
  "closers": [
    { "sponsorId": "U010", "newIds": 2 },
    { "sponsorId": "U020", "newIds": 1 }
  ]
}
```
### GET /globalview/bi/top-regions
Top markets by volume with growth percent.

Query params:
- `startDate`, `endDate`
- `level` (country | region | city)
- `limit`

Response (200):
```
{
  "regions": [
    {
      "market": { "country": "India", "region": "South", "city": "Hyderabad" },
      "currentVolume": 120000,
      "previousVolume": 100000,
      "growthPercent": 20
    }
  ]
}
```

---

## Investors (Global View)

### GET /globalview/investors
List investors (lifetime total investments ≥ configured threshold).

Query params:
- `page`, `limit`
- `search` (matches userId/fullName/email/phone)

Response (200):
```
{
  "investors": [
    {
      "userId": "U123",
      "fullName": "Leader Name",
      "email": "leader@example.com",
      "phone": "+1...",
      "country": "IN",
      "region": "South",
      "city": "Hyderabad",
      "status": "active",
      "isPackageActive": true,
      "totalInvested": 2500,
      "capTotal": 6250,
      "capRemaining": 1200
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 5, "totalCount": 87 }
}
```

Notes:
- Investor rule is configurable in `GLOBALVIEW_INVESTOR_RULES.minLifetimeInvestment`.
- `capRemaining` uses current cycle earnings vs earnings cap.

## 6) Growth & Expansion (Module 3)

### GET /globalview/growth/events
List growth events.

Query params:
- `status` (PLANNED | IN_PROGRESS | COMPLETED)
- `type` (CITY_LAUNCH | COUNTRY_EXPANSION | LEADERSHIP_PROMOTION | CAMPAIGN)
- `page`, `limit`

Response (200):
```
{ "events": [ { "eventId": "GV-GR-XXXX", "type": "CITY_LAUNCH", "name": "Mumbai Launch" } ], "pagination": { ... } }
```

### POST /globalview/growth/events
Create growth event.

Request body:
```
{
  "type": "CITY_LAUNCH",
  "name": "Mumbai Launch",
  "objective": "Launch new market",
  "marketType": "CITY",
  "country": "India",
  "region": "West",
  "city": "Mumbai",
  "leaderOwnerUserId": "U200",
  "internalOwnerGvUserId": "GV001",
  "startDate": "2026-02-10T00:00:00.000Z",
  "endDate": "2026-03-10T00:00:00.000Z",
  "targetKpis": { "volume": 100000, "activations": 50 },
  "actualKpis": { "volume": 10000 },
  "kpiSnapshots": [ { "date": "2026-02-15T00:00:00.000Z", "metrics": { "volume": 20000 } } ],
  "status": "PLANNED",
  "notes": "..."
}
```

Response (201):
```
{ "message": "Growth event created.", "event": { ... } }
```

### GET /globalview/growth/events/:eventId
Get one growth event.

Response (200):
```
{ "event": { "eventId": "GV-GR-XXXX", "name": "Mumbai Launch", "status": "PLANNED" } }
```

### PATCH /globalview/growth/events/:eventId
Update growth event.

Request body: (any event fields)

Response (200):
```
{ "message": "Growth event updated.", "event": { ... } }
```

---

## 7) Campaigns / Campaign Impact

### GET /globalview/campaigns
List campaigns.

Query params:
- `status` (PLANNED | IN_PROGRESS | COMPLETED)
- `page`, `limit`

Response (200):
```
{ "campaigns": [ { "campaignId": "GV-CP-XXXX", "name": "Q1 Growth", "status": "IN_PROGRESS" } ], "pagination": { ... } }
```

### POST /globalview/campaigns
Create campaign.

Request body:
```
{
  "name": "Q1 Growth",
  "objective": "Boost volume",
  "marketType": "COUNTRY",
  "country": "India",
  "ownerGvUserId": "GV001",
  "startDate": "2026-02-01T00:00:00.000Z",
  "endDate": "2026-03-01T00:00:00.000Z",
  "targetKpis": { "volume": 100000 },
  "actualKpis": { "volume": 25000 },
  "kpiSnapshots": [ { "date": "2026-02-10T00:00:00.000Z", "metrics": { "volume": 40000 } } ],
  "status": "IN_PROGRESS",
  "notes": "..."
}
```

Response (201):
```
{ "message": "Campaign created.", "campaign": { ... } }
```

### GET /globalview/campaigns/:campaignId
Get one campaign.

Response (200):
```
{ "campaign": { "campaignId": "GV-CP-XXXX", "name": "Q1 Growth", "status": "IN_PROGRESS" } }
```

### PATCH /globalview/campaigns/:campaignId
Update campaign.

Response (200):
```
{ "message": "Campaign updated.", "campaign": { ... } }
```

### GET /globalview/campaigns/:campaignId/impact
Campaign impact summary (baseline vs campaign vs post).

Response (200):
```
{
  "campaign": { ... },
  "impact": {
    "baseline": 80000,
    "during": 120000,
    "post": 90000,
    "changePercent": 50,
    "baselineWindow": { "start": "2026-01-02T00:00:00.000Z", "end": "2026-02-01T00:00:00.000Z" },
    "campaignWindow": { "start": "2026-02-01T00:00:00.000Z", "end": "2026-03-01T00:00:00.000Z" },
    "postWindow": { "start": "2026-03-01T00:00:00.000Z", "end": "2026-03-31T00:00:00.000Z" }
  },
  "trend": [ { "date": "2026-02-10T00:00:00.000Z", "metrics": { "volume": 40000 } } ]
}
```

---

## 8) Admin: Create Global View Users

### GET /admin/globalview/users
Super Admin only. List Global View users.

Query params:
- `page`, `limit`
- `search` (matches gvUserId/fullName/email/phone)
- `role` (SUPER_ADMIN | CHIEF | COUNTRY_HEAD | REGIONAL_LEADER | ANALYST | SUPPORT)
- `status` (ACTIVE | INACTIVE)

Response (200):
```
{
  "users": [
    {
      "gvUserId": "GV001",
      "fullName": "Amulya",
      "email": "amulya@example.com",
      "phone": "+1...",
      "role": "CHIEF",
      "status": "ACTIVE",
      "scopes": { "countries": ["India"], "regions": ["South"], "cities": ["Hyderabad"] }
    }
  ],
  "pagination": { "currentPage": 1, "totalPages": 1, "totalCount": 1 }
}
```

### POST /admin/globalview/users
Super Admin only. Create Global View user.

Roles (allowed values):
- `SUPER_ADMIN`
- `CHIEF`
- `COUNTRY_HEAD`
- `REGIONAL_LEADER`
- `ANALYST`
- `SUPPORT`

Scopes (optional, used to restrict data visibility by geography):
- `countries`: array of country names (e.g., `["India", "USA"]`)
- `regions`: array of region names (e.g., `["South", "West"]`)
- `cities`: array of city names (e.g., `["Hyderabad", "Mumbai"]`)

Behavior:
- If a scope array is omitted or empty, access is **not restricted** by that dimension.
- Scopes are applied to all Global View data queries (leaders, comms, BI, growth, campaigns).

Request body:
```
{
  "fullName": "Amulya",
  "email": "amulya@example.com",
  "phone": "+1...",
  "password": "Secret123",
  "role": "CHIEF",
  "status": "ACTIVE",
  "scopes": {
    "countries": ["India"],
    "regions": ["South"],
    "cities": ["Hyderabad"]
  }
}
```

Response (201):
```
{ "message": "Global View user created.", "user": { "gvUserId": "GV001", "role": "CHIEF" } }
```

### PATCH /admin/globalview/users/:gvUserId
Super Admin only. Update Global View user.

Request body: (any of the fields below)
```
{
  "fullName": "Amulya",
  "email": "amulya@example.com",
  "phone": "+1...",
  "password": "NewSecret123",
  "role": "CHIEF",
  "status": "ACTIVE",
  "scopes": {
    "countries": ["India"],
    "regions": ["South"],
    "cities": ["Hyderabad"]
  }
}
```

Response (200):
```
{ "message": "Global View user updated.", "user": { "gvUserId": "GV001", "role": "CHIEF" } }
```

### DELETE /admin/globalview/users/:gvUserId
Super Admin only. Delete Global View user.

Response (200):
```
{ "message": "Global View user deleted.", "user": { "gvUserId": "GV001", "role": "CHIEF" } }
```

### POST /admin/globalview/cache/clear
Super Admin only. Clear all Global View cache keys.

Response (200):
```
{ "message": "Global View cache cleared." }
```

---

Notes for frontend
- Global View users are not the same as regular app users/admins.
- Use Global View login endpoint and token for all Global View routes.
- All leader data is derived from existing users based on active legs rule.
