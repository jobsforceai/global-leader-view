# Leader Performance API — Frontend Integration Guide

Base URL: `/api/globalview/bi`
Auth: All endpoints require `gv_token` cookie or `Authorization: Bearer <token>` header.
Permission: `BI_READ`

---

## 1. GET `/bi/leader-performance` — The Grid

**Purpose:** Single endpoint for the clickable leader performance table. Returns every leader with their identity, contact info, performance metrics, finance, and gap flags in one call.

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number (1-indexed) |
| `limit` | number | `20` | Items per page (max 100) |
| `search` | string | — | Search across name, userId, email, phone, country, city |
| `sortBy` | string | `businessVolume` | Column to sort by (any field from the response object) |
| `sortOrder` | `asc` \| `desc` | `desc` | Sort direction |
| `startDate` | ISO date | Start of current month | Period start for volume/growth calculations |
| `endDate` | ISO date | Today | Period end |
| `status` | `ACTIVE` \| `INACTIVE` | — | Filter by leader status |
| `roleType` | string | — | Filter by role: `COUNTRY_HEAD`, `CITY_LEADER`, `REGIONAL_LEADER`, `TOP_TRADER`, `SGSE_BUSINESS_HEAD`, `ACADEMY_DIRECTOR` |

### Response

```json
{
  "leaders": [
    {
      "userId": "U1234",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "country": "USA",
      "region": "West",
      "city": "Los Angeles",
      "roleType": "COUNTRY_HEAD",
      "preferredChannel": "TELEGRAM",
      "status": "ACTIVE",
      "businessVolume": 15000,
      "growthPercent": 25.5,
      "teamSize": 42,
      "activeLegsCount": 5,
      "totalInvested": 8000,
      "capTotal": 24000,
      "capRemaining": 16000,
      "lastContactAt": "2026-02-18T10:30:00.000Z",
      "daysSinceContact": 2,
      "lastActivityAt": "2026-02-19T08:00:00.000Z",
      "gapFlags": []
    },
    {
      "userId": "U5678",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+9876543210",
      "country": "India",
      "region": "South",
      "city": "Bangalore",
      "roleType": "CITY_LEADER",
      "preferredChannel": "WHATSAPP",
      "status": "ACTIVE",
      "businessVolume": 3200,
      "growthPercent": -12.4,
      "teamSize": 8,
      "activeLegsCount": 3,
      "totalInvested": 2000,
      "capTotal": 6000,
      "capRemaining": 4200,
      "lastContactAt": null,
      "daysSinceContact": null,
      "lastActivityAt": "2026-02-10T14:00:00.000Z",
      "gapFlags": ["NOT_CONTACTED", "DECLINING"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 54
  }
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Unique user identifier |
| `fullName` | string | Leader's full name |
| `email` | string | Email address |
| `phone` | string | Phone number |
| `country` | string | Country |
| `region` | string | Region within country |
| `city` | string | City |
| `roleType` | string \| null | Assigned GV role (null if no profile created yet) |
| `preferredChannel` | string \| null | `TELEGRAM`, `WHATSAPP`, `ZOOM`, `EMAIL`, `OTHER` |
| `status` | string | `ACTIVE` or `INACTIVE` |
| `businessVolume` | number | Total volume in selected period (USD) |
| `growthPercent` | number | % change vs previous period |
| `teamSize` | number | Total downline count (all levels) |
| `activeLegsCount` | number | Number of direct children with active packages |
| `totalInvested` | number | Lifetime total invested (USD) |
| `capTotal` | number | Earnings cap (packageUSD x multiplier) |
| `capRemaining` | number | Remaining earnings capacity |
| `lastContactAt` | ISO date \| null | Last communication log timestamp |
| `daysSinceContact` | number \| null | Days since last contact (null = never contacted) |
| `lastActivityAt` | ISO date \| null | Last platform activity |
| `gapFlags` | string[] | Auto-detected issues (see below) |

### Gap Flags

| Flag | Meaning | When triggered |
|------|---------|----------------|
| `NOT_CONTACTED` | Leader hasn't been contacted | No contact ever, or > 14 days since last contact |
| `DECLINING` | Volume is dropping | `growthPercent < 0` |
| `INACTIVE` | Package is not active | `isPackageActive = false` |

### Sortable Columns

You can pass any response field name as `sortBy`. Common ones:
- `businessVolume` (default) — highest earners first
- `growthPercent` — fastest/slowest growing
- `teamSize` — largest teams
- `daysSinceContact` — most/least recently contacted
- `fullName` — alphabetical
- `capRemaining` — earnings capacity

### Example Requests

```
GET /bi/leader-performance?page=1&limit=20&sortBy=businessVolume&sortOrder=desc
GET /bi/leader-performance?search=john&status=ACTIVE
GET /bi/leader-performance?roleType=COUNTRY_HEAD&sortBy=growthPercent&sortOrder=asc
GET /bi/leader-performance?startDate=2026-01-01&endDate=2026-01-31
```

---

## 2. GET `/bi/leader-performance/:userId` — Detail + Team

**Purpose:** When user clicks a row in the grid, call this endpoint to get the full deep-dive: leader profile, scorecard, team members with individual performance, leg strength, communication summary, follow-ups, call attendance, and gap analysis.

### Path Parameters

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | The leader's userId from the grid |

### Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `startDate` | ISO date | Start of current month | Period start |
| `endDate` | ISO date | Today | Period end |

### Response

```json
{
  "leader": {
    "userId": "U1234",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "country": "USA",
    "region": "West",
    "city": "Los Angeles",
    "isPackageActive": true,
    "packageUSD": 1000,
    "lastActivityAt": "2026-02-19T08:00:00.000Z",
    "roleType": "COUNTRY_HEAD",
    "preferredChannel": "TELEGRAM",
    "managerUserId": "U0001",
    "notes": "Key leader for US West expansion",
    "tags": ["vip", "expansion-lead"]
  },

  "scorecard": {
    "businessVolume": 15000,
    "lifetimeBusinessVolume": 82000,
    "growthPercent": 25.5,
    "reinvestmentRate": 180.5,
    "retentionRate": 100,
    "teamSize": 42,
    "activeLegsCount": 5
  },

  "finance": {
    "totalInvested": 8000,
    "capTotal": 24000,
    "capRemaining": 16000
  },

  "volumeTrend": [
    { "date": "2026-02-01", "value": 1200 },
    { "date": "2026-02-02", "value": 800 },
    { "date": "2026-02-03", "value": 2100 }
  ],

  "legStrength": {
    "threshold": 1500,
    "strong": [
      { "userId": "U2001", "fullName": "Alice Lee", "volume": 5200 },
      { "userId": "U2002", "fullName": "Bob Chen", "volume": 3800 }
    ],
    "weak": [
      { "userId": "U2003", "fullName": "Carol Kim", "volume": 400 }
    ]
  },

  "communicationSummary": {
    "lastContactAt": "2026-02-18T10:30:00.000Z",
    "daysSinceContact": 2,
    "totalLogs": 28
  },

  "recentFollowUps": [
    {
      "id": "65f...",
      "title": "Schedule weekly review call",
      "dueDate": "2026-02-22T00:00:00.000Z",
      "status": "OPEN",
      "notes": "Discuss Q1 targets"
    }
  ],

  "callAttendance": {
    "totalCalls": 12,
    "attended": 10,
    "attendanceRate": 83.33,
    "avgParticipationScore": 2.4,
    "lastAttendedAt": "2026-02-15T14:00:00.000Z",
    "noShowStreak": 0
  },

  "team": [
    {
      "userId": "U2001",
      "fullName": "Alice Lee",
      "email": "alice@example.com",
      "phone": "+1111111111",
      "country": "USA",
      "region": "West",
      "city": "San Francisco",
      "leg": "direct",
      "isPackageActive": true,
      "businessVolume": 3200,
      "lastActivityAt": "2026-02-19T06:00:00.000Z"
    },
    {
      "userId": "U2010",
      "fullName": "Dave Park",
      "email": "dave@example.com",
      "phone": "+2222222222",
      "country": "USA",
      "region": "West",
      "city": "San Francisco",
      "leg": "indirect",
      "isPackageActive": false,
      "businessVolume": 0,
      "lastActivityAt": null
    }
  ],

  "gapAnalysis": {
    "inactiveTeamMembers": 5,
    "decliningVolume": false,
    "notContactedDays": 2,
    "weakLegs": 1,
    "totalTeamMembers": 42,
    "activeTeamMembers": 37
  }
}
```

### Response Sections Explained

#### `leader` — Profile & Contact Info
Everything needed to identify and communicate with this person.

#### `scorecard` — Performance Metrics

| Field | Type | Description |
|-------|------|-------------|
| `businessVolume` | number | Volume in selected period |
| `lifetimeBusinessVolume` | number | All-time volume |
| `growthPercent` | number | % change vs previous period |
| `reinvestmentRate` | number \| null | % reinvested relative to first investment |
| `retentionRate` | number \| null | 100 if active in both periods, 0 if dropped, null if no prior data |
| `teamSize` | number | Total downline count |
| `activeLegsCount` | number | Direct children count |

#### `finance` — Earnings & Cap

| Field | Type | Description |
|-------|------|-------------|
| `totalInvested` | number | Lifetime investment total (USD) |
| `capTotal` | number | Maximum earnings allowed (packageUSD x multiplier) |
| `capRemaining` | number | How much more they can earn before hitting cap |

#### `volumeTrend` — Chart Data
Array of `{ date, value }` objects for plotting a line/bar chart. Daily granularity within the selected period.

#### `legStrength` — Direct Legs Analysis

| Field | Type | Description |
|-------|------|-------------|
| `threshold` | number | Volume threshold for strong/weak classification (currently $1500) |
| `strong` | array | Direct legs with total sub-tree volume >= threshold |
| `weak` | array | Direct legs with total sub-tree volume < threshold |

Each leg entry has: `userId`, `fullName`, `volume` (sum of entire sub-tree under that leg).

#### `communicationSummary` — Contact Health

| Field | Type | Description |
|-------|------|-------------|
| `lastContactAt` | ISO date \| null | When they were last contacted |
| `daysSinceContact` | number \| null | Days since last contact |
| `totalLogs` | number | Total communication log entries |

#### `recentFollowUps` — Latest 5 Follow-ups
Sorted by `dueDate` ascending. Shows upcoming/pending tasks for this leader.

#### `callAttendance` — Weekly Call Track Record

| Field | Type | Description |
|-------|------|-------------|
| `totalCalls` | number | Total calls this leader was tracked for |
| `attended` | number | Calls marked as PRESENT |
| `attendanceRate` | number | Percentage (0-100) |
| `avgParticipationScore` | number \| null | Average participation score (0-3 scale) |
| `lastAttendedAt` | ISO date \| null | Most recent attended call timestamp |
| `noShowStreak` | number | Consecutive recent absences (0 = no streak) |

#### `team` — Full Team Members List
All downline members sorted: **direct children first** (by volume desc), then indirect (by volume desc).

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Team member's userId |
| `fullName` | string | Name |
| `email` | string | Email |
| `phone` | string | Phone |
| `country/region/city` | string | Location |
| `leg` | `direct` \| `indirect` | Direct child of leader, or deeper in tree |
| `isPackageActive` | boolean | Whether package is currently active |
| `businessVolume` | number | Volume in selected period |
| `lastActivityAt` | ISO date \| null | Last platform activity |

#### `gapAnalysis` — Where Are The Gaps

| Field | Type | Description |
|-------|------|-------------|
| `inactiveTeamMembers` | number | Team members with inactive packages |
| `decliningVolume` | boolean | Is this leader's volume declining? |
| `notContactedDays` | number \| null | Days since last contact (null = never) |
| `weakLegs` | number | Count of legs below strength threshold |
| `totalTeamMembers` | number | Total team size |
| `activeTeamMembers` | number | Team members with active packages |

### Error Responses

| Status | Body | When |
|--------|------|------|
| `404` | `{ "message": "Leader not found." }` | Invalid userId |
| `500` | `{ "message": "Error...", "error": "..." }` | Server error |

### Example Requests

```
GET /bi/leader-performance/U1234
GET /bi/leader-performance/U1234?startDate=2026-01-01&endDate=2026-01-31
```

---

## Frontend Implementation Notes

### Recommended UI Flow

1. **Grid Page** — Call `GET /bi/leader-performance` on page load
   - Render as a sortable, searchable data table
   - Show `gapFlags` as colored badges/chips on each row
   - Use `preferredChannel` to show contact method icon
   - Enable click on any row

2. **Detail Page/Drawer** — On row click, call `GET /bi/leader-performance/:userId`
   - **Header section:** `leader` object (name, contact, role, tags)
   - **Metrics cards:** `scorecard` + `finance` values
   - **Chart:** `volumeTrend` as line/bar chart
   - **Leg strength:** Visual indicator (e.g. horizontal bars for strong vs weak)
   - **Team table:** `team` array as a sub-table (filterable by `leg` type, `isPackageActive`)
   - **Sidebar/tabs:** `communicationSummary`, `recentFollowUps`, `callAttendance`
   - **Alert banner:** Use `gapAnalysis` to show warnings at top of detail view

### Using Existing Endpoints Alongside

These new endpoints are self-contained. But for deeper actions the frontend can also call:

| Action | Existing Endpoint |
|--------|-------------------|
| View full communication history | `GET /communication/leaders/:userId/logs` |
| Add a communication log | `POST /communication/leaders/:userId/logs` |
| Create a follow-up task | `POST /communication/leaders/:userId/followups` |
| Edit leader profile (role, tags) | `POST /leaders/:userId/profile` |
| Update weekly call status | `POST /communication/weekly/status` |

### Caching

Grid endpoint is cached server-side (TTL ~15 min). After creating a communication log or follow-up, the grid data won't instantly reflect the change. This is acceptable for dashboard use — data refreshes on next cache expiry or page reload.
